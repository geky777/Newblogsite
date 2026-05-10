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

        $storagePath = Storage::disk('public')->path('blog-featured/'.$filename);
        $legacyPath = public_path('legacy-blog-featured/'.$filename);

        foreach ([$storagePath, $legacyPath] as $path) {
            if (is_file($path)) {
                return response()->file($path, [
                    'Cache-Control' => 'public, max-age=31536000',
                ]);
            }
        }

        return redirect('https://img.daisyui.com/images/stock/photo-1504384308090-c894fdcc538d.webp');
    }
}
