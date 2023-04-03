<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gift extends Model
{
    use HasFactory;
    protected $fillable = [
        'shop_id',	'product_id',	'product_title',	'product_handle',	'product_image',	
    ];
    public function shop()
    {
       return $this->belongsTo(Shop::class);
    }
}
