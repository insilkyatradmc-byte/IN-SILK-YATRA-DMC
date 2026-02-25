<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserProfileController extends Controller
{
    /**
     * Get authenticated user profile
     */
    public function show(Request $request)
    {
        $user = auth('api')->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 401);
        }

        return response()->json([
            'success' => true,
            'data' => $user,
        ]);
    }

    /**
     * Update user profile
     */
    public function update(Request $request)
    {
        $user = auth('api')->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 401);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $user->id,
            'profile_photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'current_password' => 'sometimes|required_with:new_password',
            'new_password' => 'sometimes|required|min:6|confirmed',
        ]);

        $data = $request->only(['name', 'email']);

        // Handle profile photo upload - save directly to public/uploads/profiles
        if ($request->hasFile('profile_photo')) {
            // Delete old photo
            if ($user->profile_photo) {
                $oldPhotoPath = public_path($user->profile_photo);
                if (file_exists($oldPhotoPath)) {
                    unlink($oldPhotoPath);
                }
            }
            $file = $request->file('profile_photo');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('uploads/profiles'), $filename);
            $data['profile_photo'] = 'uploads/profiles/' . $filename;
        }

        // Handle password change
        if ($request->filled('current_password') && $request->filled('new_password')) {
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Current password is incorrect',
                ], 422);
            }
            $data['password'] = Hash::make($request->new_password);
        }

        $user->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => $user->fresh(),
        ]);
    }

    /**
     * Delete profile photo
     */
    public function deletePhoto(Request $request)
    {
        $user = auth('api')->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 401);
        }

        if ($user->profile_photo) {
            $photoPath = public_path($user->profile_photo);
            if (file_exists($photoPath)) {
                unlink($photoPath);
            }
            $user->update(['profile_photo' => null]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Profile photo deleted successfully',
            'data' => $user->fresh(),
        ]);
    }
}
