<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'last_name',
        'email',
        'phone',
        'message',
        'tour_id',
        'status',
        'feeling_description',
        'selected_destination',
        'travel_start_date',
        'travel_end_date',
        'dates_flexible',
        'travel_party',
        'adults_count',
        'children_count',
        'children_ages',
        'budget_amount',
        'budget_currency',
        'travel_vibes',
        'special_occasions',
        'accommodation_type',
        'private_tour_themes',
        'experience_styles',
        'concierge_interests',
        'transfers_drivers',
        'country',
        'additional_notes',
        'discovery_source',
    ];

    protected $casts = [
        'dates_flexible' => 'boolean',
        'travel_vibes' => 'array',
        'special_occasions' => 'array',
        'private_tour_themes' => 'array',
        'experience_styles' => 'array',
        'concierge_interests' => 'array',
        'transfers_drivers' => 'array',
        'children_ages' => 'array',
        'travel_start_date' => 'date',
        'travel_end_date' => 'date',
    ];

    public function tour()
    {
        return $this->belongsTo(Tour::class);
    }
}
