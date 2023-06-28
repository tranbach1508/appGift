<?php

namespace App\Http\Controllers;

use App\Models\Gift;
use Illuminate\Http\Request;
use Log;
use App\Models\Goal;

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
        if(empty($request->get('variant_id'))){
            $variant = $product['variants'][0];
        }else{
            $variant = $product['variants'][$variant_index];
        }
        $variant['price'] = 0;
        $gift['variants'][] = $variant;
        $new_product = $shopifyApi->Product->post($gift);
        try {
            Gift::create([
                'shop_id' => $shop->id,
                'product_id'=> $new_product['id'],
                'product_title'=> $request->title,
                'variant_id' => $variant['id'],
                'variant_title' => $variant['title'],
                'product_handle'=> $new_product['handle'],
                'product_image'=>$request->image,
            ]);
            return response()-> json([
                'status' => true
            ]);
        }catch(Exception $e) {
            return response()-> json([
                'status' => false
            ]);
        }
    }

    public function gifts(Request $request){
        $shop = $request->get('shop');
        $gifts = $shop->gifts;
        return response()-> json($gifts);
    }
   
    public function deleteGift(Request $request)
    {
        $shop = $request->get('shop');
        $gift = Gift::where('product_id',$request->product_id)->first();
        $goal = Goal::where('gift_id',$gift->id)->first();
        if(!empty($goal)){
            return response()-> json([
                'status' => false,
                'message' => 'The gift is being used'
            ]);
        }
        try {
            $gift->deleteData();
            $shopifyApi = $shop->getShopifyApi();
            $product = $shopifyApi->Product($request->product_id)->delete();
            return response()-> json([
                'status' => true
            ]);
        }catch(Exception $e) {
            return response()-> json([
                'status' => false
            ]);
        }
    }
}   
