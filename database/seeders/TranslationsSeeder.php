<?php

namespace Database\Seeders;

use App\Models\Translation;
use Illuminate\Database\Seeder;

class TranslationsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $trans = Translation::create([
            'shop_id' => rand(1, 5),
            'trans'=>null
        ]);
    }
}
