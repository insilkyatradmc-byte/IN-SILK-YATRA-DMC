<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $wishlist = Wishlist::with('tour.destination')
            ->where('user_id', $user->id)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $wishlist,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'tour_id' => 'required|exists:tours,id',
        ]);

        $user = auth()->user();

        // Check if already in wishlist
        $existing = Wishlist::where('user_id', $user->id)
            ->where('tour_id', $request->tour_id)
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'Tour already in wishlist',
            ], 400);
        }

        $wishlist = Wishlist::create([
            'user_id' => $user->id,
            'tour_id' => $request->tour_id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Tour added to wishlist',
            'data' => $wishlist->load('tour.destination'),
        ], 201);
    }

    public function destroy($tourId)
    {
        $user = auth()->user();
        $wishlist = Wishlist::where('user_id', $user->id)
            ->where('tour_id', $tourId)
            ->firstOrFail();

        $wishlist->delete();

        return response()->json([
            'success' => true,
            'message' => 'Tour removed from wishlist',
        ]);
    }
}
