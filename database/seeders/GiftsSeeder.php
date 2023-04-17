<?php

namespace Database\Seeders;

use App\Models\Gift;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class GiftsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
       
        DB::table('gifts')->insert([
            array(
                'shop_id'=> 1,	
                'product_id'=> rand($min = 1, $max = 10),	
                'variant_id'=> rand($min = 1, $max = 10),	
                'product_title'=> Str::random(5),	
                'product_handle'=> Str::random(10),	
                'product_image' => '3727dd605d1a24e0fa90761a0721ac02.png'
            ),
        ]);
    }
}
