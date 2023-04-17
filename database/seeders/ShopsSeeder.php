<?php

namespace Database\Seeders;

use App\Models\Shop;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;


class ShopsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('shops')->insert([
            array(
                'url' => 'tranbachdev.myshopify.com', 
                'email' => 'tranbach2000@gmail.com',
                'theme_id' => 1390456896379,
                'token' => 'shpua_0713aee6a41a70d25b034f22f1c8057b'
            ),
            array(
                'url' => 'hahahha.shopify.com', 
                'email' => 'jennie.parisian@gmail.com',
                'theme_id' => 1098476738203,
                'token' => ''
            )
        ]);
       
    }
}
