<?php

namespace App\Http\Controllers;

use App\Models\Goal;
use App\Models\ProgressBar;
use Illuminate\Http\Request;

class ProgressBarController extends Controller
{
    public function createProgress(Request $request)
    {
        try {
            $shop = $request->get('shop');
            $goal = Goal::where('shop_id', $shop->id)->first();
            
            $colorBar = $request->input('colorBar', '#4A90E2');
            $backgroundColor = $request->input('backgroundColor', '#ffffff');
            $separatorColor = $request->input('separatorColor', '#0707F4');
            $textColor = $request->input('textColor', '#000000');
            
            $style = [
                'Text Style' => $request->input('textStyle', 'None'),
                'Text size' => $request->input('textSize', '15px'),
            ];
            
            $status = $request->input('status', '1');
            
            $progressBar = ProgressBar::updateOrCreate(
                ['shop_id' => $shop->id],
                [
                    'style' => json_encode($style),
                    'color' => json_encode([
                        'Background color' => $backgroundColor,
                        'Color bar' => $colorBar,
                        'Separator Color' => $separatorColor,
                        'Text color' => $textColor,
                    ]),
                    'status' => $status,
                    'goal_id' => $goal->shop_id,
                ]
            );
            
            return response()->json(['status' => true]);
        } catch (\Throwable $th) {
            // dd($th);
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }

    public function progressBar(Request $request)
    {
        try {
            $shop = $request -> get('shop');
            $progress = ProgressBar::where('shop_id', $shop -> id)->first();
            $color = json_decode($progress -> color) ;
            $style = json_decode($progress -> style);
            $status = $progress -> status;
            $goal = Goal::where([
                ['shop_id', $shop->id],
                ['status', '1']
            ])->get();
            return response()->json([
                'status' =>$status,
                'color' => $color,
                'style' => $style,
                'goal_id' => $goal,
                'gift' => $shop->gifts
            ]);
        } catch (\Throwable $th) {
            // dd($th);
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }
}
