<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use App\Services\CloudinaryService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DestinationController extends Controller
{
    protected $cloudinaryService;

    public function __construct(CloudinaryService $cloudinaryService)
    {
        $this->cloudinaryService = $cloudinaryService;
    }

    public function index()
    {
        $destinations = Destination::select('id', 'name', 'slug', 'description', 'country', 'image', 'is_active', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $destinations,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'country' => 'required|string|in:Kazakhstan,Kyrgyzstan,Azerbaijan',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:5120',
            'is_active' => 'boolean',
        ]);

        $data = [
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
            'country' => $request->country,
            'is_active' => $request->is_active ? (bool)$request->is_active : true,
        ];

        // Handle image upload to Cloudinary
        if ($request->hasFile('image')) {
            $uploadResult = $this->cloudinaryService->uploadImage(
                $request->file('image'),
                'insilk_yatra/destinations'
            );

            if ($uploadResult) {
                $data['image'] = $uploadResult['url'];
            }
        }

        $destination = Destination::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Destination created successfully',
            'data' => $destination,
        ], 201);
    }

    public function show($id)
    {
        $destination = Destination::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $destination,
        ]);
    }

    public function update(Request $request, $id)
    {
        $destination = Destination::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'country' => 'required|string|in:Kazakhstan,Kyrgyzstan,Azerbaijan',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:5120',
            'is_active' => 'boolean',
        ]);

        $data = [
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
            'country' => $request->country,
            'is_active' => $request->is_active ? (bool)$request->is_active : $destination->is_active,
        ];

        // Handle image upload to Cloudinary
        if ($request->hasFile('image')) {
            $uploadResult = $this->cloudinaryService->updateImage(
                $request->file('image'),
                $destination->image,
                'insilk_yatra/destinations'
            );

            if ($uploadResult) {
                $data['image'] = $uploadResult['url'];
            }
        }

        $destination->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Destination updated successfully',
            'data' => $destination,
        ]);
    }

    public function destroy($id)
    {
        $destination = Destination::findOrFail($id);

        // Delete image from Cloudinary if exists
        if ($destination->image) {
            $publicId = $this->cloudinaryService->getPublicIdFromUrl($destination->image);
            if ($publicId) {
                $this->cloudinaryService->deleteImage($publicId);
            }
        }

        $destination->delete();

        return response()->json([
            'success' => true,
            'message' => 'Destination deleted successfully',
        ]);
    }
}
