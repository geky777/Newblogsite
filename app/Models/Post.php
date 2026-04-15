<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $fillable = [
        'title',
        'content',
        'task',
        'week',
        'date',
        'featured_image',
        'slug',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function getRouteKeyName()
    {
        return 'slug';
    }
}
