<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tour;
use App\Models\User;
use App\Models\Lead;
use App\Models\Destination;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'tours_count' => Tour::count(),
            'active_tours_count' => Tour::where('is_active', true)->count(),
            'users_count' => User::count(),
            'leads_count' => Lead::count(),
            'new_leads_count' => Lead::where('status', 'new')->count(),
            'destinations_count' => Destination::count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }
}
