<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller

{
    public function isWeekend($date)
    {
        $weekDay = date('w', strtotime($date));
        return ($weekDay == 0 || $weekDay == 6);
    }
    public function sendEmail(Request $request)
    {
        try {
            $shop = $request->get('shop');
            $emailData = [
                'personalizations' => [
                    [
                        'to' => [
                            ['email' => 'tamanhtran473@gmail.com']
                        ]
                    ]
                ],
                'from' => [
                    'email' => '19a31010010@students.hou.edu.vn',
                    'name' => $request->input('name')
                ],
                'reply_to' => $request->input('email'),
                'subject' => $request->input('subject') . ' - ' . $shop->url,
                'shop' => $shop->url,
                'name'=> $request->name,
                'email'=> $request->email,
                'message'=> $request->content
                // 'content' => [
                //     [
                //         'type' => 'html',
                //         'value' => '<div style="background: #f9f9f9; padding: 20px 10px;">
                //         <div style="max-width: 600px; margin: auto; padding: 15px 30px 25px 30px; background-color: #ffffff; border-radius: 3px; border-bottom: 1px solid #dadada; border-top: 1px solid #eaeaea;">
                //         <table style="width: 100%; color: #000; border: 1px solid black; border-collapse: collapse; font-weight: 500;">
                //         <tbody>
                //         <tr>
                //         <td style="border: 1px solid black; padding: 10px; width: 120px;">Shop url</td>
                //         <td style="border: 1px solid black; padding: 10px;">' . $shop->url . '</td>
                //         </tr>
                //         <tr>
                //         <td style="border: 1px solid black; padding: 10px; width: 120px;">Name</td>
                //         <td style="border: 1px solid black; padding: 10px;">' . $request->name . '</td>
                //         </tr>
                //         <tr>
                //         <td style="border: 1px solid black; padding: 10px; width: 120px;">Email</td>
                //         <td style="border: 1px solid black; padding: 10px;">' . $request->email . '</td>
                //         </tr>
                //         <tr>
                //         <td style="border: 1px solid black; padding: 10px; width: 120px;">Content</td>
                //         <td style="border: 1px solid black; padding: 10px;">' . $request->content . '</td>
                //         </tr>
                //         </tbody>
                //         </table>
                //         </div>'
                //     ]
                // ]
            ];

            if (!empty($request->input('email')) && filter_var($request->input('email'), FILTER_VALIDATE_EMAIL)) {
                $emailData['replyToId'] = $request->input('email');
            }

            $shop->sendMailApi($emailData);

            return response()->json([
                'message' => 'Email sent successfully',
                'is_weekend' => $this->isWeekend(date('Y-m-d'))
            ]);
        } catch (\Exception $e) {
            Log::error('Error sending email: ' . $e->getMessage());
            return response()->json([
                'error' => 'An error occurred while sending the email'
            ], 500);
        }
    }
}

