<?php

namespace Database\Seeders;

use App\Models\Shop;
use App\Models\User;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Request;


class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run(Request $request)
    {
        // User::factory(10)->create();
        Shop::factory(5)->create();
      
        
    }
}
