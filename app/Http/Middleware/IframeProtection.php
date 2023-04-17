<?php

namespace App\Http\Middleware;

use Closure;
use Log;

class IframeProtection
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
        $headers = [
            'Access-Control-Allow-Methods'=> 'POST, GET, OPTIONS, PUT, DELETE'
        ];
        $shop = $request->get('shop');
        $response = $next($request);
        $IlluminateResponse = 'Illuminate\Http\Response';
        $SymfonyResopnse = 'Symfony\Component\HttpFoundation\Response';
        if($response instanceof $IlluminateResponse) {
            $response->headers->set('Content-Security-Policy', "frame-ancestors https://".$shop." https://admin.shopify.com;");
            return $response;
        }
        if($response instanceof $SymfonyResopnse) {
            $response->headers->set('Content-Security-Policy', "frame-ancestors https://".$shop." https://admin.shopify.com;");
            return $response;
        }
    }
}