<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tour extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'price',
        'duration',
        'destination_id',
        'image',
        'itinerary',
        'inclusions',
        'exclusions',
        'featured',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'featured' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function destination()
    {
        return $this->belongsTo(Destination::class);
    }

    public function wishlists()
    {
        return $this->hasMany(Wishlist::class);
    }

    public function testimonials()
    {
        return $this->hasMany(Testimonial::class);
    }

    public function leads()
    {
        return $this->hasMany(Lead::class);
    }
}

