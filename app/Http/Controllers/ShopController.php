<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Shop;

class ShopController extends Controller
{
    public function getShopifyApi()
    {
        return \PHPShopify\ShopifySDK::config(['ShopUrl' => $this->url, 'AccessToken' => $this->token, 'ApiVersion' => config('constants.SHOPIFY_API_VERSION') ]);
    }
    public function install($info){
        $shop = Shop::create([
            'url' => $info->url,
            'token' => $info->accessToken
        ]);
        return $shop;
    }
}
