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
            'gallery_photos.*' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:5120',
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

        // Handle gallery photos upload
        if ($request->hasFile('gallery_photos')) {
            $galleryUrls = [];
            foreach ($request->file('gallery_photos') as $file) {
                $uploadResult = $this->cloudinaryService->uploadImage(
                    $file,
                    'insilk_yatra/testimonials/gallery'
                );
                if ($uploadResult) {
                    $galleryUrls[] = $uploadResult['url'];
                }
            }
            if (!empty($galleryUrls)) {
                $data['gallery_photos'] = $galleryUrls;
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
        try {
            \Log::info('=== Testimonial Update Request Started ===', [
                'id' => $id,
                'request_method' => $request->method(),
                'content_type' => $request->header('Content-Type')
            ]);
            
            $testimonial = Testimonial::findOrFail($id);

            // Debug log
            \Log::info('Testimonial Update Request', [
                'has_gallery_photos_files' => $request->hasFile('gallery_photos'),
                'gallery_photos_count' => $request->hasFile('gallery_photos') ? count($request->file('gallery_photos')) : 0,
                'existing_gallery_photos' => $request->input('existing_gallery_photos'),
                'existing_count' => $request->has('existing_gallery_photos') ? count($request->input('existing_gallery_photos', [])) : 0,
                'all_keys' => array_keys($request->all())
            ]);

            // Custom validation to handle FormData arrays
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'content' => 'required|string',
                'country' => 'nullable|string|max:255',
                'photo' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:5120',
                'is_active' => 'nullable|in:0,1,true,false',
                'existing_gallery_photos' => 'nullable|array',
                'existing_gallery_photos.*' => 'nullable|string',
            ]);

            // Validate gallery photos separately to handle FormData array properly
            if ($request->hasFile('gallery_photos')) {
                $request->validate([
                    'gallery_photos.*' => 'image|mimes:jpeg,jpg,png,webp|max:5120',
                ]);
            }

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

        // Handle gallery photos - merge existing with new uploads
        $galleryUrls = [];
        
        // Get existing gallery photos - handle both array formats from FormData
        if ($request->has('existing_gallery_photos')) {
            $existing = $request->input('existing_gallery_photos');
            if (is_array($existing)) {
                $galleryUrls = array_filter($existing, function($url) {
                    return !empty($url) && is_string($url);
                });
            }
        }
        
        // Add new uploaded photos
        if ($request->hasFile('gallery_photos')) {
            foreach ($request->file('gallery_photos') as $file) {
                $uploadResult = $this->cloudinaryService->uploadImage(
                    $file,
                    'insilk_yatra/testimonials/gallery'
                );
                if ($uploadResult) {
                    $galleryUrls[] = $uploadResult['url'];
                }
            }
        }
        
        $data['gallery_photos'] = !empty($galleryUrls) ? array_values($galleryUrls) : null;

        $testimonial->update($data);

        \Log::info('=== Testimonial Update Successful ===', [
            'id' => $id,
            'gallery_photos_count' => count($galleryUrls)
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Testimonial updated successfully',
            'data' => $testimonial,
        ]);
        
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Testimonial Update Validation Error', [
                'errors' => $e->errors()
            ]);
            throw $e;
        } catch (\Exception $e) {
            \Log::error('Testimonial Update Error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to update testimonial: ' . $e->getMessage()
            ], 500);
        }
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
