<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

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

    public function getFeaturedImageUrlAttribute(): ?string
    {
        $value = $this->attributes['featured_image'] ?? null;

        if (! $value) {
            return null;
        }

        if (preg_match('/^(https?:)?\/\//i', $value) === 1 || Str::startsWith($value, 'data:')) {
            return $value;
        }

        $path = ltrim((string) (parse_url($value, PHP_URL_PATH) ?: $value), '/');

        if ($path === '') {
            return null;
        }

        if (Str::startsWith($path, 'storage/')) {
            return '/'.$path;
        }

        if (Str::startsWith($path, 'blog-featured/')) {
            return '/storage/'.$path;
        }

        if (Str::contains($path, '/')) {
            return '/storage/'.$path;
        }

        return '/storage/blog-featured/'.$path;
    }
}
