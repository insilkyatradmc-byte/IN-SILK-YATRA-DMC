<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tour;
use App\Services\CloudinaryService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TourController extends Controller
{
    protected $cloudinaryService;

    public function __construct(CloudinaryService $cloudinaryService)
    {
        $this->cloudinaryService = $cloudinaryService;
    }

    public function index()
    {
        $tours = Tour::with(['destination:id,name,country'])
            ->select('id', 'title', 'slug', 'description', 'price', 'duration', 'destination_id', 'image', 'featured', 'is_active', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $tours,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'duration' => 'required|integer|min:1',
            'destination_id' => 'required|exists:destinations,id',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:5120',
            'itinerary' => 'nullable|string',
            'inclusions' => 'nullable|string',
            'exclusions' => 'nullable|string',
            'featured' => 'nullable|in:0,1,true,false',
            'is_active' => 'nullable|in:0,1,true,false',
        ]);

        $data = [
            'title' => $request->title,
            'slug' => Str::slug($request->title),
            'description' => $request->description,
            'price' => $request->price,
            'duration' => $request->duration,
            'destination_id' => $request->destination_id,
            'itinerary' => $request->itinerary,
            'inclusions' => $request->inclusions,
            'exclusions' => $request->exclusions,
            'featured' => $request->featured ? (bool)$request->featured : false,
            'is_active' => $request->is_active ? (bool)$request->is_active : true,
        ];

        // Handle image upload to Cloudinary
        if ($request->hasFile('image')) {
            $uploadResult = $this->cloudinaryService->uploadImage(
                $request->file('image'),
                'insilk_yatra/tours'
            );

            if ($uploadResult) {
                $data['image'] = $uploadResult['url'];
            }
        }

        $tour = Tour::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Tour created successfully',
            'data' => $tour->load('destination'),
        ], 201);
    }

    public function show($id)
    {
        $tour = Tour::with('destination')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $tour,
        ]);
    }

    public function update(Request $request, $id)
    {
        $tour = Tour::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'duration' => 'required|integer|min:1',
            'destination_id' => 'required|exists:destinations,id',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:5120',
            'itinerary' => 'nullable|string',
            'inclusions' => 'nullable|string',
            'exclusions' => 'nullable|string',
            'featured' => 'nullable|in:0,1,true,false',
            'is_active' => 'nullable|in:0,1,true,false',
        ]);

        $data = [
            'title' => $request->title,
            'slug' => Str::slug($request->title),
            'description' => $request->description,
            'price' => $request->price,
            'duration' => $request->duration,
            'destination_id' => $request->destination_id,
            'itinerary' => $request->itinerary,
            'inclusions' => $request->inclusions,
            'exclusions' => $request->exclusions,
            'featured' => $request->featured ? (bool)$request->featured : $tour->featured,
            'is_active' => $request->is_active ? (bool)$request->is_active : $tour->is_active,
        ];

        // Handle image upload to Cloudinary
        if ($request->hasFile('image')) {
            $uploadResult = $this->cloudinaryService->updateImage(
                $request->file('image'),
                $tour->image,
                'insilk_yatra/tours'
            );

            if ($uploadResult) {
                $data['image'] = $uploadResult['url'];
            }
        }

        $tour->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Tour updated successfully',
            'data' => $tour->load('destination'),
        ]);
    }

    public function destroy($id)
    {
        $tour = Tour::findOrFail($id);

        // Delete image from Cloudinary if exists
        if ($tour->image) {
            $publicId = $this->cloudinaryService->getPublicIdFromUrl($tour->image);
            if ($publicId) {
                $this->cloudinaryService->deleteImage($publicId);
            }
        }

        $tour->delete();

        return response()->json([
            'success' => true,
            'message' => 'Tour deleted successfully',
        ]);
    }
}
