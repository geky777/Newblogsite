<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    public function index(): Response
    {
        $posts = Post::query()
            ->get()
            ->sort(fn (Post $first, Post $second) => $this->comparePosts($first, $second))
            ->map(fn (Post $post) => $this->serializePost($post))
            ->values();

        return Inertia::render('Blog/Blog', [
            'posts' => $posts,
        ]);
    }

    public function show(Post $post): Response
    {
        return Inertia::render('Blog/Show', [
            'post' => $this->serializePost($post),
        ]);
    }

    protected function serializePost(Post $post): array
    {
        return [
            'id' => $post->id,
            'title' => $post->title,
            'slug' => $post->slug,
            'content' => $post->content,
            'task' => $post->task,
            'week' => $post->week,
            'date' => $post->date?->toDateString(),
            'featured_image' => $post->featured_image,
        ];
    }

    protected function comparePosts(Post $first, Post $second): int
    {
        $weekComparison = $this->weekNumber($second->week) <=> $this->weekNumber($first->week);

        if ($weekComparison !== 0) {
            return $weekComparison;
        }

        return ($second->date?->getTimestamp() ?? 0) <=> ($first->date?->getTimestamp() ?? 0);
    }

    protected function weekNumber(?string $week): int
    {
        $digits = preg_replace('/\D+/', '', $week ?? '');

        return $digits === '' ? 0 : (int) $digits;
    }
}
