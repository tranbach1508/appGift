<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Mail;

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
    public function sendMailApi($emailData)
    {
        
        Mail::send([], [], function ($message) use ($emailData) {
            $message->to($emailData['personalizations'][0]['to'][0]['email'])
                ->from($emailData['from']['email'], $emailData['from']['name'])
                ->replyTo($emailData['reply_to'])
                ->subject($emailData['subject'])
                ->setBody($emailData['content'][0]['value'], 'text/html');
        });
    }
}
