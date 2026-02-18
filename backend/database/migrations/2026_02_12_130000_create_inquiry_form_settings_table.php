<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inquiry_form_settings', function (Blueprint $table) {
            $table->id();
            $table->string('setting_key')->unique(); // destinations, travel_vibes, etc.
            $table->string('label'); // Display label for admin
            $table->json('options'); // Array of options
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inquiry_form_settings');
    }
};
