<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('testimonials', function (Blueprint $table) {
            $table->string('photo')->nullable()->after('name');
            $table->string('country')->nullable()->after('photo');
            $table->dropForeign(['tour_id']);
            $table->dropColumn('tour_id');
            $table->dropColumn('rating');
        });
    }

    public function down(): void
    {
        Schema::table('testimonials', function (Blueprint $table) {
            $table->dropColumn(['photo', 'country']);
            $table->foreignId('tour_id')->nullable()->constrained('tours')->onDelete('set null');
            $table->integer('rating')->default(5);
        });
    }
};
