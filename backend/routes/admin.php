<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\TourController;
use App\Http\Controllers\Admin\DestinationController;
use App\Http\Controllers\Admin\TestimonialController;
use App\Http\Controllers\Admin\LeadController;
use App\Http\Controllers\Api\ContactQueryController;
use App\Http\Controllers\Admin\InquiryFormSettingsController;

// Admin auth routes (public)
Route::post('/login', [AdminAuthController::class, 'login']);

// Protected admin routes
// Use custom admin authentication middleware that properly validates
// Sanctum personal access tokens issued for the Admin model.
Route::middleware('auth.admin')->group(function () {
    Route::post('/logout', [AdminAuthController::class, 'logout']);

    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Tours CRUD
    Route::get('/tours', [TourController::class, 'index']);
    Route::post('/tours', [TourController::class, 'store']);
    Route::get('/tours/{id}', [TourController::class, 'show']);
    Route::post('/tours/{id}', [TourController::class, 'update']); // Use POST for FormData with images
    Route::delete('/tours/{id}', [TourController::class, 'destroy']);

    // Destinations CRUD
    Route::get('/destinations', [DestinationController::class, 'index']);
    Route::post('/destinations', [DestinationController::class, 'store']);
    Route::get('/destinations/{id}', [DestinationController::class, 'show']);
    Route::post('/destinations/{id}', [DestinationController::class, 'update']); // Use POST for FormData with images
    Route::delete('/destinations/{id}', [DestinationController::class, 'destroy']);

    // Testimonials CRUD
    Route::get('/testimonials', [TestimonialController::class, 'index']);
    Route::post('/testimonials', [TestimonialController::class, 'store']);
    Route::get('/testimonials/{id}', [TestimonialController::class, 'show']);
    Route::post('/testimonials/{id}', [TestimonialController::class, 'update']); // Use POST for FormData with images
    Route::delete('/testimonials/{id}', [TestimonialController::class, 'destroy']);

    // Leads (read-only, status update only)
    Route::get('/leads', [LeadController::class, 'index']);
    Route::get('/leads/{id}', [LeadController::class, 'show']);
    Route::patch('/leads/{id}', [LeadController::class, 'update']);

    // Contact Queries
    Route::get('/queries', [ContactQueryController::class, 'index']);
    Route::put('/queries/{id}/status', [ContactQueryController::class, 'updateStatus']);
    Route::delete('/queries/{id}', [ContactQueryController::class, 'destroy']);

    // Inquiry Form Settings
    Route::get('/inquiry-form-settings', [InquiryFormSettingsController::class, 'index']);
    Route::post('/inquiry-form-settings', [InquiryFormSettingsController::class, 'store']);
    Route::get('/inquiry-form-settings/{id}', [InquiryFormSettingsController::class, 'show']);
    Route::put('/inquiry-form-settings/{id}', [InquiryFormSettingsController::class, 'update']);
    Route::delete('/inquiry-form-settings/{id}', [InquiryFormSettingsController::class, 'destroy']);
});
