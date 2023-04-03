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



class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
           ShopsSeeder::class,
            ProgressBarsSeeder::class,
            GoalsSeeder::class,
            GiftsSeeder::class,
            SettingsSeeder::class,
            PopupsSeeder::class,
            
        ]);
        // ProgressBar::factory()->count(5)->create();
        // Goal::factory()->count(5)->create();
        // Gift::factory()->count(5)->create();
        // Setting::factory()->count(5)->create();
        // Popup::factory()->count(5)->create();
        // Translation::factory()->count(5)->create();
    }
}
