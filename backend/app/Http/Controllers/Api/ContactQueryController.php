<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactQuery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContactQueryController extends Controller
{
    public function index()
    {
        $queries = ContactQuery::latest()->get();
        return response()->json($queries);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'country' => 'nullable|string|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $query = ContactQuery::create($request->all());

        return response()->json(['message' => 'Query submitted successfully', 'query' => $query], 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $query = ContactQuery::findOrFail($id);
        
        $request->validate([
            'status' => 'required|in:new,read,replied'
        ]);

        $query->status = $request->status;
        $query->save();

        return response()->json($query);
    }

    public function destroy($id)
    {
        $query = ContactQuery::findOrFail($id);
        $query->delete();
        return response()->json(['message' => 'Query deleted successfully']);
    }
}
