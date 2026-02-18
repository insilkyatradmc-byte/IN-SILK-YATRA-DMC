<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InquiryFormSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'setting_key',
        'label',
        'options',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'options' => 'array',
        'is_active' => 'boolean',
    ];
}
