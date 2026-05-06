<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\BlogController as AdminBlogController;
use App\Http\Controllers\Admin\AdminSessionController;
use App\Http\Controllers\BlogController;
use App\Models\Post;

Route::get('/', function () {
    $recentPosts = Post::query()
        ->orderBy('created_at', 'desc')
        ->orderBy('id', 'desc')
        ->take(3)
        ->get()
        ->map(fn (Post $post) => [
            'id' => $post->id,
            'title' => $post->title,
            'slug' => $post->slug,
            'week' => $post->week,
            'date' => $post->date?->toDateString(),
            'featured_image' => $post->featured_image_url,
            'featured_images' => $post->featured_images,
        ])
        ->values();

    return Inertia::render('Home', [
        'recentPosts' => $recentPosts,
    ]);
})->name('home');

Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');
Route::get('/blog/{post}', [BlogController::class, 'show'])->name('blog.show');
Route::get('/logout', [AdminSessionController::class, 'destroy'])->name('logout');

Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdminSessionController::class, 'create'])->name('login');
    Route::post('/login', [AdminSessionController::class, 'store'])->name('login.store');
    Route::post('/logout', [AdminSessionController::class, 'destroy'])->middleware('admin')->name('logout');

    Route::prefix('blog')->name('blog.')->middleware('admin')->group(function () {
        Route::get('/', [AdminBlogController::class, 'index'])->name('index');
        Route::get('/create', [AdminBlogController::class, 'create'])->name('create');
        Route::post('/', [AdminBlogController::class, 'store'])->name('store');
        Route::get('/{post}/edit', [AdminBlogController::class, 'edit'])->name('edit');
        Route::match(['put', 'patch'], '/{post}', [AdminBlogController::class, 'update'])->name('update');
        Route::delete('/{post}', [AdminBlogController::class, 'destroy'])->name('destroy');
    });
});
