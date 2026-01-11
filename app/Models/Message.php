<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = ['user_id', 'body', 'type', 'status', 'image', 'is_read'];

    // This links the message to the User who sent it
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
