<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TourController;
use App\Http\Controllers\Api\DestinationController;
use App\Http\Controllers\Api\WishlistController;
use App\Http\Controllers\Api\TestimonialController;
use App\Http\Controllers\Api\LeadController;
use App\Http\Controllers\Api\ContactQueryController;
use App\Http\Controllers\Api\InquiryFormSettingsController;

// Public routes
Route::get('/destinations', [DestinationController::class, 'index']);
Route::get('/destinations/{id}', [DestinationController::class, 'show']);

Route::get('/tours', [TourController::class, 'index']);
Route::get('/tours/slug/{slug}', [TourController::class, 'showBySlug']);
Route::get('/tours/{id}', [TourController::class, 'show']);

Route::get('/testimonials', [TestimonialController::class, 'index']);

Route::get('/inquiry-form-settings', [InquiryFormSettingsController::class, 'index']);

Route::post('/leads', [LeadController::class, 'store']);
Route::post('/contact', [ContactQueryController::class, 'store']);

// Auth routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:api')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::post('/wishlist', [WishlistController::class, 'store']);
    Route::delete('/wishlist/{tourId}', [WishlistController::class, 'destroy']);
});
