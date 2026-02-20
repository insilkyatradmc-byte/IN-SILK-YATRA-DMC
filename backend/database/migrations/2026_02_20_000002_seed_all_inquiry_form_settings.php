<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private array $settings = [
        [
            'setting_key' => 'destinations',
            'label'       => 'Destinations',
            'options'     => ['Almaty, Kazakhstan', 'Bishkek, Kyrgyzstan', 'Tashkent, Uzbekistan', 'Samarkand, Uzbekistan', 'Bukhara, Uzbekistan', 'Issyk-Kul, Kyrgyzstan', 'Dushanbe, Tajikistan', 'Ashgabat, Turkmenistan', 'Baku, Azerbaijan'],
            'is_active'   => true,
            'sort_order'  => 1,
        ],
        [
            'setting_key' => 'travel_vibes',
            'label'       => 'Travel Vibes',
            'options'     => ['Adventure & Exploration', 'Cultural Immersion', 'Nature & Mountains', 'Historical Sites', 'Local Cuisine & Food', 'Relaxed & Slow-Paced', 'Photography & Scenery', 'Luxury & Comfort'],
            'is_active'   => true,
            'sort_order'  => 2,
        ],
        [
            'setting_key' => 'special_occasions',
            'label'       => 'Special Occasions',
            'options'     => ['Honeymoon', 'Anniversary', 'Birthday Trip', 'Family Reunion', 'Solo Adventure', 'Group Trip', 'No Special Occasion'],
            'is_active'   => true,
            'sort_order'  => 3,
        ],
        [
            'setting_key' => 'accommodation_types',
            'label'       => 'Accommodation Types',
            'options'     => ['Boutique Hotels', 'Luxury Hotels', 'Traditional Guesthouses', 'Yurt Stays', 'Mountain Lodges', 'Eco-Lodges', 'Budget Hotels'],
            'is_active'   => true,
            'sort_order'  => 4,
        ],
        [
            'setting_key' => 'tour_themes',
            'label'       => 'Private Tour Themes',
            'options'     => ['Silk Road Heritage', 'Mountain Trekking', 'Nomadic Culture', 'Soviet History', 'Wildlife & Nature', 'Culinary Tours', 'Photography Tours', 'Family Adventures'],
            'is_active'   => true,
            'sort_order'  => 5,
        ],
        [
            'setting_key' => 'experience_styles',
            'label'       => 'Experience Styles',
            'options'     => ['Private & Exclusive', 'Small Group (4-8 people)', 'Self-Guided with Support', 'Fully Guided', 'Mixed (Guided + Free Time)'],
            'is_active'   => true,
            'sort_order'  => 6,
        ],
        [
            'setting_key' => 'concierge_services',
            'label'       => 'Concierge Services',
            'options'     => ['Restaurant Reservations', 'Local Guide Services', 'Translation Services', 'Photography Services', 'Special Event Planning', 'Emergency Support'],
            'is_active'   => true,
            'sort_order'  => 7,
        ],
        [
            'setting_key' => 'transfers',
            'label'       => 'Transfers & Drivers',
            'options'     => ['Airport Transfers', 'Full-Day Private Driver', 'Inter-City Transfers', 'Train Station Transfers', 'Border Crossing Assistance'],
            'is_active'   => true,
            'sort_order'  => 8,
        ],
        [
            'setting_key' => 'travel_party_options',
            'label'       => 'Travel Party Options',
            'options'     => ['Just me', 'With my partner', 'With my family', 'With friends', 'Other'],
            'is_active'   => true,
            'sort_order'  => 9,
        ],
        [
            'setting_key' => 'currencies',
            'label'       => 'Budget Currencies',
            'options'     => ['Tenge (KZT)', 'Euro (EUR)', 'Dollar (USD)', 'INR (₹)'],
            'is_active'   => true,
            'sort_order'  => 10,
        ],
    ];

    public function up(): void
    {
        foreach ($this->settings as $setting) {
            // Only insert if the setting_key doesn't already exist
            if (!DB::table('inquiry_form_settings')->where('setting_key', $setting['setting_key'])->exists()) {
                DB::table('inquiry_form_settings')->insert([
                    'setting_key' => $setting['setting_key'],
                    'label'       => $setting['label'],
                    'options'     => json_encode($setting['options']),
                    'is_active'   => $setting['is_active'],
                    'sort_order'  => $setting['sort_order'],
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]);
            } else {
                // Update sort_order and is_active but keep any admin customisations to options/label
                DB::table('inquiry_form_settings')
                    ->where('setting_key', $setting['setting_key'])
                    ->update([
                        'sort_order' => $setting['sort_order'],
                        'is_active'  => $setting['is_active'],
                        'updated_at' => now(),
                    ]);
            }
        }
    }

    public function down(): void
    {
        $keys = array_column($this->settings, 'setting_key');
        DB::table('inquiry_form_settings')->whereIn('setting_key', $keys)->delete();
    }
};
