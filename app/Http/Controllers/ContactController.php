<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller

{
    public function isWeekend($date)
    {
        $weekDay = date('w', strtotime($date));
        return ($weekDay == 0 || $weekDay == 6);
    }
    public function sendMailApi($emailData)
    {
        
        Mail::send([], [], function ($message) use ($emailData) {
            $message->to($emailData['personalizations'][0]['to'][0]['email'])
                ->from($emailData['from']['email'], $emailData['from']['name'])
                ->replyTo($emailData['reply_to'])
                ->subject($emailData['subject'])
                ->setBody(view('Mail.SendEmail',$emailData)->render(), 'text/html');
        });
    }
    public function sendEmail(Request $request)
    {
        try {
            $shop = $request->get('shop');
            $emailData = [
                'personalizations' => [
                    [
                        'to' => [
                            ['email' => 'tranbach2000@gmail.com']
                        ]
                    ]
                ],
                'from' => [
                    'email' => env('MAIL_FROM_ADDRESS', 'hello@example.com'),
                    'name' => $request->input('name')
                ],
                'reply_to' => $request->input('email'),
                'subject' => $request->input('subject') . ' - ' . $shop->url,
                'shop' => $shop->url,
                'name'=> $request->name,
                'email'=> $request->email,
                'message'=> $request->content
            ];

            if (!empty($request->input('email')) && filter_var($request->input('email'), FILTER_VALIDATE_EMAIL)) {
                $emailData['replyToId'] = $request->input('email');
            }

            $this->sendMailApi($emailData);

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

