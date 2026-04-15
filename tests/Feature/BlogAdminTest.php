<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class BlogAdminTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_can_view_public_blog_pages(): void
    {
        $post = $this->createPost();

        $this->get('/')->assertOk();
        $this->get('/blog')->assertOk();
        $this->get("/blog/{$post->slug}")->assertOk();
    }

    public function test_public_crud_routes_are_not_available(): void
    {
        $post = $this->createPost();

        $this->get('/blog/create')->assertNotFound();
        $this->get("/blog/{$post->slug}/edit")->assertNotFound();
    }

    public function test_guest_is_redirected_to_admin_login_for_admin_routes(): void
    {
        $this->get('/admin/blog')->assertRedirect('/admin');

        $this->followingRedirects()
            ->get('/admin/blog')
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Auth/Login')
                ->where('flash.error', 'Please sign in as an admin to continue.')
            );
    }

    public function test_admin_login_page_is_available_for_guests(): void
    {
        $this->get('/admin')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Admin/Auth/Login'));
    }

    public function test_database_seeder_creates_single_admin_user(): void
    {
        $this->seed(DatabaseSeeder::class);

        $admin = User::query()->where('email', config('admin.email'))->first();

        $this->assertNotNull($admin);
        $this->assertSame(User::ROLE_ADMIN, $admin->role);
        $this->assertTrue(Hash::check(config('admin.password'), $admin->password));
    }

    public function test_valid_admin_credentials_allow_login_and_home_access(): void
    {
        $this->seed(DatabaseSeeder::class);

        $response = $this->post('/admin/login', [
            'email' => config('admin.email'),
            'password' => config('admin.password'),
        ]);

        $response
            ->assertRedirect('/')
            ->assertSessionHas('success', 'Admin mode enabled. Blog controls are now visible.');

        $this->followingRedirects()
            ->post('/admin/login', [
                'email' => config('admin.email'),
                'password' => config('admin.password'),
            ])
            ->assertInertia(fn (Assert $page) => $page
                ->component('Home')
                ->where('flash.success', 'Admin mode enabled. Blog controls are now visible.')
                ->where('auth.user.role', 'admin')
            );
    }

    public function test_admin_blog_index_redirects_to_home_for_admin_users(): void
    {
        $admin = $this->seedAdmin();

        $this->actingAs($admin)
            ->get('/admin/blog')
            ->assertRedirect('/');
    }

    public function test_non_admin_user_is_blocked_from_admin_routes(): void
    {
        $viewer = User::factory()->create();

        $response = $this->actingAs($viewer)->get('/admin/blog');

        $response->assertRedirect('/blog');
        $this->actingAs($viewer)
            ->followingRedirects()
            ->get('/admin/blog')
            ->assertInertia(fn (Assert $page) => $page
                ->component('Blog/Blog')
                ->where('flash.error', 'You are not authorized to access the admin area.')
            );
    }

    public function test_admin_can_update_a_post_and_replace_the_featured_image(): void
    {
        Storage::fake('public');

        $admin = $this->seedAdmin();
        Storage::disk('public')->put('blog-featured/old-image.jpg', 'old-file');

        $post = $this->createPost([
            'title' => 'Original Title',
            'slug' => 'original-title',
            'featured_image' => Storage::url('blog-featured/old-image.jpg'),
        ]);

        $response = $this->actingAs($admin)->post("/admin/blog/{$post->slug}", [
            '_method' => 'put',
            'title' => 'Updated Title',
            'content' => 'Updated content for the post body.',
            'task' => 'Refinement',
            'week' => 'Week 9',
            'date' => '2026-04-05',
            'featured_image' => UploadedFile::fake()->image('new-image.png'),
        ]);

        $response
            ->assertRedirect('/blog/updated-title')
            ->assertSessionHas('success', 'Post updated successfully.');

        $post->refresh();

        $this->assertSame('updated-title', $post->slug);
        $this->assertSame('Updated Title', $post->title);
        Storage::disk('public')->assertMissing('blog-featured/old-image.jpg');
        Storage::disk('public')->assertExists($this->publicPathFromUrl($post->featured_image));
    }

    public function test_updating_without_a_new_image_keeps_the_existing_featured_image(): void
    {
        $admin = $this->seedAdmin();
        $post = $this->createPost([
            'featured_image' => '/storage/blog-featured/existing-image.jpg',
        ]);

        $this->actingAs($admin)->post("/admin/blog/{$post->slug}", [
            '_method' => 'put',
            'title' => 'Same Image Post',
            'content' => 'Content stays valid.',
            'task' => 'Writing',
            'week' => 'Week 4',
            'date' => '2026-04-05',
        ])->assertRedirect('/blog/same-image-post');

        $this->assertSame('/storage/blog-featured/existing-image.jpg', $post->fresh()->featured_image);
    }

    public function test_admin_can_delete_a_post_and_its_featured_image(): void
    {
        Storage::fake('public');

        $admin = $this->seedAdmin();
        Storage::disk('public')->put('blog-featured/delete-me.jpg', 'delete-file');

        $post = $this->createPost([
            'slug' => 'delete-me',
            'featured_image' => Storage::url('blog-featured/delete-me.jpg'),
        ]);

        $this->actingAs($admin)
            ->delete("/admin/blog/{$post->slug}")
            ->assertRedirect('/blog')
            ->assertSessionHas('success', 'Post deleted successfully.');

        $this->assertDatabaseMissing('posts', [
            'id' => $post->id,
        ]);

        Storage::disk('public')->assertMissing('blog-featured/delete-me.jpg');
    }

    public function test_admin_can_log_out(): void
    {
        $admin = $this->seedAdmin();

        $this->actingAs($admin)
            ->post('/admin/logout')
            ->assertRedirect('/')
            ->assertSessionHas('success', 'You have been signed out.');

        $this->assertGuest();
    }

    public function test_admin_can_log_out_from_logout_url(): void
    {
        $admin = $this->seedAdmin();

        $this->actingAs($admin)
            ->get('/logout')
            ->assertRedirect('/')
            ->assertSessionHas('success', 'You have been signed out.');

        $this->assertGuest();
    }

    protected function seedAdmin(): User
    {
        $this->seed(DatabaseSeeder::class);

        return User::query()->where('email', config('admin.email'))->firstOrFail();
    }

    protected function createPost(array $attributes = []): Post
    {
        return Post::query()->create(array_merge([
            'title' => 'Weekly Reflection',
            'slug' => 'weekly-reflection',
            'content' => 'This week I worked through the next set of blog features.',
            'task' => 'Writing',
            'week' => 'Week 4',
            'date' => '2026-04-01',
            'featured_image' => null,
        ], $attributes));
    }

    protected function publicPathFromUrl(?string $url): ?string
    {
        if (! $url) {
            return null;
        }

        $path = parse_url($url, PHP_URL_PATH) ?: $url;

        return str_starts_with($path, '/storage/')
            ? substr($path, strlen('/storage/'))
            : $path;
    }
}
