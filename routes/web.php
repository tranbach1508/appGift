<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\GiftController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::group(['middleware' => ['iframeProtection','verifyShopifyLoginCode']], function () {
    Route::get('/',                [AdminController::class, 'index']);
    Route::get('/{path}',                [AdminController::class, 'index'])->where('path', '.*');
});
Route::group(['prefix' => 'admin','middleware' => ['iframeProtection','verifyShopifyLoginCode']], function () {
    Route::get('/',                [AdminController::class, 'index']);
    Route::get('/{path}',                [AdminController::class, 'index'])->where('path', '.*');
});

// Gift
Route::group(['prefix' => 'api','middleware' => ['iframeProtection','verifySessionToken']], function () {
    Route::post('/addGift',                [GiftController::class, 'addGift']);
    Route::post('/sendEmail',               [ContactController::class, 'sendEmail']);
});