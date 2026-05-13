import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import FlashBanner from '../../Components/FlashBanner';
import ImageLightbox from '../../Components/ImageLightbox';

const galleryGridClass = (imageCount) => {
    if (imageCount <= 1) {
        return 'grid grid-cols-1 gap-3';
    }

    if (imageCount === 2) {
        return 'grid grid-cols-1 sm:grid-cols-2 gap-3';
    }

    return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3';
};

export default function Show({ post }) {
    const { auth = {} } = usePage().props;
    const fallbackImage = '/blog-featured-images/default.svg';
    const postImages = Array.isArray(post?.featured_images) && post.featured_images.length > 0
        ? post.featured_images
        : [post?.featured_image || fallbackImage];
    const galleryImages = postImages.slice(0, 9);
    const hiddenImageCount = Math.max(postImages.length - galleryImages.length, 0);
    const isAdmin = auth.user?.role === 'admin';
    const [activeImage, setActiveImage] = useState(null);

    const handleDelete = () => {
        if (!window.confirm(`Delete "${post.title}" permanently?`)) {
            return;
        }

        router.delete(`/admin/blog/${post.slug}`);
    };

    return (
        <>
            {/* Flash Messages */}
            <div className="px-4 py-4">
                <div className="mx-auto max-w-4xl">
                    <FlashBanner />
                </div>
            </div>

            {/* Article Content */}
            <main className="px-4 py-8 sm:py-12">
                <article className="mx-auto w-full max-w-4xl">
                    {/* Article Header */}
                    <div className="mb-8 space-y-4">
                        <div className="flex flex-wrap gap-2 items-center">
                            <div className="badge badge-primary font-bold">{post.week}</div>
                            <div className="badge badge-outline">{post.task}</div>
                            <div className="text-sm text-base-content/60 font-medium">{post.date || 'No date'}</div>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-base-content leading-tight">
                            {post.title}
                        </h1>
                        <p className="text-lg text-base-content/70 leading-relaxed">
                            A detailed article about week {post.week}, covering {post.task}
                        </p>
                    </div>

                    {/* Article Body */}
                    <div className="prose max-w-none mb-12">
                        <div className="card bg-base-100 border border-base-300 shadow-md p-8">
                            <div className="whitespace-pre-wrap text-base-content/90 leading-relaxed text-lg">
                                {post.content}
                            </div>
                        </div>
                    </div>

                    {/* Gallery */}
                    {galleryImages.length > 0 && (
                        <div className="mb-12">
                            <div className={galleryGridClass(galleryImages.length)}>
                                {galleryImages.map((image, index) => (
                                    <figure
                                        key={`${image}-${index}`}
                                        className={`group relative cursor-pointer ${galleryImages.length === 1 ? '' : 'aspect-square'}`}
                                    >
                                        <div className="card h-full w-full overflow-hidden border border-base-300 bg-base-200 shadow-sm hover:shadow-md transition-shadow">
                                            <button
                                                type="button"
                                                className={`relative flex h-full w-full items-center justify-center ${galleryImages.length === 1 ? 'max-h-[70vh]' : ''}`}
                                                onClick={() => setActiveImage(image)}
                                            >
                                                <img
                                                    className={`${galleryImages.length === 1 ? 'h-auto max-h-[70vh]' : 'h-full'} w-full object-contain object-center transition-transform duration-200 group-hover:scale-105`}
                                                    src={image}
                                                    alt={`${post.title} image ${index + 1}`}
                                                    onError={(event) => {
                                                        event.currentTarget.src = fallbackImage;
                                                    }}
                                                />
                                                {hiddenImageCount > 0 && index === galleryImages.length - 1 ? (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/55 text-sm font-semibold text-white">
                                                        +{hiddenImageCount} more
                                                    </div>
                                                ) : null}
                                            </button>
                                        </div>
                                    </figure>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Article Footer with Actions */}
                    <div className="border-t border-base-300 pt-8">
                        <div className="flex flex-wrap gap-4 items-center justify-between">
                            <Link href="/blog" className="btn btn-outline btn-lg font-semibold">
                                ← Back to Blog
                            </Link>
                            {isAdmin && (
                                <div className="flex gap-3">
                                    <Link 
                                        href={`/admin/blog/${post.slug}/edit`} 
                                        className="btn btn-outline font-semibold"
                                    >
                                        Edit Article
                                    </Link>
                                    <button 
                                        type="button" 
                                        className="btn btn-error font-semibold" 
                                        onClick={handleDelete}
                                    >
                                        Delete Article
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </article>
            </main>

            {/* Footer */}
            <footer className="bg-base-200 border-t border-base-300 py-8 mt-12">
                <div className="mx-auto max-w-7xl px-4 text-center text-base-content/70">
                    <p className="font-medium">© 2024 Weekly Blog. All rights reserved.</p>
                </div>
            </footer>

            <ImageLightbox src={activeImage} alt={post.title} onClose={() => setActiveImage(null)} />
        </>
    );
}
