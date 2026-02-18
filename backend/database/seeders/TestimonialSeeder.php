<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Testimonial;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        $testimonials = [
            [
                'name' => 'Priya Sharma',
                'country' => 'India',
                'content' => 'Our Silk Road journey was absolutely magical! The attention to detail and personalized service made this trip unforgettable. Every moment was carefully curated to give us an authentic experience.',
                'photo' => null,
                'is_active' => true,
            ],
            [
                'name' => 'John Anderson',
                'country' => 'United States',
                'content' => 'The most incredible travel experience of my life. From ancient cities to stunning landscapes, every destination was perfectly planned. Highly recommend In-Silk Yatra!',
                'photo' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Sophie Martin',
                'country' => 'France',
                'content' => 'Exceptional service and breathtaking destinations. The cultural immersion was beyond our expectations. We felt like we truly understood the Silk Road heritage.',
                'photo' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Raj Patel',
                'country' => 'United Kingdom',
                'content' => 'An adventure of a lifetime! The guides were knowledgeable, the accommodations were luxurious, and every experience was authentic. Can\'t wait to book another trip.',
                'photo' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Maria Rodriguez',
                'country' => 'Spain',
                'content' => 'From the first contact to the last goodbye, everything was perfect. The team went above and beyond to ensure we had the best possible experience on the Silk Road.',
                'photo' => null,
                'is_active' => true,
            ],
        ];

        foreach ($testimonials as $testimonial) {
            Testimonial::create($testimonial);
        }
    }
}
