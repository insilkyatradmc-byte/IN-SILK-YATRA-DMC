<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InquiryFormSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            [
                'setting_key' => 'destinations',
                'label' => 'Destinations',
                'options' => json_encode([
                    'Almaty, Kazakhstan',
                    'Bishkek, Kyrgyzstan',
                    'Tashkent, Uzbekistan',
                    'Samarkand, Uzbekistan',
                    'Bukhara, Uzbekistan',
                    'Issyk-Kul, Kyrgyzstan',
                    'Dushanbe, Tajikistan',
                    'Ashgabat, Turkmenistan',
                ]),
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'setting_key' => 'travel_vibes',
                'label' => 'Travel Vibes',
                'options' => json_encode([
                    'Adventure & Exploration',
                    'Cultural Immersion',
                    'Nature & Mountains',
                    'Historical Sites',
                    'Local Cuisine & Food',
                    'Relaxed & Slow-Paced',
                    'Photography & Scenery',
                    'Luxury & Comfort',
                ]),
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'setting_key' => 'special_occasions',
                'label' => 'Special Occasions',
                'options' => json_encode([
                    'Honeymoon',
                    'Anniversary',
                    'Birthday Trip',
                    'Family Reunion',
                    'Solo Adventure',
                    'Group Trip',
                    'No Special Occasion',
                ]),
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'setting_key' => 'accommodation_types',
                'label' => 'Accommodation Types',
                'options' => json_encode([
                    'Boutique Hotels',
                    'Luxury Hotels',
                    'Traditional Guesthouses',
                    'Yurt Stays',
                    'Mountain Lodges',
                    'Eco-Lodges',
                    'Budget Hotels',
                ]),
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'setting_key' => 'tour_themes',
                'label' => 'Private Tour Themes',
                'options' => json_encode([
                    'Silk Road Heritage',
                    'Mountain Trekking',
                    'Nomadic Culture',
                    'Soviet History',
                    'Wildlife & Nature',
                    'Culinary Tours',
                    'Photography Tours',
                    'Family Adventures',
                ]),
                'is_active' => true,
                'sort_order' => 5,
            ],
            [
                'setting_key' => 'experience_styles',
                'label' => 'Experience Styles',
                'options' => json_encode([
                    'Private & Exclusive',
                    'Small Group (4-8 people)',
                    'Self-Guided with Support',
                    'Fully Guided',
                    'Mixed (Guided + Free Time)',
                ]),
                'is_active' => true,
                'sort_order' => 6,
            ],
            [
                'setting_key' => 'concierge_services',
                'label' => 'Concierge Services',
                'options' => json_encode([
                    'Restaurant Reservations',
                    'Local Guide Services',
                    'Translation Services',
                    'Photography Services',
                    'Special Event Planning',
                    'Emergency Support',
                ]),
                'is_active' => true,
                'sort_order' => 7,
            ],
            [
                'setting_key' => 'transfers',
                'label' => 'Transfers & Drivers',
                'options' => json_encode([
                    'Airport Transfers',
                    'Full-Day Private Driver',
                    'Inter-City Transfers',
                    'Train Station Transfers',
                    'Border Crossing Assistance',
                ]),
                'is_active' => true,
                'sort_order' => 8,
            ],
            [
                'setting_key' => 'travel_party_options',
                'label' => 'Travel Party Options',
                'options' => json_encode([
                    'Just me',
                    'With my partner',
                    'With my family',
                    'With friends',
                    'Other',
                ]),
                'is_active' => true,
                'sort_order' => 9,
            ],
            [
                'setting_key' => 'currencies',
                'label' => 'Budget Currencies',
                'options' => json_encode([
                    'Tenge (KZT)',
                    'Euro (EUR)',
                    'Dollar (USD)',
                    'INR (₹)',
                ]),
                'is_active' => true,
                'sort_order' => 10,
            ],
        ];

        foreach ($settings as $setting) {
            DB::table('inquiry_form_settings')->insertOrIgnore(array_merge($setting, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
