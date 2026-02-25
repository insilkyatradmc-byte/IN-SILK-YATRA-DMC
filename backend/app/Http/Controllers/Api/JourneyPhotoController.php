<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JourneyPhoto;

class JourneyPhotoController extends Controller
{
    public function index()
    {
        $photos = JourneyPhoto::where('is_active', true)
            ->orderBy('carousel_number')
            ->orderBy('display_order')
            ->get(['id', 'photo_url', 'carousel_number', 'display_order']);

        // Group by carousel number
        $carousel1 = $photos->where('carousel_number', 1)->pluck('photo_url')->values();
        $carousel2 = $photos->where('carousel_number', 2)->pluck('photo_url')->values();

        return response()->json([
            'success' => true,
            'data' => [
                'carousel1' => $carousel1,
                'carousel2' => $carousel2,
                'all' => $photos
            ],
        ]);
    }
}
