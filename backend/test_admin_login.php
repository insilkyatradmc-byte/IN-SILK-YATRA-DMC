<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Admin;
use Illuminate\Support\Facades\Hash;

$admin = Admin::where('email', 'admin@insilkyatra.com')->first();

if (!$admin) {
    echo "❌ Admin not found!\n";
    exit(1);
}

echo "✅ Admin found\n";
echo "Email: " . $admin->email . "\n";
echo "Active: " . ($admin->is_active ? 'Yes' : 'No') . "\n";
echo "Has password: " . (!empty($admin->password) ? 'Yes' : 'No') . "\n";
echo "\nTesting password 'insilkyatradmc':\n";
echo "Password check: " . (Hash::check('insilkyatradmc', $admin->password) ? '✅ MATCH' : '❌ NO MATCH') . "\n";
