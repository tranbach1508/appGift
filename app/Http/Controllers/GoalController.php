<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Goal;
use Log;

class GoalController extends Controller
{
    public function addGoal(Request $request){
        $shop = $request->get('shop');
        $goal = new Goal;
        try{
            $goal->addData(
                $shop->id,
                $request->name,
                $request->status,
                $request->gift_count,
                $request->times,
                $request->target_type,
                $request->target,
                $request->condition,
                $request->message,
                $request->type,
                $request->gift,
                $request->discount_code
            );
            return response()->json([
                'status' => true
            ]);
        }catch(\Exception|\Throwable $e) {
            Log::info($e);
            return response()->json([
                'status' => false
            ]);
        }
    }
    public function goals(Request $request){
        $shop = $request->get('shop');
        $free_gift = Goal::where('shop_id',$shop->id)->where('type',1)->get();
        $free_shipping = Goal::where('shop_id',$shop->id)->where('type',2)->get();
        $discount = Goal::where('shop_id',$shop->id)->where('type',3)->get();
        return response()->json([
            'free_gift' => $free_gift,
            'free_shipping' => $free_shipping,
            'discount' => $discount
        ]);
    }
    public function changeStatusGoal(Request $request){
        $shop = $request->get('shop');
        $id = $request->get('id');
        $goal = Goal::find($id);
        $goal->status = $goal->status == 1 ? 0 : 1;
        $goal->save();
        return response()->json([
            'status' => true
        ]);
    }
    public function goal(Request $request){
        $shop = $request->get('shop');
        $goal = Goal::find($request->id);
        if($goal->shop_id == $shop->id){
            return response()->json([
                "goal" => $goal->getData(),
                "gifts" => $shop->gifts
            ]);
        }else{
            return response()->json([]);
        }
    }
    public function updateGoal(Request $request){
        $shop = $request->get('shop');
        $id = $request->get('id');
        $goal = Goal::find($id);
        try{
            $goal->updateData(
                $request->goal["name"],
                $request->goal["status"],
                $request->goal["gift_count"],
                $request->goal["times"],
                $request->goal["target_type"],
                $request->goal["target"],
                $request->goal["condition"],
                $request->goal["message"],
                $request->goal["type"],
                $request->goal["gift"]["id"],
                $request->goal["discount_code"]
            );
            return response()->json([
                'status' => true
            ]);
        }catch(\Exception|\Throwable $e) {
            Log::info($e);
            return response()->json([
                'status' => false
            ]);
        }
    }
    public function deleteGoal(Request $request){
        $shop = $request->get('shop');
        $id = $request->get('id');
        try{
            $goal = Goal::find($id);
            $goal->deleteData();
            return response()->json([
                'status' => true
            ]);
        }catch(\Exception|\Throwable $e) {
            Log::info($e);
            return response()->json([
                'status' => false
            ]);
        }
    }
}
