<?php

namespace Database\Factories;

use App\Models\ProgressBar;
use App\Models\Shop;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProgressBarFactory extends Factory
{
    protected $model = ProgressBar::class;
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition() 
    {
        $status = [1, 0];
        return [
            'name'=> $this->faker->name(),
            'status'=>$this->faker->randomElement($status),
            'shop_id'=>$this->faker->numberBetween($min = 1, $max = 4),
        ];
        
    }
}
