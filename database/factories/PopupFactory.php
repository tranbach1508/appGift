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
            'shop_id'=>rand(1, 5),
            'type'=>$this->faker->randomElement($type),
        ];
    }
}
