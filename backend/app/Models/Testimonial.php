<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'photo',
        'country',
        'content',
        'is_active',
        'gallery_photos',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'gallery_photos' => 'array',
    ];
}
