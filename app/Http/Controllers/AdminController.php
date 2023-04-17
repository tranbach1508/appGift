<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Log;

class AdminController extends Controller
{
    public function index(Request $request)
    {
        $shop =  $request->get('shop');
        $shopify = $shop->getShopifyApi();
        $shop_info = $shopify->Shop->get();
        $shop->email = $shop_info["email"];
        $shop->save();
        if (empty($shop)) {
            Log::info(123);
            return view('login');
        }
        return view('index')->withShopUrl($shop->url);
    }
}
