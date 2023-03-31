<?php

namespace Database\Factories;

use App\Models\Setting;
use Illuminate\Database\Eloquent\Factories\Factory;

class SettingFactory extends Factory
{
    protected $model = Setting::class;
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $status = [1, 0];
        return [
            'shop_id' => rand(1, 5),
            'status'=> $this->faker->randomElement($status),
            'color'=>null,
            'style'=>null
        ];
    }
}
