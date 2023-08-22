<?php

namespace App\Http\Controllers;

use App\Models\ProgressBar;
use Illuminate\Http\Request;

class ProgressBarController extends Controller
{
    public function createProgress(Request $request)
    {
        try {
            $shop = $request->get('shop');
            $goal = $request->get('goal');
            $colorBar = $request -> colorBar ?? '#4A90E2';
            $backgroundColor = $request -> backgroundColor ?? '#ffffff';
            $separatorColor = $request -> separatorColor ?? '#0707F4';
            $textColor = $request -> textColor ?? '#000000';
            
            $color = [
                'Background color' => $backgroundColor,
                'Color bar' => $colorBar,
                'Separator Color' => $separatorColor,
                'Text color' => $textColor
            ];
            
            $colorJson = json_encode($color);
            
            $textSize = $request->textSize ?? "15px";
            $textStyle = $request->textStyle ?? "None";
            
            $style = [
                'Text Style' => $textStyle,
                'Text size' => $textSize
            ];
            
            $styleJson = json_encode($style);
            
            $status = $request->status ?? '1';
            
            $progressBar = ProgressBar::where('shop_id', $shop->id)->first();
            if ($progressBar) {
                $progressBar->style = $styleJson;
                $progressBar->color = $colorJson;
                $progressBar->status = $status;
            } else {
                $progressBar = ProgressBar::create([
                    'shop_id' => $shop->id,
                    'style' => $styleJson,
                    'color' => $colorJson,
                    'status' => $status,
                    'goal_id' =>$goal->id
                ]);
            }
            
            $progressBar->save();
            
            return response()->json([
                'status' => true
            ]);
        } catch (\Throwable $th) {
            dd($th);
        }
    }
    
    public function updateData(Request $request)
    {
        try {
            $shop = $request -> get('shop');
            $progress = ProgressBar::where('shop_id', $shop -> id)->first();
            $color = json_decode($progress -> color) ;
            $style = json_decode($progress -> style);
            $status = $progress -> status;
            return response()->json([
                'status' =>$status,
                'color' => $color,
                'style' => $style
            ]);
        } catch (\Throwable $th) {
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }
}
