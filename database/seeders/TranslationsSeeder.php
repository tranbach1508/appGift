<?php

namespace Database\Seeders;

use App\Models\Translation;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TranslationsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('translations')->insert([
            array(
                'shop_id' => rand(1, 5),
                'trans'=>null
            )
           
        ]);
    }
}
