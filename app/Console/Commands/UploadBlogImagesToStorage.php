<?php

namespace App\Console\Commands;

use App\Models\Post;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadBlogImagesToStorage extends Command
{
    protected $signature = 'blog:upload-images
        {--source=public : Source disk that currently holds the images}
        {--disk= : Target disk to upload to}
        {--path=blog-featured : Path prefix to upload}
        {--only-missing : Upload only when the target is missing}
        {--dry-run : Preview actions without uploading}
        {--no-db : Do not update database URLs}';

    protected $description = 'Upload local blog featured images to a storage disk and update database URLs.';

    public function handle(): int
    {
        $sourceDiskName = (string) $this->option('source');
        $targetDiskName = (string) ($this->option('disk') ?: config('filesystems.blog_images_disk', 'public'));
        $pathPrefix = trim((string) $this->option('path'), '/');
        $onlyMissing = (bool) $this->option('only-missing');
        $dryRun = (bool) $this->option('dry-run');
        $updateDb = ! $this->option('no-db');

        $sourceDisk = Storage::disk($sourceDiskName);
        $targetDisk = Storage::disk($targetDiskName);

        $this->info("Source disk: {$sourceDiskName}");
        $this->info("Target disk: {$targetDiskName}");
        $this->info("Path prefix: {$pathPrefix}");

        $files = $sourceDisk->allFiles($pathPrefix);

        if ($files === []) {
            $this->warn('No files found to upload.');
        }

        $uploaded = 0;
        $skipped = 0;
        $failed = 0;

        foreach ($files as $file) {
            $relativePath = ltrim((string) $file, '/');

            if ($onlyMissing && $targetDisk->exists($relativePath)) {
                $skipped++;
                continue;
            }

            if ($dryRun) {
                $this->line("Would upload: {$relativePath}");
                $uploaded++;
                continue;
            }

            if (! $this->uploadFile($sourceDiskName, $targetDiskName, $relativePath)) {
                $failed++;
                continue;
            }

            $uploaded++;
        }

        $this->line("Uploaded: {$uploaded}, skipped: {$skipped}, failed: {$failed}");

        if ($updateDb) {
            $this->updateDatabaseUrls($sourceDiskName, $targetDiskName, $pathPrefix, $onlyMissing, $dryRun);
        }

        return Command::SUCCESS;
    }

    protected function uploadFile(string $sourceDiskName, string $targetDiskName, string $relativePath): bool
    {
        $sourceDisk = Storage::disk($sourceDiskName);
        $targetDisk = Storage::disk($targetDiskName);

        $stream = $sourceDisk->readStream($relativePath);

        if ($stream === false) {
            $this->warn("Unable to read: {$relativePath}");
            return false;
        }

        $result = $targetDisk->put($relativePath, $stream, ['visibility' => 'public']);

        if (is_resource($stream)) {
            fclose($stream);
        }

        if (! $result) {
            $this->warn("Upload failed: {$relativePath}");
        }

        return (bool) $result;
    }

    protected function updateDatabaseUrls(
        string $sourceDiskName,
        string $targetDiskName,
        string $pathPrefix,
        bool $onlyMissing,
        bool $dryRun
    ): void {
        $this->info('Updating database image URLs...');

        $sourceDisk = Storage::disk($sourceDiskName);
        $targetDisk = Storage::disk($targetDiskName);

        $updatedPosts = 0;
        $updatedImages = 0;

        $posts = Post::query()->select('id', 'featured_image')->get();

        foreach ($posts as $post) {
            $storedValue = $post->getRawOriginal('featured_image');
            $images = $this->decodeStoredImages($storedValue);

            if ($images === []) {
                continue;
            }

            $changed = false;
            $updatedList = [];

            foreach ($images as $image) {
                $relativePath = $this->resolveLocalPath($image, $pathPrefix);

                if ($relativePath === null) {
                    $updatedList[] = $image;
                    continue;
                }

                if (! $onlyMissing || ! $targetDisk->exists($relativePath)) {
                    if ($sourceDisk->exists($relativePath) && ! $dryRun) {
                        $this->uploadFile($sourceDiskName, $targetDiskName, $relativePath);
                    }
                }

                $newUrl = $targetDisk->url($relativePath);
                $updatedList[] = $newUrl;
                $changed = true;
                $updatedImages++;
            }

            if (! $changed) {
                continue;
            }

            if ($dryRun) {
                $this->line("Would update post {$post->id}");
                continue;
            }

            $post->update([
                'featured_image' => $this->encodeFeaturedImages($updatedList),
            ]);
            $updatedPosts++;
        }

        $this->line("Updated posts: {$updatedPosts}, updated images: {$updatedImages}");
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

    protected function resolveLocalPath(string $value, string $pathPrefix): ?string
    {
        $value = trim($value);

        if ($value === '' || Str::startsWith($value, 'data:')) {
            return null;
        }

        $path = parse_url($value, PHP_URL_PATH) ?: $value;
        $path = ltrim((string) $path, '/');

        if (Str::startsWith($path, 'storage/')) {
            $path = Str::after($path, 'storage/');
        }

        if (Str::startsWith($path, $pathPrefix.'/')) {
            return $path;
        }

        if ($path !== '' && ! Str::contains($path, '/')) {
            return $pathPrefix.'/'.$path;
        }

        return $path !== '' ? $path : null;
    }
}
