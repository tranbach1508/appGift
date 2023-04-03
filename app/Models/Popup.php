<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Popup extends Model
{
    use HasFactory;
    protected $fillable = [
        'type',	
        'color',	
        'style',	
        'shop_id',	
    ];
    public function shop()
    {
       return $this->belongsTo(Shop::class);
    }
}
