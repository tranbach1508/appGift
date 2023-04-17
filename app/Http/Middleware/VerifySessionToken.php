<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Shop;

class VerifySessionToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $sessionToken    = $request->bearerToken();
        if(empty($sessionToken)){
            $requestURI = $request->getRequestUri();
            return Redirect::to(url('/authorize').str_replace('/requestforquotev2/','',$requestURI));
        }
        // verify session token
        $jwtArr = array_combine(['header', 'payload', 'signature'], explode('.', $sessionToken)); //convert token to associative array
        $calculatedHash = hash_hmac('sha256', $jwtArr['header'] . '.' . $jwtArr['payload'], env('SHOPIFY_SECRET', null), true); //hmac the two first arguments
        $calculatedHash = rtrim(strtr(base64_encode($calculatedHash), '+/', '-_'), '='); //base64 url encode, trim =
        $signature_verified = $calculatedHash === $jwtArr['signature'];
        if(!$signature_verified) return response()->json(['error' => 'Not authorized.'],403);
        $payload = json_decode(base64_decode($jwtArr['payload']));
        //verify not before time
        if(time() < $payload->nbf) return response()->json(['error' => 'Not authorized.'],403);
        //verify expiration
        if($payload->exp < time()) return response()->json(['error' => 'Not authorized.'],403);
        //make sure shopify domains exist in each place
        if(!strstr($payload->iss, $payload->dest)) return response()->json(['error' => 'Not authorized.'],403);
        //verify AUD matches our key
        if($payload->aud != env('SHOPIFY_API_KEY',null)) return response()->json(['error' => 'Not authorized.'],403);
        // end verify

        $shop_url    = str_replace('https://','',$payload->dest);
        $shop = Shop::where('url', $shop_url)->first();
        if($shop_url == null || empty($shop)){
            return response()->json(['error' => 'Not authorized.'],403);
        }
        if($shop->search_template_created == "false"){
            CreateSearchTemplate::dispatch($shop);
        }
        if($shop->saved_theme_info == "false"){
            SaveThemeInfo::dispatch($shop);
        }
        $_request = $request;
        $_request->attributes->add(['shop' => $shop]);
        return $next($_request);
    }
}
