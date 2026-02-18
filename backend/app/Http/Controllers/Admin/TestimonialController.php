<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use App\Services\CloudinaryService;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    protected $cloudinaryService;

    public function __construct(CloudinaryService $cloudinaryService)
    {
        $this->cloudinaryService = $cloudinaryService;
    }

    public function index()
    {
        $testimonials = Testimonial::select('id', 'name', 'content', 'photo', 'country', 'is_active', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $testimonials,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'content' => 'required|string',
            'country' => 'nullable|string|max:255',
            'photo' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:5120',
            'is_active' => 'nullable|in:0,1,true,false',
        ]);

        $data = [
            'name' => $request->name,
            'content' => $request->content,
            'country' => $request->country,
            'is_active' => $request->is_active ? (bool)$request->is_active : true,
        ];

        // Handle photo upload to Cloudinary
        if ($request->hasFile('photo')) {
            $uploadResult = $this->cloudinaryService->uploadImage(
                $request->file('photo'),
                'insilk_yatra/testimonials'
            );

            if ($uploadResult) {
                $data['photo'] = $uploadResult['url'];
            }
        }

        $testimonial = Testimonial::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Testimonial created successfully',
            'data' => $testimonial,
        ], 201);
    }

    public function show($id)
    {
        $testimonial = Testimonial::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $testimonial,
        ]);
    }

    public function update(Request $request, $id)
    {
        $testimonial = Testimonial::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'content' => 'required|string',
            'country' => 'nullable|string|max:255',
            'photo' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:5120',
            'is_active' => 'nullable|in:0,1,true,false',
        ]);

        $data = [
            'name' => $request->name,
            'content' => $request->content,
            'country' => $request->country,
            'is_active' => $request->is_active ? (bool)$request->is_active : $testimonial->is_active,
        ];

        // Handle photo upload to Cloudinary
        if ($request->hasFile('photo')) {
            $uploadResult = $this->cloudinaryService->updateImage(
                $request->file('photo'),
                $testimonial->photo,
                'insilk_yatra/testimonials'
            );

            if ($uploadResult) {
                $data['photo'] = $uploadResult['url'];
            }
        }

        $testimonial->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Testimonial updated successfully',
            'data' => $testimonial,
        ]);
    }

    public function destroy($id)
    {
        $testimonial = Testimonial::findOrFail($id);
        
        // Delete photo from Cloudinary if exists
        if ($testimonial->photo) {
            $publicId = $this->cloudinaryService->getPublicIdFromUrl($testimonial->photo);
            if ($publicId) {
                $this->cloudinaryService->deleteImage($publicId);
            }
        }
        
        $testimonial->delete();

        return response()->json([
            'success' => true,
            'message' => 'Testimonial deleted successfully',
        ]);
    }
}
