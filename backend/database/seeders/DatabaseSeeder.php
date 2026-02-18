<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\User;
use App\Models\Admin;
use App\Models\Destination;
use App\Models\Tour;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create roles (use firstOrCreate to avoid duplicates)
        $adminRole = Role::firstOrCreate(
            ['name' => 'admin'],
            [
                'display_name' => 'Admin',
                'description' => 'Full access administrator',
            ]
        );

        $subAdminRole = Role::firstOrCreate(
            ['name' => 'sub_admin'],
            [
                'display_name' => 'Sub Admin',
                'description' => 'Limited access administrator',
            ]
        );

        $userRole = Role::firstOrCreate(
            ['name' => 'user'],
            [
                'display_name' => 'User',
                'description' => 'Regular user',
            ]
        );

        // Create admin user (use updateOrCreate to avoid duplicates)
        Admin::updateOrCreate(
            ['email' => 'admin@insilkyatra.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('insilkyatradmc'),
                'role_id' => $adminRole->id,
                'is_active' => true,
            ]
        );

        // Create destinations (use firstOrCreate to avoid duplicates)
        $kazakhstan = Destination::firstOrCreate(
            ['slug' => 'almaty'],
            [
                'name' => 'Almaty',
                'description' => 'The cultural capital of Kazakhstan, nestled at the foot of the Trans-Ili Alatau mountains.',
                'country' => 'Kazakhstan',
                'is_active' => true,
            ]
        );

        $kyrgyzstan = Destination::firstOrCreate(
            ['slug' => 'bishkek'],
            [
                'name' => 'Bishkek',
                'description' => 'The vibrant capital of Kyrgyzstan, gateway to the Tien Shan mountains.',
                'country' => 'Kyrgyzstan',
                'is_active' => true,
            ]
        );

        $azerbaijan = Destination::firstOrCreate(
            ['slug' => 'baku'],
            [
                'name' => 'Baku',
                'description' => 'The stunning capital of Azerbaijan, where modern architecture meets ancient history.',
                'country' => 'Azerbaijan',
                'is_active' => true,
            ]
        );

        // Create sample tours (use firstOrCreate to avoid duplicates)
        Tour::firstOrCreate(
            ['slug' => 'almaty-city-tour'],
            [
                'title' => 'Almaty City Tour',
                'description' => 'Explore the beautiful city of Almaty with its stunning mountain views and rich culture.',
                'price' => 299.00,
                'duration' => 3,
                'destination_id' => $kazakhstan->id,
                'itinerary' => 'Day 1: Arrival and city tour\nDay 2: Mountain excursion\nDay 3: Cultural sites and departure',
                'inclusions' => 'Hotel accommodation, meals, guide, transportation',
                'exclusions' => 'International flights, personal expenses',
                'featured' => true,
                'is_active' => true,
            ]
        );

        Tour::firstOrCreate(
            ['slug' => 'bishkek-issyk-kul-adventure'],
            [
                'title' => 'Bishkek & Issyk-Kul Adventure',
                'description' => 'Discover the capital and the stunning Issyk-Kul Lake, one of the largest alpine lakes in the world.',
                'price' => 499.00,
                'duration' => 5,
                'destination_id' => $kyrgyzstan->id,
                'itinerary' => 'Day 1-2: Bishkek exploration\nDay 3-4: Issyk-Kul Lake\nDay 5: Departure',
                'inclusions' => 'Hotel accommodation, meals, guide, transportation',
                'exclusions' => 'International flights, personal expenses',
                'featured' => true,
                'is_active' => true,
            ]
        );

        Tour::firstOrCreate(
            ['slug' => 'baku-cultural-experience'],
            [
                'title' => 'Baku Cultural Experience',
                'description' => 'Immerse yourself in the rich culture and history of Baku, from the Old City to modern landmarks.',
                'price' => 399.00,
                'duration' => 4,
                'destination_id' => $azerbaijan->id,
                'itinerary' => 'Day 1: Arrival and Old City tour\nDay 2: Modern Baku\nDay 3: Cultural sites\nDay 4: Departure',
                'inclusions' => 'Hotel accommodation, meals, guide, transportation',
                'exclusions' => 'International flights, personal expenses',
                'featured' => false,
                'is_active' => true,
            ]
        );
    }
}
