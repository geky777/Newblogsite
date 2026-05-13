<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
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

        return Inertia::render('Admin/Blog/Index', [
            'posts' => $posts,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Blog/Create');
    }

    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $this->validatePost($request);
        $uploadedImageUrls = $this->storeUploadedImages($request);

        Post::create([
            'title' => $validated['title'],
            'slug' => $this->makeUniqueSlug($validated['title']),
            'content' => $validated['content'],
            'task' => $validated['task'],
            'week' => $validated['week'],
            'date' => $validated['date'],
            'featured_image' => $this->encodeFeaturedImages($uploadedImageUrls),
        ]);

        return redirect()
            ->route('admin.blog.index')
            ->with('success', 'Post created successfully.');
    }

    public function edit(Post $post): Response
    {
        return Inertia::render('Admin/Blog/Edit', [
            'post' => $this->serializePost($post),
        ]);
    }

    public function update(Request $request, Post $post): \Illuminate\Http\RedirectResponse
    {
        $validated = $this->validatePost($request);
        $existingImageUrls = $this->decodeStoredImages($post->getRawOriginal('featured_image'));
        $uploadedImageUrls = $this->storeUploadedImages($request);
        $updatedImageUrls = $existingImageUrls;

        if ($uploadedImageUrls !== []) {
            $this->deleteImages($existingImageUrls);
            $updatedImageUrls = $uploadedImageUrls;
        }

        $post->update([
            'title' => $validated['title'],
            'slug' => $this->makeUniqueSlug($validated['title'], $post->id),
            'content' => $validated['content'],
            'task' => $validated['task'],
            'week' => $validated['week'],
            'date' => $validated['date'],
            'featured_image' => $this->encodeFeaturedImages($updatedImageUrls),
        ]);

        return redirect()
            ->route('admin.blog.index')
            ->with('success', 'Post updated successfully.');
    }

    public function destroy(Post $post): \Illuminate\Http\RedirectResponse
    {
        $featuredImageUrls = $this->decodeStoredImages($post->getRawOriginal('featured_image'));

        $post->delete();
        $this->deleteImages($featuredImageUrls);

        return redirect()
            ->route('admin.blog.index')
            ->with('success', 'Post deleted successfully.');
    }

    protected function validatePost(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'task' => ['required', 'string', 'max:255'],
            'week' => ['required', 'string', 'max:255'],
            'date' => ['required', 'date'],
            'featured_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'featured_images' => ['nullable', 'array', 'max:10'],
            'featured_images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
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
            'featured_image' => $post->featured_image_url,
            'featured_images' => $post->featured_images,
            'created_at' => $post->created_at?->toDateTimeString(),
        ];
    }

    protected function makeUniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($title);
        $slug = $baseSlug !== '' ? $baseSlug : 'post';

        $i = 1;
        while (Post::query()
            ->where('slug', $slug)
            ->when($ignoreId, fn ($query) => $query->where('id', '<>', $ignoreId))
            ->exists()) {
            $slug = ($baseSlug !== '' ? $baseSlug : 'post').'-'.$i;
            $i++;
        }

        return $slug;
    }

    protected function deleteImages(array $imageUrls): void
    {
        foreach ($imageUrls as $imageUrl) {
            $this->deleteImage($imageUrl);
        }
    }

    protected function deleteImage(?string $imageUrl): void
    {
        $diskName = $this->imagesDiskName();
        $projectImagePath = $this->resolveProjectImagePath($imageUrl);
        $path = $this->resolveDiskPath($imageUrl, $diskName);

        if ($projectImagePath && File::exists($projectImagePath)) {
            File::delete($projectImagePath);
        }

        if ($path) {
            Storage::disk($diskName)->delete($path);
        }
    }

    protected function storeUploadedImages(Request $request): array
    {
        $files = $request->file('featured_images', []);
        $files = is_array($files) ? $files : [$files];

        if ($files === [] && $request->hasFile('featured_image')) {
            $files = [$request->file('featured_image')];
        }

        $diskName = $this->imagesDiskName();
        $disk = Storage::disk($diskName);

        return collect($files)
            ->filter()
            ->map(function ($file) use ($disk, $diskName) {
                if ($diskName === 'public') {
                    return $this->storeProjectImage($file);
                }

                $path = $file->store('blog-featured', $diskName);

                return $disk->url($path);
            })
            ->values()
            ->all();
    }

    protected function storeProjectImage($file): string
    {
        $directory = public_path('images/blog-featured');
        File::ensureDirectoryExists($directory);

        $filename = $file->hashName();
        $file->move($directory, $filename);

        return '/blog-featured-images/'.$filename;
    }

    protected function decodeStoredImages(?string $storedValue): array
    {
        if (! is_string($storedValue) || trim($storedValue) === '') {
            return [];
        }

        $decodedValue = json_decode($storedValue, true);

        if (json_last_error() === JSON_ERROR_NONE && is_array($decodedValue)) {
            return array_values(array_filter($decodedValue, fn ($image) => is_string($image) && trim($image) !== ''));
        }

        return [$storedValue];
    }

    protected function encodeFeaturedImages(array $imageUrls): ?string
    {
        $imageUrls = array_values(array_filter($imageUrls, fn ($image) => is_string($image) && trim($image) !== ''));

        if ($imageUrls === []) {
            return null;
        }

        if (count($imageUrls) === 1) {
            return $imageUrls[0];
        }

        $encodedValue = json_encode($imageUrls, JSON_UNESCAPED_SLASHES);

        return is_string($encodedValue) ? $encodedValue : $imageUrls[0];
    }

    protected function resolveDiskPath(?string $imageUrl, string $diskName): ?string
    {
        if (! $imageUrl) {
            return null;
        }

        if ($diskName === 'public') {
            return $this->resolvePublicDiskPath($imageUrl);
        }

        if (Str::startsWith($imageUrl, 'data:')) {
            return null;
        }

        $path = parse_url($imageUrl, PHP_URL_PATH) ?: $imageUrl;
        $trimmedPath = ltrim((string) $path, '/');
        $bucket = trim((string) env('SUPABASE_STORAGE_BUCKET', ''), '/');

        if ($bucket !== '') {
            $publicPrefix = 'storage/v1/object/public/'.$bucket.'/';
            $signedPrefix = 'storage/v1/object/sign/'.$bucket.'/';

            if (Str::startsWith($trimmedPath, $publicPrefix)) {
                return Str::after($trimmedPath, $publicPrefix);
            }

            if (Str::startsWith($trimmedPath, $signedPrefix)) {
                return Str::after($trimmedPath, $signedPrefix);
            }
        }

        if (Str::startsWith($trimmedPath, 'blog-featured/')) {
            return $trimmedPath;
        }

        if ($trimmedPath !== '' && ! Str::contains($trimmedPath, '/')) {
            return 'blog-featured/'.$trimmedPath;
        }

        return $trimmedPath !== '' ? $trimmedPath : null;
    }

    protected function resolvePublicDiskPath(?string $imageUrl): ?string
    {
        if (! $imageUrl) {
            return null;
        }

        if (preg_match('/^(https?:)?\/\//i', $imageUrl) === 1 || Str::startsWith($imageUrl, 'data:')) {
            return null;
        }

        $path = parse_url($imageUrl, PHP_URL_PATH) ?: $imageUrl;

        if (Str::startsWith($path, '/storage/')) {
            return Str::after($path, '/storage/');
        }

        if (Str::startsWith($path, 'storage/')) {
            return Str::after($path, 'storage/');
        }

        if (Str::startsWith($path, '/blog-featured/')) {
            return Str::after($path, '/');
        }

        if (Str::startsWith($path, 'blog-featured/')) {
            return $path;
        }

        $trimmedPath = ltrim($path, '/');

        if ($trimmedPath !== '' && ! Str::contains($trimmedPath, '/')) {
            return 'blog-featured/'.$trimmedPath;
        }

        return null;
    }

    protected function resolveProjectImagePath(?string $imageUrl): ?string
    {
        if (! $imageUrl) {
            return null;
        }

        $path = parse_url($imageUrl, PHP_URL_PATH) ?: $imageUrl;
        $trimmedPath = ltrim((string) $path, '/');

        if (Str::startsWith($trimmedPath, 'images/blog-featured/')) {
            return public_path($trimmedPath);
        }

        if (Str::startsWith($trimmedPath, 'storage/blog-featured/')) {
            return public_path('images/blog-featured/'.basename($trimmedPath));
        }

        if (Str::startsWith($trimmedPath, 'blog-featured/')) {
            return public_path('images/'.trim($trimmedPath, '/'));
        }

        return null;
    }

    protected function imagesDiskName(): string
    {
        return (string) config('filesystems.blog_images_disk', 'public');
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
