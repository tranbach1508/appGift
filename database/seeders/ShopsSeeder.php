<?php

namespace Database\Seeders;

use App\Models\Shop;
use Illuminate\Database\Seeder;
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
        $shop1 = Shop::create([
            'url' => 'demoapp.shopify.com', 
            'email' => 'jisoo.parisian@gmail.com',
            'theme_id' => 1390456896379
        ]);
        $shop2 = Shop::create([
            'url' => 'hahahha.shopify.com', 
            'email' => 'jennie.parisian@gmail.com',
            'theme_id' => 1098476738203
        ]);
        $shop3 = Shop::create([
            'url' => 'semogift.shopify.com', 
            'email' => 'roses.parisian@gmail.com',
            'theme_id' => 1987463892947
        ]);
        $shop4 = Shop::create([
            'url' => 'basic.shopify.com', 
            'email' => 'lisa.parisian@gmail.com',
            'theme_id' => 134174689522
        ]);
        $shop5 = Shop::create([
            'url' => 'numberone.shopify.com', 
            'email' => 'nguyenvana.parisian@gmail.com',
            'theme_id' => 1389120908392
        ]);
    }
}
