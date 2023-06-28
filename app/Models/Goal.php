<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Gift;
use Log;

class Goal extends Model
{
    use HasFactory;
    protected $fillable = [
        'shop_id',	
        'type',	
        'status',	
        'name',	
        'gift_count',	
        'times',	
        'target_type',	
        'target',	
        'condition',	
        'message',	
    ];
    public function shop()
    {
       return $this->belongsTo(Shop::class);
    }
    public function gift()
    {
       return Gift::find($this->gift_id);
    }
    public function addData($shop_id,$name,$status,$gift_count,$times,$target_type,$target,$condition,$message,$type,$gift_id,$discount_code){
        $this->shop_id= $shop_id;
        $this->status= $status;
        $this->name= $name;
        $this->target_type= $target_type == "subtotal" ? 1 : 2;
        $this->target= $target;
        $this->condition= json_encode($condition);
        $this->message= json_encode($message);
        if($type == "free_gift"){
            $this->type= 1;
            $this->times= $times;
            $this->gift_count= $gift_count;
            $this->gift_id= $gift->id;
        }elseif($type == "free_shipping"){
            $this->type= 2;
        }else{
            $this->type= 3;
            $this->discount_code= $discount_code;
        }
        $this->save();
    }
    public function getData(){
        if($this->type == 1){
            $type = "free_gift";
        }elseif($this->type == 2){
            $type = "free_shipping";
        }else{
            $type = "discount";
        }
        return [
            "name" => $this->name,
            "gift" => $this->gift(),
            "type" => $type,
            "status" => $this->status == 1 ? true : false,
            "gift_count" => $this->gift_count,
            "times" => $this->times,
            "discount_code" => $this->discount_code,
            "target_type" => $this->target_type == 1 ? "subtotal" : "item_count",
            "target" => $this->target,
            "condition" => json_decode($this->condition),
            "message" => json_decode($this->message)
        ];
    }
    public function updateData($name,$status,$gift_count,$times,$target_type,$target,$condition,$message,$type,$gift_id,$discount_code){
        $this->status= $status;
        $this->name= $name;
        $this->target_type= $target_type == "subtotal" ? 1 : 2;
        $this->target= $target;
        $this->condition= json_encode($condition);
        $this->message= json_encode($message);
        if($type == "free_gift"){
            $this->type= 1;
            $this->times= $times;
            $this->gift_count= $gift_count;
            $this->gift_id= $gift_id;
        }elseif($type == "free_shipping"){
            $this->type= 2;
        }else{
            $this->type= 3;
            $this->discount_code= $discount_code;
        }
        $this->save();
    }
    public function deleteData(){
        $this->delete();
    }
}
