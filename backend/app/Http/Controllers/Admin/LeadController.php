<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\Request;

class LeadController extends Controller
{
    public function index()
    {
        $leads = Lead::with(['tour:id,title,slug'])
            ->select('id', 'name', 'email', 'phone', 'tour_id', 'message', 'status', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $leads,
        ]);
    }

    public function show($id)
    {
        $lead = Lead::with('tour')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $lead,
        ]);
    }

    public function update(Request $request, $id)
    {
        $lead = Lead::findOrFail($id);

        $request->validate([
            'status' => 'required|in:new,contacted,converted,closed',
        ]);

        $lead->update([
            'status' => $request->status,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Lead status updated successfully',
            'data' => $lead,
        ]);
    }
}
