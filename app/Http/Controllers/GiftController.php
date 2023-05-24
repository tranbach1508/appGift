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
        if(empty($request->get('variant_id'))){
            $variant = $product['variants'][0];
        }else{
            $variant = $product['variants'][$variant_index];
        }
        $variant['price'] = 0;
        $gift['variants'][] = $variant;
        $new_product = $shopifyApi->Product->post($gift);

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
    }

    public function gifts(Request $request){
        $shop = $request->get('shop');
        $gifts = Gift::where('shop_id',$shop->id)->get();
        return response()-> json($gifts);
    }
   
    public function deleteGift(Request $request)
    {
        $shop = $request->get('shop');
        $gift = Gift::where('product_id',$request->product_id)->first();
        $gift->delete();
        $shopifyApi = $shop->getShopifyApi();
        $product = $shopifyApi->Product($request->product_id)->delete();
        return response()-> json([
            'status' => true
        ]);
    }
    private function getPostionOfVariantFromImage($product_data){
        $variants = $product_data["variants"];
        $images = $product_data["images"];
        $array = [];
        foreach ($images as $key => $image) {
            $array[] = array_map(function($variant_id) use ($variants){
                $a = array_filter($variants,function($v,$k) use ($variant_id){
                    return $v["id"] == $variant_id;
                },ARRAY_FILTER_USE_BOTH);
                $a = reset($a)["position"];
                return $a;
            },$image["variant_ids"]);
        }
        return $array;
    }
    public function test(Request $request){
        $shop = $request->get('shop');
        $shopifyApi = $shop->getShopifyApi();
        $product_data = $request->product;
        $imageVariant = $this->getPostionOfVariantFromImage($product_data);
        $options = [];
        $variants = [];
        $images = array_map(function($image){
            return array(
                "src" => $image["src"]
            );
        },$product_data["images"]);
        foreach ($product_data["variants"] as $key => $variant) {
            $_variant = $variant;
            unset($_variant["id"]);
            unset($_variant["product_id"]);
            unset($_variant["image_id"]);
            $_variant["fulfillment_service"] = "manual";
            $variants[$key] = $_variant;
        }
        foreach ($product_data["options"] as $key => $option) {
            $options[$key] = [
                "name" => $option["name"],
                "position" => $option["position"],
                "values" => $option["values"]
            ];
        }
        $new_product_data = [
            "vendor" => $product_data["vendor"],
            "title" => $product_data["title"],
            "product_type" => $product_data["product_type"],
            "tags" => $product_data["tags"],
            "body_html" => $product_data["body_html"],
            "options" => $options,
            "variants" => $variants,
            "images" => $images
        ];
        $new_product = $shopifyApi->Product->post($new_product_data);
        $productImage = $shopifyApi->Product($new_product["id"])->Image->get();
        foreach ($productImage as $key => $image) {
            $variant_ids = [];
            for($i =0;$i < count($imageVariant[$key]);$i++){
                $position = $imageVariant[$key][$i];
                $_variants = array_filter($new_product["variants"],function($v,$k) use ($position){
                    return $v["position"] == $position;
                },ARRAY_FILTER_USE_BOTH);
                $_variants = reset($_variants);
                $variant_ids[] = $_variants["id"];
            }
            $image["variant_ids"] = $variant_ids;
            $shopifyApi->Product($new_product["id"])->Image($image["id"])->put($image);
        }
        return response()-> json([
            'status' => true
        ]);
    }
}   
