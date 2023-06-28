<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class Shop extends Model
{
    use HasFactory;
    protected $fillable = [	
        'url',	
        'email',	
        'theme_id',
        'token',
    ];
    public static function install($info){
        $shop = Shop::create($info);
        return $shop;
    }
    public function getShopifyApi()
    {
        return \PHPShopify\ShopifySDK::config(['ShopUrl' => $this->url, 'AccessToken' => $this->token, 'ApiVersion' => config('constants.SHOPIFY_API_VERSION') ]);
    }
    public function gifts(){
        return $this->hasMany(Gift::class);
    }
}
