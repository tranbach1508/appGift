<?php

namespace Database\Seeders;

use App\Models\Gift;
use App\Models\Goal;
use App\Models\Popup;
use App\Models\ProgressBar;
use App\Models\Setting;
use App\Models\Shop;
use App\Models\Translation;
use Illuminate\Database\Seeder;
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
        $this->call([
           ShopsSeeder::class
        ]);
        ProgressBar::factory(5)->create();
        Goal::factory(5)->create();
        Gift::factory(5)->create();
        Setting::factory(5)->create();
        Popup::factory(5)->create();
        Translation::factory(5)->create();
    }
}
