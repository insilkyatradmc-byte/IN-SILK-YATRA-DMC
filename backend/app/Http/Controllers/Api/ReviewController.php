<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Tour;
use App\Models\Destination;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ReviewController extends Controller
{
    /**
     * Get all approved reviews for a specific entity
     */
    public function index(Request $request)
    {
        $request->validate([
            'type' => 'nullable|in:tour,destination',
            'id' => 'nullable|integer',
            'per_page' => 'nullable|integer|min:1|max:100'
        ]);

        $query = Review::with(['user'])->approved()->latest();

        if ($request->type && $request->id) {
            if ($request->type === 'tour') {
                $query->forTour($request->id);
            } else {
                $query->forDestination($request->id);
            }
        }

        $perPage = $request->per_page ?? 15;
        $reviews = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $reviews,
        ]);
    }

    /**
     * Get reviews statistics for an entity
     */
    public function statistics(Request $request)
    {
        $request->validate([
            'type' => 'required|in:tour,destination',
            'id' => 'required|integer',
        ]);

        $query = Review::approved();
        
        if ($request->type === 'tour') {
            $query->forTour($request->id);
        } else {
            $query->forDestination($request->id);
        }

        $reviews = $query->get();
        $totalReviews = $reviews->count();
        $averageRating = $totalReviews > 0 ? round($reviews->avg('stars'), 1) : 0;

        // Rating distribution
        $ratingDistribution = [];
        for ($i = 5; $i >= 1; $i--) {
            $count = $reviews->where('stars', $i)->count();
            $percentage = $totalReviews > 0 ? round(($count / $totalReviews) * 100) : 0;
            $ratingDistribution[$i] = [
                'count' => $count,
                'percentage' => $percentage
            ];
        }

        return response()->json([
            'success' => true,
            'data' => [
                'total_reviews' => $totalReviews,
                'average_rating' => $averageRating,
                'rating_distribution' => $ratingDistribution,
            ],
        ]);
    }

    /**
     * Store a new review (from logged-in user or guest)
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

        // Get user if authenticated
        $user = auth('api')->user();

        $review = Review::create([
            'user_id' => $user ? $user->id : null,
            'reviewer_name' => $request->reviewer_name,
            'reviewer_email' => $request->reviewer_email,
            'profile_photo' => $photoPath,
            'message' => $request->message,
            'stars' => $request->stars,
            'reviewable_type' => $reviewableType,
            'reviewable_id' => $request->id,
            'status' => 'pending',
            'source' => 'website',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Your review has been submitted and is pending approval. Thank you!',
            'data' => $review,
        ], 201);
    }

    /**
     * Get user's own reviews (authenticated users only)
     */
    public function myReviews(Request $request)
    {
        $user = auth('api')->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 401);
        }

        $reviews = Review::where('user_id', $user->id)
            ->with(['reviewable'])
            ->latest()
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $reviews,
        ]);
    }
}
