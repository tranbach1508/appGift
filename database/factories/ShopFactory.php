<?php

namespace Database\Factories;

use App\Models\Shop;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Str;

class ShopFactory extends Factory
{
    protected $model = Shop::class;
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'url'=> $this->faker->url,
            'email' => $this->faker->unique()->freeEmail,
            'theme_id'=> $this->faker->numberBetween(),
        ];
    }
}
