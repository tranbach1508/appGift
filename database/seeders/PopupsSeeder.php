<?php

namespace Database\Seeders;

use App\Models\Popup;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PopupsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('popups')->insert([
            array(
                'type'=>rand($min = 0, $max = 2 ),	
                'color'=>null,	
                'style'=>null,	
                'shop_id'=> 1,
            )

        ]);
    }
}
