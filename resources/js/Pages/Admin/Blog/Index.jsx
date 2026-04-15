import React from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

const fallbackImage = 'https://img.daisyui.com/images/stock/photo-1504384308090-c894fdcc538d.webp';

const excerpt = (text, max = 140) => {
    if (typeof text !== 'string') return '';

    const cleaned = text.replace(/\s+/g, ' ').trim();

    if (cleaned.length <= max) {
        return cleaned;
    }

    return `${cleaned.slice(0, max)}...`;
};

export default function Index({ posts = [] }) {
    const handleDelete = (post) => {
        if (!window.confirm(`Delete "${post.title}" permanently?`)) {
            return;
        }

        router.delete(`/admin/blog/${post.slug}`);
    };

    return (
        <AdminLayout
            title="Admin Dashboard"
            description="Create, update, and delete posts while the public blog stays view-only."
        >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-base-content/60">
                    {posts.length} {posts.length === 1 ? 'post' : 'posts'} available
                </div>

                <Link href="/admin/blog/create" className="btn btn-primary">
                    Create Post
                </Link>
            </div>

            {posts.length === 0 ? (
                <div className="card border border-base-300 bg-base-100 shadow-sm">
                    <div className="card-body">
                        <h2 className="card-title">No blog posts yet</h2>
                        <p className="text-base-content/70">
                            Start your admin area by creating the first weekly update.
                        </p>
                        <div className="card-actions justify-end">
                            <Link href="/admin/blog/create" className="btn btn-primary">
                                Create First Post
                            </Link>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {posts.map((post) => (
                        <article
                            key={post.id}
                            className="card overflow-hidden border border-base-300 bg-base-100 shadow-sm"
                        >
                            <figure className="h-56 bg-base-200">
                                <img
                                    className="h-full w-full object-cover"
                                    src={post.featured_image || fallbackImage}
                                    alt={post.title}
                                />
                            </figure>

                            <div className="card-body gap-4">
                                <div className="flex flex-wrap items-center gap-2">
                                    <div className="badge badge-secondary">{post.week}</div>
                                    <div className="badge badge-outline">{post.task}</div>
                                    <div className="text-xs text-base-content/50">{post.date || 'No date'}</div>
                                </div>

                                <div className="space-y-2">
                                    <h2 className="card-title text-2xl">{post.title}</h2>
                                    <p className="text-sm leading-6 text-base-content/70">
                                        {excerpt(post.content)}
                                    </p>
                                </div>

                                <div className="card-actions justify-between">
                                    <Link href={`/blog/${post.slug}`} className="btn btn-ghost btn-sm">
                                        View Public Post
                                    </Link>

                                    <div className="flex gap-2">
                                        <Link href={`/admin/blog/${post.slug}/edit`} className="btn btn-outline btn-sm">
                                            Edit
                                        </Link>
                                        <button
                                            type="button"
                                            className="btn btn-error btn-sm"
                                            onClick={() => handleDelete(post)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
