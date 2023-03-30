<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Goal extends Model
{
    use HasFactory;
    protected $fillable = [
        'shop_id',	
        'type',	
        'status',	
        'name',	
        'gift_count',	
        'times',	
        'target_type',	
        'target',	
        'condition',	
        'message',	
    ];
    public function shop()
    {
       return $this->belongsTo(Shop::class);
    }
}
