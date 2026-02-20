<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Insert currencies setting if it doesn't already exist
        if (!DB::table('inquiry_form_settings')->where('setting_key', 'currencies')->exists()) {
            DB::table('inquiry_form_settings')->insert([
                'setting_key' => 'currencies',
                'label'       => 'Budget Currencies',
                'options'     => json_encode(['Tenge (KZT)', 'Euro (EUR)', 'Dollar (USD)', 'INR (₹)']),
                'is_active'   => true,
                'sort_order'  => 10,
                'created_at'  => now(),
                'updated_at'  => now(),
            ]);
        }
    }

    public function down(): void
    {
        DB::table('inquiry_form_settings')->where('setting_key', 'currencies')->delete();
    }
};
