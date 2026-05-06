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

    public function getFeaturedImagesAttribute(): array
    {
        $value = $this->attributes['featured_image'] ?? null;
        $storedValues = $this->extractStoredImageValues($value);
        $normalizedValues = array_map(fn (string $storedValue) => $this->normalizeImageUrl($storedValue), $storedValues);

        return array_values(array_filter($normalizedValues, fn (?string $normalizedValue) => is_string($normalizedValue)));
    }

    public function getFeaturedImageUrlAttribute(): ?string
    {
        $images = $this->getFeaturedImagesAttribute();

        return $images[0] ?? null;
    }

    protected function extractStoredImageValues(?string $value): array
    {
        if (! is_string($value) || trim($value) === '') {
            return [];
        }

        $decodedValue = json_decode($value, true);

        if (json_last_error() === JSON_ERROR_NONE && is_array($decodedValue)) {
            return array_values(array_filter($decodedValue, fn ($image) => is_string($image) && trim($image) !== ''));
        }

        return [$value];
    }

    protected function normalizeImageUrl(string $value): ?string
    {
        $value = trim($value);

        if ($value === '') {
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
