<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $setting = Setting::create([
            'status'=> rand(0,1),	
            'color'=>null,	
            'style'=>null,	
            'shop_id'=> rand(1,5)
        ]);
    }
}
