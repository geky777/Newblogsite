<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class BlogFeaturedImageController extends Controller
{
    public function __invoke(string $filename): BinaryFileResponse|RedirectResponse|Response
    {
        abort_if($filename !== basename($filename), 404);

        $projectPath = public_path('images/blog-featured/'.$filename);
        $storagePath = Storage::disk('public')->path('blog-featured/'.$filename);
        $legacyPath = public_path('legacy-blog-featured/'.$filename);
        $defaultPath = public_path('images/blog-featured/default.svg');

        foreach ([$projectPath, $storagePath, $legacyPath, $defaultPath] as $path) {
            if (is_file($path)) {
                return response()->file($path, [
                    'Cache-Control' => 'public, max-age=31536000',
                ]);
            }
        }

        abort(404);
    }
}
