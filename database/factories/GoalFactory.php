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
        $name = ["FreeGift","FreeShipping","Disscount"];
        $status = [1, 0];
        $type = [1, 2, 0];
        return [
            'name'=> $this->faker->randomElement($name),
            'status'=>$this->faker->randomElement($status),
            'type'=>$this->faker->randomElement($type),
            'shop_id'=>$this->faker->numberBetween($min=1, $max=5),
            'gift_count'=>$this->faker->randomDigitNot(2),
            'target'=>$this->faker->randomNumber,
            'target_type'=>$this->faker->numberBetween($min=1, $max=2),
            'times'=>$this->faker->randomDigit,
            'condition'=>null,
            'message'=>$this->faker->text(100),
        ];
    }
}
