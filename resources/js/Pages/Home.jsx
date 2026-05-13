import React from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import FlashBanner from '../Components/FlashBanner';

export default function Home({ recentPosts = [] }) {
    const { auth = {} } = usePage().props;
    const fallbackImage = 'https://img.daisyui.com/images/stock/photo-1504384308090-c894fdcc538d.webp';
    const isAdmin = auth.user?.role === 'admin';

    const handleDelete = (post) => {
        if (!window.confirm(`Delete "${post.title}" permanently?`)) {
            return;
        }

        router.delete(`/admin/blog/${post.slug}`);
    };

    return (
        <>
            {/* Hero Section */}
            <section className="relative pt-6 pb-12 sm:pt-8 sm:pb-16 lg:pt-12 lg:pb-24 px-4 bg-gradient-to-b from-base-100 to-base-100/50">
                <div className="mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 gap-12 lg:gap-16 lg:grid-cols-2 lg:items-center">
                        {/* Hero Content */}
                        <div className="flex flex-col justify-center space-y-6">
                            <div className="space-y-4">
                                <div className="inline-block">
                                    <div className="badge badge-primary badge-lg font-semibold">Welcome</div>
                                </div>
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-base-content leading-tight">
                                    Hi, I&apos;m{' '}
                                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                        Lord Zaro Fiber A. Quintanilla
                                    </span>
                                </h1>
                                <p className="text-lg text-base-content/70 leading-relaxed max-w-lg">
                                    Welcome to my weekly blog. I document my learning journey every week through class projects and personal builds. This is where I share what I&apos;m making, reading, and figuring out.
                                </p>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-wrap gap-4 pt-4">
                                <Link 
                                    href="/blog" 
                                    className="btn btn-primary btn-lg font-semibold rounded-lg"
                                >
                                    Read My Blog
                                </Link>
                                <button className="btn btn-outline btn-lg font-semibold rounded-lg">
                                    Get to Know Me
                                </button>
                                {isAdmin ? (
                                    <Link 
                                        href="/admin/blog/create" 
                                        className="btn btn-secondary btn-lg font-semibold rounded-lg"
                                    >
                                        Create Post
                                    </Link>
                                ) : null}
                            </div>
                        </div>

                        {/* Hero Image */}
                        <div className="flex items-center justify-center">
                            <div className="relative w-full max-w-md">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-3xl"></div>
                                <figure className="relative rounded-2xl overflow-hidden border border-base-300 shadow-xl">
                                    <img
                                        className="w-full h-auto object-cover aspect-square"
                                        src="/images/card-holder.jpg"
                                        alt="Profile"
                                    />
                                </figure>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Flash Messages */}
            <div className="px-4 py-4">
                <div className="mx-auto max-w-7xl">
                    <FlashBanner />
                </div>
            </div>

            {/* Featured Posts Section */}
            <section className="py-16 sm:py-20 px-4 bg-base-100">
                <div className="mx-auto max-w-7xl">
                    {/* Section Header */}
                    <div className="mb-12 text-center sm:text-left">
                        <div className="inline-block mb-4">
                            <div className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">Featured Work</div>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-base-content mb-4">
                            Latest Blog Posts
                        </h2>
                        <div className="w-12 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
                    </div>

                    {/* Posts Grid */}
                    {recentPosts.length === 0 ? (
                        <div className="card border border-base-300 bg-base-100 shadow-md">
                            <div className="card-body text-center py-12">
                                <h3 className="card-title justify-center text-xl font-bold text-base-content">
                                    No posts yet
                                </h3>
                                <p className="text-base-content/70">Check back soon for the latest updates.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {recentPosts.map((post) => (
                                <article
                                    key={post.id}
                                    className="group card bg-base-100 border border-base-300 shadow-md hover:shadow-lg hover:border-primary/50 transition-all duration-300 overflow-hidden"
                                >
                                    {/* Image */}
                                    <Link href={`/blog/${post.slug}`} className="block">
                                        <figure className="relative h-64 bg-base-200 overflow-hidden">
                                            <img
                                                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                src={post.featured_image || fallbackImage}
                                                alt={post.title}
                                            />
                                            <div className="absolute top-4 left-4">
                                                <div className="badge badge-primary font-semibold">{post.week}</div>
                                            </div>
                                        </figure>
                                    </Link>

                                    {/* Content */}
                                    <div className="card-body gap-4">
                                        {/* Meta Tags */}
                                        <div className="flex flex-wrap gap-2">
                                            <div className="badge badge-outline text-xs">{post.task}</div>
                                            <div className="text-xs text-base-content/60 font-medium">{post.date || 'No date'}</div>
                                        </div>

                                        {/* Title and Link */}
                                        <Link href={`/blog/${post.slug}`} className="block">
                                            <h3 className="card-title text-xl font-bold text-base-content group-hover:text-primary transition-colors line-clamp-2">
                                                {post.title}
                                            </h3>
                                        </Link>

                                        {/* Actions */}
                                        <div className="card-actions justify-between pt-2 border-t border-base-300">
                                            <Link href={`/blog/${post.slug}`} className="btn btn-ghost btn-sm font-medium">
                                                Read More →
                                            </Link>
                                            {isAdmin && (
                                                <div className="flex gap-2">
                                                    <Link
                                                        href={`/admin/blog/${post.slug}/edit`}
                                                        className="btn btn-outline btn-xs"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        className="btn btn-error btn-xs"
                                                        onClick={() => handleDelete(post)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    {/* View All Button */}
                    <div className="mt-12 text-center">
                        <Link href="/blog" className="btn btn-outline btn-lg font-semibold">
                            View All Posts
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-base-200 border-t border-base-300 py-8">
                <div className="mx-auto max-w-7xl px-4 text-center text-base-content/70">
                    <p className="font-medium">© 2024 Weekly Blog. All rights reserved.</p>
                </div>
            </footer>
        </>
    );
}
