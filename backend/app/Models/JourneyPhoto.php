<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JourneyPhoto extends Model
{
    use HasFactory;

    protected $fillable = [
        'photo_url',
        'carousel_number', // 1 or 2
        'display_order',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'carousel_number' => 'integer',
        'display_order' => 'integer'
    ];
}
