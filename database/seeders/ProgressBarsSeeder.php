<?php

namespace Database\Seeders;

use App\Models\ProgressBar;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProgressBarsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('progress_bars')->insert([
        array(
            'name'=> Str::random(5),	
            'status'=>rand(0 ,1),
            'color'=> null,
            'style'=> null,
            'shop_id'=> rand(1,5),
        ),
       ]);
    }
}
