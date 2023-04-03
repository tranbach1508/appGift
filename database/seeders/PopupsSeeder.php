<?php

namespace Database\Seeders;

use App\Models\Popup;
use Illuminate\Database\Seeder;

class PopupsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $pop = Popup::create([
            'type'=>rand($min = 0, $max = 2 ),	
            'color'=>null,	
            'style'=>null,	
            'shop_id'=> rand($min = 1, $max = 5),	
        ]);
    }
}
