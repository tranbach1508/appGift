<?php

namespace Database\Seeders;

use App\Models\Goal;
use Illuminate\Database\Seeder;

class GoalsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $goal = Goal::create([
            'shop_id'=> rand(1, 5),	
            'type'=> 1,	
            'status'=> 1,	
            'name'=> 'FreeShipping',	
            'gift_count'=> random_int($min = 1, $max = 10),	
            'times'=> random_int($min = 1, $max = 10),	
            'target_type'=> 1,	
            'target'=> '50',	
            'condition'=>null,	
            'message'=>'Voluptatum quisquam asperiores unde aut. Quis sit nihil tempore exercitationem.',	
        ]);
    }
}
