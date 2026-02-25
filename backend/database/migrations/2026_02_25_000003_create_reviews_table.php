<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('reviewer_name');
            $table->string('reviewer_email')->nullable();
            $table->string('profile_photo')->nullable();
            $table->text('message');
            $table->integer('stars')->default(5); // 1-5 rating
            
            // Polymorphic relation - can be for tour or destination
            $table->string('reviewable_type'); // 'App\Models\Tour' or 'App\Models\Destination'
            $table->unsignedBigInteger('reviewable_id');
            
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->enum('source', ['website', 'admin'])->default('website');
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('admins')->onDelete('set null');
            
            $table->timestamps();
            
            $table->index(['reviewable_type', 'reviewable_id']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
