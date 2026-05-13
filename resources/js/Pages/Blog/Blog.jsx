import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import FlashBanner from '../../Components/FlashBanner';
import ImageLightbox from '../../Components/ImageLightbox';

export default function Blog({ posts = [] }) {
    const { auth = {} } = usePage().props;
    const fallbackImage = '/blog-featured-images/default.svg';
    const hasPosts = Array.isArray(posts) && posts.length > 0;
    const isAdmin = auth.user?.role === 'admin';
    const [activeImage, setActiveImage] = useState(null);

    const excerpt = (text, max = 120) => {
        if (typeof text !== 'string') return '';

        const cleaned = text.replace(/\s+/g, ' ').trim();

        if (cleaned.length <= max) return cleaned;

        return `${cleaned.slice(0, max)}...`;
    };

    const handleDelete = (post) => {
        if (!window.confirm(`Delete "${post.title}" permanently?`)) {
            return;
        }

        router.delete(`/admin/blog/${post.slug}`);
    };

    return (
        <>
            {/* Page Header */}
            <section className="bg-gradient-to-b from-primary/10 to-base-100 py-12 sm:py-16 px-4 border-b border-base-300">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                        <div className="space-y-3">
                            <div className="inline-block">
                                <div className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">Blog</div>
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-bold text-base-content">
                                Weekly Updates & Insights
                            </h1>
                            <p className="text-base-content/70 text-lg max-w-2xl">
                                Explore my latest articles about web development, learning progress, and project insights.
                            </p>
                        </div>
                        {isAdmin ? (
                            <Link 
                                href="/admin/blog/create" 
                                className="btn btn-primary btn-lg font-semibold rounded-lg w-full sm:w-auto"
                            >
                                + Create Post
                            </Link>
                        ) : null}
                    </div>
                </div>
            </section>

            {/* Flash Messages */}
            <div className="px-4 py-6">
                <div className="mx-auto max-w-7xl">
                    <FlashBanner />
                </div>
            </div>

            {/* Main Content */}
            <main className="px-4 py-12 sm:py-16">
                <div className="mx-auto max-w-7xl">
                    {!hasPosts ? (
                        <div className="card border border-base-300 bg-base-100 shadow-md">
                            <div className="card-body text-center py-16">
                                <div className="text-5xl mb-4">📝</div>
                                <h2 className="card-title justify-center text-2xl font-bold text-base-content">
                                    No blogs posted yet
                                </h2>
                                <p className="text-base-content/70 text-lg max-w-md mx-auto">
                                    Check back soon for the next weekly post. New content is coming!
                                </p>
                                {isAdmin && (
                                    <div className="card-actions justify-center pt-4">
                                        <Link href="/admin/blog/create" className="btn btn-primary">
                                            Create First Post
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post) => (
                                <article
                                    key={post.id}
                                    className="group card bg-base-100 border border-base-300 shadow-md hover:shadow-xl hover:border-primary/50 transition-all duration-300 overflow-hidden flex flex-col"
                                >
                                    {/* Image Container */}
                                    <Link href={`/blog/${post.slug}`} className="block flex-shrink-0">
                                        <figure className="relative h-64 bg-base-200 overflow-hidden">
                                            <img
                                                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                                                src={post.featured_image || fallbackImage}
                                                alt={post.title}
                                                onError={(event) => {
                                                    event.currentTarget.src = fallbackImage;
                                                }}
                                            />
                                            {/* Week Badge */}
                                            <div className="absolute top-4 left-4 z-10">
                                                <div className="badge badge-primary font-bold text-sm">{post.week}</div>
                                            </div>
                                        </figure>
                                    </Link>

                                    {/* Content */}
                                    <div className="card-body gap-4 flex-1 flex flex-col">
                                        {/* Meta Information */}
                                        <div className="flex flex-wrap gap-2">
                                            <div className="badge badge-outline text-xs font-medium">{post.task}</div>
                                            <div className="text-xs text-base-content/60 font-medium">
                                                {post.date || 'No date'}
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <Link href={`/blog/${post.slug}`} className="block">
                                            <h3 className="card-title text-xl font-bold text-base-content group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                                                {post.title}
                                            </h3>
                                        </Link>

                                        {/* Excerpt */}
                                        <p className="text-base-content/70 text-sm leading-relaxed line-clamp-2">
                                            {excerpt(post.content, 100)}
                                        </p>

                                        {/* Footer with Actions */}
                                        <div className="flex-1"></div>
                                        <div className="card-actions justify-between pt-4 border-t border-base-300">
                                            <Link 
                                                href={`/blog/${post.slug}`} 
                                                className="btn btn-ghost btn-sm font-semibold hover:btn-primary"
                                            >
                                                Read Article →
                                            </Link>
                                            {isAdmin && (
                                                <div className="flex gap-1">
                                                    <Link
                                                        href={`/admin/blog/${post.slug}/edit`}
                                                        className="btn btn-outline btn-xs"
                                                        title="Edit post"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        className="btn btn-error btn-xs"
                                                        onClick={() => handleDelete(post)}
                                                        title="Delete post"
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
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-base-200 border-t border-base-300 py-8 mt-12">
                <div className="mx-auto max-w-7xl px-4 text-center text-base-content/70">
                    <p className="font-medium">© 2024 Weekly Blog. All rights reserved.</p>
                </div>
            </footer>

            <ImageLightbox src={activeImage} onClose={() => setActiveImage(null)} />
        </>
    );
}
