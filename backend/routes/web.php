<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'IN-SILK YATRA DMC API',
        'version' => '1.0.0',
    ]);
});
