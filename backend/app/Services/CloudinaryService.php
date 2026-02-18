<?php

namespace App\Services;

use Cloudinary\Cloudinary;
use Cloudinary\Transformation\Resize;
use Illuminate\Http\UploadedFile;

class CloudinaryService
{
    protected $cloudinary;

    public function __construct()
    {
        $this->cloudinary = new Cloudinary([
            'cloud' => [
                'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                'api_key' => env('CLOUDINARY_API_KEY'),
                'api_secret' => env('CLOUDINARY_API_SECRET'),
            ],
            'url' => [
                'secure' => true
            ]
        ]);
    }

    /**
     * Upload image to Cloudinary
     * 
     * @param UploadedFile $file
     * @param string $folder
     * @return array|null
     */
    public function uploadImage(UploadedFile $file, string $folder = 'insilk_yatra'): ?array
    {
        try {
            $uploadResult = $this->cloudinary->uploadApi()->upload(
                $file->getRealPath(),
                [
                    'folder' => $folder,
                    'resource_type' => 'image',
                    'transformation' => [
                        'quality' => 'auto:best',
                        'fetch_format' => 'auto'
                    ]
                ]
            );

            return [
                'url' => $uploadResult['secure_url'],
                'public_id' => $uploadResult['public_id'],
            ];
        } catch (\Exception $e) {
            \Log::error('Cloudinary upload error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Delete image from Cloudinary
     * 
     * @param string $publicId
     * @return bool
     */
    public function deleteImage(string $publicId): bool
    {
        try {
            $result = $this->cloudinary->uploadApi()->destroy($publicId);
            return $result['result'] === 'ok';
        } catch (\Exception $e) {
            \Log::error('Cloudinary delete error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Extract public_id from Cloudinary URL
     * 
     * @param string $url
     * @return string|null
     */
    public function getPublicIdFromUrl(string $url): ?string
    {
        // Extract public_id from URL
        // Example URL: https://res.cloudinary.com/cloud_name/image/upload/v123456/folder/image.jpg
        $pattern = '/\/v\d+\/(.+)\.[^.]+$/';
        if (preg_match($pattern, $url, $matches)) {
            return $matches[1];
        }
        
        // Alternative pattern for URLs without version
        $pattern = '/\/upload\/(.+)\.[^.]+$/';
        if (preg_match($pattern, $url, $matches)) {
            return $matches[1];
        }

        return null;
    }

    /**
     * Update image - deletes old and uploads new
     * 
     * @param UploadedFile $newFile
     * @param string|null $oldImageUrl
     * @param string $folder
     * @return array|null
     */
    public function updateImage(UploadedFile $newFile, ?string $oldImageUrl, string $folder = 'insilk_yatra'): ?array
    {
        // Delete old image if exists
        if ($oldImageUrl) {
            $publicId = $this->getPublicIdFromUrl($oldImageUrl);
            if ($publicId) {
                $this->deleteImage($publicId);
            }
        }

        // Upload new image
        return $this->uploadImage($newFile, $folder);
    }
}
