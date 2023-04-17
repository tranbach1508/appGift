<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Log;

class GiftController extends Controller
{
    public function addGift(Request $request){
        $shop = $request->get('shop');
        $shopifyApi = $shop->getShopifyApi();
        $product = $shopifyApi->Product($request->id)->get();
        $gift = $product;
        $gift['title'] = $request->get('title');
        $variant_index = array_search($request->get('variant_id'), array_column($product['variants'], 'id'));
        $gift['variants'] = [];
        $variant = $product['variants'][$variant_index];
        $variant['price'] = 0;
        $gift['variants'][] = $variant;
        $shopifyApi->Product->post($gift);
    }
}
