<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\Shop;
use App\Jobs\SyncSendInBlue;
use App\Jobs\ShopUpdateInfor;
use Log;
use Session;
use App\Http\Requests;
use Illuminate\Http\Request;

class VerifyShopifyLoginCode
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $request_shop = (string)$request->input('shop');
        $config = array(
            'ShopUrl' => $request_shop,
            'ApiKey' => config('constants.SHOPIFY_API_KEY'),
            'SharedSecret' => config('constants.SHOPIFY_SECRET'),
        );
        \PHPShopify\ShopifySDK::config($config);
        if($request->has('session') && !empty(Shop::where('url', $request_shop)->first())){
            $isValidRequest = \PHPShopify\AuthHelper::verifyShopifyRequest();
            if($isValidRequest){
                $shop = Shop::where('url', $request_shop)->first();
                $request->attributes->add(['shop' => $shop]);
                return $next($request);
            }else{
                die('Not valid request, please try again');
            }
        }else if ($request->has('code')){
            $request_shop = (string)$request->input('shop');
            try{
                    $accessToken = false;
                    try {
                        $accessToken = \PHPShopify\AuthHelper::getAccessToken();     
                    } catch (\Throwable $th) {
                        Log::info($th);
                    }
                if ($accessToken){
                    $code = $request->input('code');
                    if(Shop::where('url', $request_shop)->count() > 0){
                        $shop = Shop::where('url', $request_shop)->first();
                        $shop->update([
                            'token' => $accessToken
                        ]);
                    }else{
                        $shop = Shop::install([
                            'token' => $accessToken,
                            'url' => $request_shop
                        ]);
                    }
                    // $shopifyConfiguration = $shop->getShopInfo();
                    // $shop->update([
                    //     'email' => $shopifyConfiguration->email
                    // ]);
                    $request->request->add(['shop' => $shop]);
                }else{
                }
            }catch (ShopifyApiException $e){
            	# HTTP status code was >= 400 or response contained the key 'errors'
                report($e);
            }
        }else if (!empty($request->input('forceRedirect'))){
            $params = $request->all();
            $params['host'] = base64_encode($params['shop'].'/admin');
            return response(view('embedAppLogin',$params));
        }else{
            if(!preg_match('/^[a-zA-Z0-9\-]+.myshopify.com$/', $request_shop)){
                return response(view('login'));
            };
            $redirectURL = 'http://127.0.0.1:8000/authorize';
            $installURL = \PHPShopify\AuthHelper::createAuthRequest(config('constants.SHOPIFY_SCOPE'), $redirectURL);
            die("<script>top.location.href='$installURL'</script>");
            exit;
        }
        return $next($request);
    }
}