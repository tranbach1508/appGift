<?php

namespace Database\Factories;

use App\Models\Goal;
use Illuminate\Database\Eloquent\Factories\Factory;

class GoalFactory extends Factory
{
    protected $model = Goal::class;
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
           
        return [
            'name'=> $this->faker->randomElement(["FreeGift","FreeShipping","Disscount"]),
            'type'=>$this->faker->randomElement([0, 1, 2]),
            'shop_id'=>rand(1, 5),
            'gift_count'=>$this->faker->randomDigitNot(2),
            'target'=>$this->faker->randomNumber(5, false),
            'target_type'=>$this->faker->numberBetween($min=1, $max=2),
            'times'=>$this->faker->randomDigit,
            'condition'=>null,
            'message'=>$this->faker->text(100),
        ];
    }
}
