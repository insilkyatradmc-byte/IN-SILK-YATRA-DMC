<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InquiryFormSetting;

class InquiryFormSettingsController extends Controller
{
    public function index()
    {
        $settings = InquiryFormSetting::where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->mapWithKeys(function ($setting) {
                return [$setting->setting_key => $setting->options];
            });

        return response()->json([
            'success' => true,
            'data' => $settings,
        ]);
    }
}
