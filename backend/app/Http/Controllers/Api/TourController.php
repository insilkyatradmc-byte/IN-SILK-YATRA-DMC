<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tour;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class TourController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Tour::with('destination')
                ->where('is_active', true);

            // Filter by destination
            if ($request->has('destination_id')) {
                $query->where('destination_id', $request->destination_id);
            }

            // Filter featured tours
            if ($request->has('featured')) {
                $featured = $request->featured;
                // Handle string "true" or boolean true
                if ($featured === 'true' || $featured === true || $featured === '1' || $featured === 1) {
                    $query->where('featured', true);
                }
            }

            $tours = $query->get();

            // Check if user is authenticated and add wishlist status
            // Only check auth if a token is present in the request
            $authHeader = $request->header('Authorization');
            if ($authHeader && (strpos($authHeader, 'Bearer ') === 0)) {
                try {
                    $token = str_replace('Bearer ', '', $authHeader);
                    if (!empty($token)) {
                        JWTAuth::setToken($token);
                        if (auth('api')->check()) {
                            $user = auth('api')->user();
                            if ($user) {
                                $wishlistTourIds = $user->wishlist()->pluck('tour_id')->toArray();

                                $tours = $tours->map(function ($tour) use ($wishlistTourIds) {
                                    $tour->in_wishlist = in_array($tour->id, $wishlistTourIds);
                                    return $tour;
                                });
                            }
                        }
                    }
                } catch (\Exception $e) {
                    // If auth fails, just continue without wishlist status
                    // This is expected when token is invalid
                }
            }

            return response()->json([
                'success' => true,
                'data' => $tours,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching tours: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $tour = Tour::with('destination')->findOrFail($id);

            if (!$tour->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tour not found',
                ], 404);
            }

            // Check wishlist status if authenticated
            // Only check auth if a token is present in the request
            $request = request();
            $authHeader = $request->header('Authorization');
            if ($authHeader && (strpos($authHeader, 'Bearer ') === 0)) {
                try {
                    $token = str_replace('Bearer ', '', $authHeader);
                    if (!empty($token)) {
                        JWTAuth::setToken($token);
                        if (auth('api')->check()) {
                            $user = auth('api')->user();
                            if ($user) {
                                $tour->in_wishlist = $user->wishlist()->where('tour_id', $tour->id)->exists();
                            }
                        }
                    }
                } catch (\Exception $e) {
                    // If auth fails, just continue without wishlist status
                }
            }

            return response()->json([
                'success' => true,
                'data' => $tour,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching tour: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function showBySlug($slug)
    {
        try {
            $tour = Tour::with('destination')->where('slug', $slug)->firstOrFail();

            if (!$tour->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tour not found',
                ], 404);
            }

            // Check wishlist status if authenticated
            // Only check auth if a token is present in the request
            $request = request();
            $authHeader = $request->header('Authorization');
            if ($authHeader && (strpos($authHeader, 'Bearer ') === 0)) {
                try {
                    $token = str_replace('Bearer ', '', $authHeader);
                    if (!empty($token)) {
                        JWTAuth::setToken($token);
                        if (auth('api')->check()) {
                            $user = auth('api')->user();
                            if ($user) {
                                $tour->in_wishlist = $user->wishlist()->where('tour_id', $tour->id)->exists();
                            }
                        }
                    }
                } catch (\Exception $e) {
                    // If auth fails, just continue without wishlist status
                }
            }

            return response()->json([
                'success' => true,
                'data' => $tour,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching tour: ' . $e->getMessage(),
            ], 500);
        }
    }
}
