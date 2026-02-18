<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('leads', function (Blueprint $table) {
            // Step 1: Feeling/Description
            $table->text('feeling_description')->nullable()->after('message');
            
            // Step 2: Destination
            $table->string('selected_destination')->nullable()->after('tour_id');
            
            // Step 3: Travel Dates
            $table->date('travel_start_date')->nullable();
            $table->date('travel_end_date')->nullable();
            $table->boolean('dates_flexible')->default(false);
            
            // Step 4: Travel Party
            $table->string('travel_party')->nullable(); // 'solo', 'partner', 'family', 'friends', 'other'
            
            // Step 5: Travelers
            $table->integer('adults_count')->nullable();
            $table->integer('children_count')->nullable();
            $table->text('children_ages')->nullable(); // JSON array of ages
            
            // Step 6: Budget
            $table->decimal('budget_amount', 10, 2)->nullable();
            $table->string('budget_currency', 10)->default('EUR');
            
            // Step 7: Travel Style
            $table->json('travel_vibes')->nullable(); // Array of selected vibes
            $table->json('special_occasions')->nullable(); // Array of special occasions
            
            // Step 8: Accommodation
            $table->string('accommodation_type')->nullable();
            
            // Step 9: Trip Elevation
            $table->json('private_tour_themes')->nullable();
            $table->json('experience_styles')->nullable();
            $table->json('concierge_interests')->nullable();
            $table->json('transfers_drivers')->nullable();
            
            // Step 10: Personal Info (already have name, email, phone)
            $table->string('last_name')->nullable()->after('name');
            $table->string('country')->nullable();
            $table->text('additional_notes')->nullable();
            
            // Step 11: How did you discover us
            $table->string('discovery_source')->nullable(); // 'referral', 'travel_agent', 'google', etc.
        });
    }

    public function down(): void
    {
        Schema::table('leads', function (Blueprint $table) {
            $table->dropColumn([
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
                'last_name',
                'country',
                'additional_notes',
                'discovery_source'
            ]);
        });
    }
};
