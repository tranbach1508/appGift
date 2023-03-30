<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Translation extends Model
{
    use HasFactory;
    protected $fillable = [
        'trans', 'shopi_id'
    ];
    public function shop()
    {
       return $this->belongsTo(Shop::class);
    }
}
