<?php

namespace Database\Factories;

use App\Models\Gift;
use Illuminate\Database\Eloquent\Factories\Factory;

class GiftFactory extends Factory
{
    protected $model = Gift::class;
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'product_title'=>$this->faker->word(),
            'product_id'=>$this->faker->numberBetween($min=1, $max=10),
            'shop_id'=>rand(1, 5),
            'product_handle'=>$this->faker->word(),
            'product_image'=>$this->faker->image(public_path('storage'),640,480,'natural', false) ,
        ];
    }
}
