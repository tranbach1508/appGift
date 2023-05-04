<?php

namespace App\Http\Controllers;

use App\Models\Gift;
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

        Gift::create([
            'shop_id' => $shop->id,
            'product_id'=> $request->id,
            'product_title'=> $request->title,
            'variant_id' => $request->variant_id,
            'product_handle'=> $request->title,
            'product_image'=>$request->image,
        ]);
        // dd($request->all());
        return response()-> json("successfully created");
       
    }
   
    public function destroy($id)
    {
         Gift::find($id)->delete();
        return response()->json("Successfully deleted");
    }
}   
