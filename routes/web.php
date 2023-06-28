<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\GiftController;
use App\Http\Controllers\GoalController;

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
    Route::post('/gifts',                [GiftController::class, 'gifts']);
    Route::post('/deleteGift',                [GiftController::class, 'deleteGift']);
    Route::post('/addGoal',                [GoalController::class, 'addGoal']);
    Route::post('/goals',                [GoalController::class, 'goals']);
    Route::post('/goal',                [GoalController::class, 'goal']);
    Route::post('/update-goal',                [GoalController::class, 'updateGoal']);
    Route::post('/delete-goal',                [GoalController::class, 'deleteGoal']);
    Route::post('/change-status-goal',                [GoalController::class, 'changeStatusGoal']);
    Route::post('/sendEmail',               [ContactController::class, 'sendEmail']);
});