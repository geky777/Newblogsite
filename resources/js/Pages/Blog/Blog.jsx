import React from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import FlashBanner from '../../Components/FlashBanner';

export default function Blog({ posts = [] }) {
    const { auth = {} } = usePage().props;
    const fallbackImage = 'https://img.daisyui.com/images/stock/photo-1504384308090-c894fdcc538d.webp';
    const hasPosts = Array.isArray(posts) && posts.length > 0;
    const isAdmin = auth.user?.role === 'admin';

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
        <div className="p-4">
            <div className="mx-auto w-full max-w-7xl">
                <div className="mb-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold sm:text-3xl">Blogs</h1>
                        {isAdmin ? (
                            <Link href="/admin/blog/create" className="btn btn-primary">
                                Add Blog
                            </Link>
                        ) : null}
                    </div>
                    <FlashBanner />
                </div>

                {!hasPosts ? (
                    <div className="card border border-base-300 bg-base-100 shadow-sm">
                        <div className="card-body">
                            <h2 className="card-title">No blogs added yet</h2>
                            <p className="text-base-content/70">Check back soon for the next weekly post.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post) => (
                            <article
                                key={post.id}
                                className="card bg-base-100 shadow-sm"
                            >
                                <Link href={`/blog/${post.slug}`} className="block">
                                    <figure>
                                        <img src={post.featured_image || fallbackImage} alt={post.title} />
                                    </figure>
                                </Link>
                                <div className="card-body">
                                    <Link href={`/blog/${post.slug}`} className="block">
                                        <h2 className="card-title">
                                            {post.title}
                                            <div className="badge badge-secondary">{post.week}</div>
                                        </h2>
                                    </Link>
                                    <p>{excerpt(post.content)}</p>
                                    <div className="card-actions justify-between">
                                        <div className="flex gap-2">
                                            <div className="badge badge-outline">{post.week}</div>
                                            <div className="badge badge-outline">{post.task}</div>
                                        </div>

                                        {isAdmin ? (
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/admin/blog/${post.slug}/edit`}
                                                    className="btn btn-outline btn-sm"
                                                >
                                                    Update
                                                </Link>
                                                <button
                                                    type="button"
                                                    className="btn btn-error btn-sm"
                                                    onClick={() => handleDelete(post)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
