<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\Request;

class LeadController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'country' => 'nullable|string|max:100',
            'message' => 'nullable|string',
            'tour_id' => 'nullable|exists:tours,id',
            
            // Detailed inquiry fields
            'feeling_description' => 'nullable|string',
            'selected_destination' => 'nullable|string|max:255',
            'travel_start_date' => 'nullable|date',
            'travel_end_date' => 'nullable|date|after_or_equal:travel_start_date',
            'dates_flexible' => 'nullable|boolean',
            'travel_party' => 'nullable|string|max:50',
            'adults_count' => 'nullable|integer|min:1',
            'children_count' => 'nullable|integer|min:0',
            'children_ages' => 'nullable|array',
            'budget_amount' => 'nullable|numeric|min:0',
            'budget_currency' => 'nullable|string|max:10',
            'travel_vibes' => 'nullable|array',
            'special_occasions' => 'nullable|array',
            'accommodation_type' => 'nullable|string|max:255',
            'private_tour_themes' => 'nullable|array',
            'experience_styles' => 'nullable|array',
            'concierge_interests' => 'nullable|array',
            'transfers_drivers' => 'nullable|array',
            'additional_notes' => 'nullable|string',
            'discovery_source' => 'nullable|string|max:100',
        ]);

        $lead = Lead::create([
            'name' => $request->name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'country' => $request->country,
            'message' => $request->message ?? '',
            'tour_id' => $request->tour_id,
            'status' => 'new',
            
            // Detailed inquiry fields
            'feeling_description' => $request->feeling_description,
            'selected_destination' => $request->selected_destination,
            'travel_start_date' => $request->travel_start_date,
            'travel_end_date' => $request->travel_end_date,
            'dates_flexible' => $request->dates_flexible ?? false,
            'travel_party' => $request->travel_party,
            'adults_count' => $request->adults_count,
            'children_count' => $request->children_count,
            'children_ages' => $request->children_ages,
            'budget_amount' => $request->budget_amount,
            'budget_currency' => $request->budget_currency ?? 'EUR',
            'travel_vibes' => $request->travel_vibes,
            'special_occasions' => $request->special_occasions,
            'accommodation_type' => $request->accommodation_type,
            'private_tour_themes' => $request->private_tour_themes,
            'experience_styles' => $request->experience_styles,
            'concierge_interests' => $request->concierge_interests,
            'transfers_drivers' => $request->transfers_drivers,
            'additional_notes' => $request->additional_notes,
            'discovery_source' => $request->discovery_source,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Your inquiry has been submitted successfully. A travel designer will contact you soon.',
            'data' => $lead,
        ], 201);
    }
}
