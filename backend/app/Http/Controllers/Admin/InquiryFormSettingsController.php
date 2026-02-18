<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\InquiryFormSetting;
use Illuminate\Http\Request;

class InquiryFormSettingsController extends Controller
{
    public function index()
    {
        $settings = InquiryFormSetting::orderBy('sort_order')->get();

        return response()->json([
            'success' => true,
            'data' => $settings,
        ]);
    }

    public function show($id)
    {
        $setting = InquiryFormSetting::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $setting,
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'label' => 'sometimes|string|max:255',
            'options' => 'sometimes|array',
            'options.*' => 'string',
            'is_active' => 'sometimes|boolean',
            'sort_order' => 'sometimes|integer',
        ]);

        $setting = InquiryFormSetting::findOrFail($id);
        $setting->update($request->only(['label', 'options', 'is_active', 'sort_order']));

        return response()->json([
            'success' => true,
            'message' => 'Inquiry form setting updated successfully',
            'data' => $setting,
        ]);
    }
}
