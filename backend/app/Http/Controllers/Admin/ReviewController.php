<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Tour;
use App\Models\Destination;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ReviewController extends Controller
{
    /**
     * Get all reviews (with filtering)
     */
    public function index(Request $request)
    {
        $query = Review::with(['user', 'reviewable', 'approver'])->latest();

        // Filter by status
        if ($request->has('status') && in_array($request->status, ['pending', 'approved', 'rejected'])) {
            $query->where('status', $request->status);
        }

        // Filter by source
        if ($request->has('source') && in_array($request->source, ['website', 'admin'])) {
            $query->where('source', $request->source);
        }

        // Filter by type
        if ($request->has('type') && in_array($request->type, ['tour', 'destination'])) {
            $type = $request->type === 'tour' ? 'App\\Models\\Tour' : 'App\\Models\\Destination';
            $query->where('reviewable_type', $type);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('reviewer_name', 'like', "%{$search}%")
                  ->orWhere('message', 'like', "%{$search}%")
                  ->orWhere('reviewer_email', 'like', "%{$search}%");
            });
        }

        $perPage = $request->per_page ?? 15;
        $reviews = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $reviews,
        ]);
    }

    /**
     * Get a single review
     */
    public function show($id)
    {
        $review = Review::with(['user', 'reviewable', 'approver'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $review,
        ]);
    }

    /**
     * Create a new review (by admin)
     */
    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|in:tour,destination',
            'id' => 'required|integer',
            'reviewer_name' => 'required|string|max:255',
            'reviewer_email' => 'nullable|email|max:255',
            'message' => 'required|string|min:10',
            'stars' => 'required|integer|min:1|max:5',
            'profile_photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'status' => 'nullable|in:pending,approved,rejected',
        ]);

        // Verify the entity exists
        if ($request->type === 'tour') {
            $entity = Tour::findOrFail($request->id);
            $reviewableType = 'App\\Models\\Tour';
        } else {
            $entity = Destination::findOrFail($request->id);
            $reviewableType = 'App\\Models\\Destination';
        }

        // Handle photo upload - save directly to public/uploads/reviews
        $photoPath = null;
        if ($request->hasFile('profile_photo')) {
            $file = $request->file('profile_photo');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('uploads/reviews'), $filename);
            $photoPath = 'uploads/reviews/' . $filename;
        }

        $admin = auth('admin')->user();
        $status = $request->status ?? 'approved'; // Admin reviews are approved by default

        $review = Review::create([
            'user_id' => null,
            'reviewer_name' => $request->reviewer_name,
            'reviewer_email' => $request->reviewer_email,
            'profile_photo' => $photoPath,
            'message' => $request->message,
            'stars' => $request->stars,
            'reviewable_type' => $reviewableType,
            'reviewable_id' => $request->id,
            'status' => $status,
            'source' => 'admin',
            'approved_at' => $status === 'approved' ? now() : null,
            'approved_by' => $status === 'approved' ? $admin->id : null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Review created successfully',
            'data' => $review->load(['reviewable']),
        ], 201);
    }

    /**
     * Update a review
     */
    public function update(Request $request, $id)
    {
        $review = Review::findOrFail($id);

        $request->validate([
            'reviewer_name' => 'sometimes|required|string|max:255',
            'reviewer_email' => 'nullable|email|max:255',
            'message' => 'sometimes|required|string|min:10',
            'stars' => 'sometimes|required|integer|min:1|max:5',
            'profile_photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'status' => 'nullable|in:pending,approved,rejected',
        ]);

        $data = $request->only(['reviewer_name', 'reviewer_email', 'message', 'stars']);

        // Handle photo upload - save directly to public/uploads/reviews
        if ($request->hasFile('profile_photo')) {
            // Delete old photo
            if ($review->profile_photo) {
                $oldPhotoPath = public_path($review->profile_photo);
                if (file_exists($oldPhotoPath)) {
                    unlink($oldPhotoPath);
                }
            }
            $file = $request->file('profile_photo');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('uploads/reviews'), $filename);
            $data['profile_photo'] = 'uploads/reviews/' . $filename;
        }

        // Handle status change
        if ($request->has('status')) {
            $data['status'] = $request->status;
            if ($request->status === 'approved' && $review->status !== 'approved') {
                $admin = auth('admin')->user();
                $data['approved_at'] = now();
                $data['approved_by'] = $admin->id;
            } elseif ($request->status !== 'approved') {
                $data['approved_at'] = null;
                $data['approved_by'] = null;
            }
        }

        $review->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Review updated successfully',
            'data' => $review->fresh(['reviewable', 'approver']),
        ]);
    }

    /**
     * Approve a review
     */
    public function approve($id)
    {
        $review = Review::findOrFail($id);
        $admin = auth('admin')->user();

        $review->update([
            'status' => 'approved',
            'approved_at' => now(),
            'approved_by' => $admin->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Review approved successfully',
            'data' => $review->fresh(['reviewable', 'approver']),
        ]);
    }

    /**
     * Reject a review
     */
    public function reject($id)
    {
        $review = Review::findOrFail($id);

        $review->update([
            'status' => 'rejected',
            'approved_at' => null,
            'approved_by' => null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Review rejected',
            'data' => $review->fresh(['reviewable']),
        ]);
    }

    /**
     * Delete a review
     */
    public function destroy($id)
    {
        $review = Review::findOrFail($id);

        // Delete photo if exists
        if ($review->profile_photo) {
            $photoPath = public_path($review->profile_photo);
            if (file_exists($photoPath)) {
                unlink($photoPath);
            }
        }

        $review->delete();

        return response()->json([
            'success' => true,
            'message' => 'Review deleted successfully',
        ]);
    }

    /**
     * Get dashboard statistics
     */
    public function statistics()
    {
        $stats = [
            'total' => Review::count(),
            'pending' => Review::where('status', 'pending')->count(),
            'approved' => Review::where('status', 'approved')->count(),
            'rejected' => Review::where('status', 'rejected')->count(),
            'from_website' => Review::where('source', 'website')->count(),
            'from_admin' => Review::where('source', 'admin')->count(),
            'recent_pending' => Review::pending()->latest()->take(5)->get(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }
}
