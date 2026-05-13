import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import ImageLightbox from '../../../Components/ImageLightbox';

const fallbackImage = '/blog-featured-images/default.svg';

const excerpt = (text, max = 140) => {
    if (typeof text !== 'string') return '';

    const cleaned = text.replace(/\s+/g, ' ').trim();

    if (cleaned.length <= max) {
        return cleaned;
    }

    return `${cleaned.slice(0, max)}...`;
};

export default function Index({ posts = [] }) {
    const [activeImage, setActiveImage] = useState(null);

    const handleDelete = (post) => {
        if (!window.confirm(`Delete "${post.title}" permanently?`)) {
            return;
        }

        router.delete(`/admin/blog/${post.slug}`);
    };

    return (
        <AdminLayout
            title="Blog Management"
            description="Create, edit, and delete blog posts. Manage all your weekly updates from here."
        >
            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="card bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                    <div className="card-body">
                        <div className="text-primary font-bold text-3xl">{posts.length}</div>
                        <p className="text-sm text-base-content/70 font-medium">Total Posts Published</p>
                    </div>
                </div>
                <div className="card bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20">
                    <div className="card-body">
                        <div className="text-secondary font-bold text-3xl">
                            {new Set(posts.map(p => p.week)).size}
                        </div>
                        <p className="text-sm text-base-content/70 font-medium">Weeks Covered</p>
                    </div>
                </div>
                <div className="card bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                    <div className="card-body">
                        <div className="text-accent font-bold text-3xl">
                            {new Set(posts.map(p => p.task)).size}
                        </div>
                        <p className="text-sm text-base-content/70 font-medium">Unique Tasks</p>
                    </div>
                </div>
            </div>

            {/* Header with Create Button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 pb-4">
                <div>
                    <p className="text-sm text-base-content/70 font-medium">
                        {posts.length === 0 
                            ? 'No posts yet' 
                            : `${posts.length} ${posts.length === 1 ? 'post' : 'posts'} available`}
                    </p>
                </div>
                <Link href="/admin/blog/create" className="btn btn-primary btn-lg font-semibold rounded-lg w-full sm:w-auto">
                    + Create New Post
                </Link>
            </div>

            {/* Posts List or Empty State */}
            {posts.length === 0 ? (
                <div className="card border border-base-300 bg-base-100 shadow-md">
                    <div className="card-body text-center py-16">
                        <div className="text-6xl mb-4">✍️</div>
                        <h2 className="card-title justify-center text-2xl font-bold text-base-content">
                            No blog posts yet
                        </h2>
                        <p className="text-base-content/70 text-lg max-w-md mx-auto">
                            Start creating your first weekly update to get started with your blog.
                        </p>
                        <div className="card-actions justify-center pt-4">
                            <Link href="/admin/blog/create" className="btn btn-primary btn-lg font-semibold">
                                Create First Post
                            </Link>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {posts.map((post) => (
                        <article
                            key={post.id}
                            className="group card overflow-hidden border border-base-300 bg-base-100 shadow-md hover:shadow-lg hover:border-primary/50 transition-all duration-300 flex flex-col"
                        >
                            {/* Image */}
                            <figure className="relative h-56 bg-base-200 overflow-hidden flex-shrink-0">
                                <img
                                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                                    src={post.featured_image || fallbackImage}
                                    alt={post.title}
                                    onError={(event) => {
                                        event.currentTarget.src = fallbackImage;
                                    }}
                                    onClick={(event) => setActiveImage(event.currentTarget.currentSrc || fallbackImage)}
                                />
                                <div className="absolute top-4 left-4 z-10">
                                    <div className="badge badge-primary font-bold text-sm">{post.week}</div>
                                </div>
                            </figure>

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
                                <h3 className="card-title text-xl font-bold text-base-content line-clamp-2">
                                    {post.title}
                                </h3>

                                {/* Excerpt */}
                                <p className="text-base-content/70 text-sm leading-relaxed line-clamp-2">
                                    {excerpt(post.content, 100)}
                                </p>

                                {/* Actions Footer */}
                                <div className="flex-1"></div>
                                <div className="border-t border-base-300 pt-4">
                                    <div className="flex flex-wrap gap-2 justify-between">
                                        <Link 
                                            href={`/blog/${post.slug}`} 
                                            className="btn btn-ghost btn-sm font-medium hover:btn-primary"
                                            title="View public post"
                                        >
                                            View Public →
                                        </Link>
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/admin/blog/${post.slug}/edit`}
                                                className="btn btn-outline btn-sm font-medium"
                                                title="Edit post"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                type="button"
                                                className="btn btn-error btn-sm font-medium"
                                                onClick={() => handleDelete(post)}
                                                title="Delete post"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            <ImageLightbox src={activeImage} onClose={() => setActiveImage(null)} />
        </AdminLayout>
    );
}
