import React from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import FlashBanner from '../../Components/FlashBanner';

export default function Show({ post }) {
    const { auth = {} } = usePage().props;
    const fallbackImage = 'https://img.daisyui.com/images/stock/photo-1504384308090-c894fdcc538d.webp';
    const isAdmin = auth.user?.role === 'admin';

    const handleDelete = () => {
        if (!window.confirm(`Delete "${post.title}" permanently?`)) {
            return;
        }

        router.delete(`/admin/blog/${post.slug}`);
    };

    return (
        <div className="p-4">
            <div className="mx-auto w-full max-w-4xl">
                <div className="mb-6 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <Link href="/blog" className="btn btn-ghost btn-sm">
                            Back to Blog
                        </Link>
                        {isAdmin ? (
                            <div className="flex gap-2">
                                <Link href="/admin/blog/create" className="btn btn-primary btn-sm">
                                    Add Blog
                                </Link>
                                <Link href={`/admin/blog/${post.slug}/edit`} className="btn btn-outline btn-sm">
                                    Update
                                </Link>
                                <button type="button" className="btn btn-error btn-sm" onClick={handleDelete}>
                                    Delete
                                </button>
                            </div>
                        ) : null}
                    </div>
                    <FlashBanner />
                </div>

                <article className="card overflow-hidden border border-base-300 bg-base-100 shadow-sm">
                    <figure className="h-64 sm:h-80">
                        <img
                            className="h-full w-full object-cover"
                            src={post.featured_image || fallbackImage}
                            alt={post.title}
                        />
                    </figure>
                    <div className="card-body">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="badge badge-secondary">{post.week}</div>
                            <div className="badge badge-outline">{post.task}</div>
                            <div className="text-sm text-base-content/60">{post.date || ''}</div>
                        </div>
                        <h1 className="mb-6 text-3xl font-bold sm:text-4xl">{post.title}</h1>
                        <div className="whitespace-pre-line text-base-content/90">{post.content}</div>
                        <div className="card-actions mt-8 justify-start">
                            <Link href="/blog" className="btn btn-outline">
                                Back to Blog
                            </Link>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
}
