<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateAdmin
{
    /**
     * Handle an incoming request.
     *
     * Authenticate admin using Sanctum personal access tokens.
     * This middleware ensures that tokens issued by the Admin model
     * are properly authenticated and the admin guard is set.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated. Token not provided.',
            ], 401);
        }

        // Find the token in the database
        $accessToken = PersonalAccessToken::findToken($token);

        if (!$accessToken) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated. Invalid token.',
            ], 401);
        }

        // Get the tokenable model (should be Admin)
        $admin = $accessToken->tokenable;

        if (!$admin || !($admin instanceof \App\Models\Admin)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated. Token does not belong to an admin.',
            ], 401);
        }

        // Check if admin is active
        if (!$admin->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Account is deactivated.',
            ], 403);
        }

        // Set the authenticated admin using the admin guard
        auth()->guard('admin')->setUser($admin);

        // Update token last used timestamp
        $accessToken->forceFill(['last_used_at' => now()])->save();

        return $next($request);
    }
}
