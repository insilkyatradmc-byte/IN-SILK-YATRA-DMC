<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('journey_photos', function (Blueprint $table) {
            $table->id();
            $table->string('photo_url');
            $table->tinyInteger('carousel_number')->default(1)->comment('1 or 2 for carousel grouping');
            $table->integer('display_order')->default(1);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index(['carousel_number', 'display_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('journey_photos');
    }
};
