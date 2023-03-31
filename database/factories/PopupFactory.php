<?php

namespace Database\Factories;

use App\Models\Popup;
use Illuminate\Database\Eloquent\Factories\Factory;

class PopupFactory extends Factory
{
    protected $model = Popup::class;
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $type = [1,0];
        return [
            'shop_id'=>$this->faker->numberBetween($min=1, $max=4),
            'type'=>$this->faker->randomElement($type),
        ];
    }
}
