<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'reviewer_name',
        'reviewer_email',
        'profile_photo',
        'message',
        'stars',
        'reviewable_type',
        'reviewable_id',
        'status',
        'source',
        'approved_at',
        'approved_by',
    ];

    protected $casts = [
        'stars' => 'integer',
        'approved_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Polymorphic relationship
    public function reviewable()
    {
        return $this->morphTo();
    }

    // User who submitted the review
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Admin who approved the review
    public function approver()
    {
        return $this->belongsTo(Admin::class, 'approved_by');
    }

    // Scopes
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeForTour($query, $tourId)
    {
        return $query->where('reviewable_type', 'App\\Models\\Tour')
                     ->where('reviewable_id', $tourId);
    }

    public function scopeForDestination($query, $destinationId)
    {
        return $query->where('reviewable_type', 'App\\Models\\Destination')
                     ->where('reviewable_id', $destinationId);
    }
}
