<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JourneyPhoto;
use App\Services\CloudinaryService;
use Illuminate\Http\Request;

class JourneyPhotoController extends Controller
{
    protected $cloudinaryService;

    public function __construct(CloudinaryService $cloudinaryService)
    {
        $this->cloudinaryService = $cloudinaryService;
    }

    public function index()
    {
        $photos = JourneyPhoto::orderBy('carousel_number')
            ->orderBy('display_order')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $photos,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpeg,jpg,png,webp,heic|max:10240',
            'carousel_number' => 'required|in:1,2',
            'display_order' => 'nullable|integer|min:1',
            'is_active' => 'nullable|boolean',
        ]);

        // Auto-calculate display_order if not provided
        $displayOrder = $request->display_order;
        if (!$displayOrder) {
            $maxOrder = JourneyPhoto::where('carousel_number', $request->carousel_number)->max('display_order');
            $displayOrder = $maxOrder ? $maxOrder + 1 : 1;
        }

        $data = [
            'carousel_number' => $request->carousel_number,
            'display_order' => $displayOrder,
            'is_active' => $request->is_active ?? true,
        ];

        // Upload photo to Cloudinary
        if ($request->hasFile('photo')) {
            $uploadResult = $this->cloudinaryService->uploadImage(
                $request->file('photo'),
                'insilk_yatra/journey_photos'
            );

            if ($uploadResult) {
                $data['photo_url'] = $uploadResult['url'];
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to upload photo',
                ], 500);
            }
        }

        $photo = JourneyPhoto::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Journey photo added successfully',
            'data' => $photo,
        ], 201);
    }

    public function show($id)
    {
        $photo = JourneyPhoto::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $photo,
        ]);
    }

    public function update(Request $request, $id)
    {
        $photo = JourneyPhoto::findOrFail($id);

        $request->validate([
            'photo' => 'nullable|image|mimes:jpeg,jpg,png,webp,heic|max:10240',
            'carousel_number' => 'required|in:1,2',
            'display_order' => 'required|integer|min:1',
            'is_active' => 'nullable|boolean',
        ]);

        $data = [
            'carousel_number' => $request->carousel_number,
            'display_order' => $request->display_order,
            'is_active' => $request->is_active ?? $photo->is_active,
        ];

        // Handle photo upload to Cloudinary
        if ($request->hasFile('photo')) {
            $uploadResult = $this->cloudinaryService->updateImage(
                $request->file('photo'),
                $photo->photo_url,
                'insilk_yatra/journey_photos'
            );

            if ($uploadResult) {
                $data['photo_url'] = $uploadResult['url'];
            }
        }

        $photo->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Journey photo updated successfully',
            'data' => $photo,
        ]);
    }

    public function destroy($id)
    {
        $photo = JourneyPhoto::findOrFail($id);
        
        // Delete photo from Cloudinary if exists
        if ($photo->photo_url) {
            $publicId = $this->cloudinaryService->getPublicIdFromUrl($photo->photo_url);
            if ($publicId) {
                $this->cloudinaryService->deleteImage($publicId);
            }
        }
        
        $photo->delete();

        return response()->json([
            'success' => true,
            'message' => 'Journey photo deleted successfully',
        ]);
    }

    public function updateOrder(Request $request)
    {
        $request->validate([
            'photos' => 'required|array',
            'photos.*.id' => 'required|integer|exists:journey_photos,id',
            'photos.*.display_order' => 'required|integer|min:1',
        ]);

        foreach ($request->photos as $photoData) {
            JourneyPhoto::where('id', $photoData['id'])->update([
                'display_order' => $photoData['display_order']
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Photo order updated successfully',
        ]);
    }
}
