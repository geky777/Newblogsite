import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import ImageLightbox from './ImageLightbox';

const normalizeDate = (value) => {
    if (typeof value !== 'string') return '';

    return value.slice(0, 10);
};

const galleryGridClass = (imageCount) => {
    if (imageCount <= 1) {
        return 'grid grid-cols-1 gap-3';
    }

    if (imageCount === 2) {
        return 'grid grid-cols-1 sm:grid-cols-2 gap-3';
    }

    return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3';
};

export default function BlogPostForm({
    formTitle,
    formAccent,
    submitLabel,
    processingLabel,
    submitMethod,
    submitUrl,
    post = null,
}) {
    const { data, setData, post: sendPost, processing, errors } = useForm({
        title: post?.title ?? '',
        content: post?.content ?? '',
        task: post?.task ?? '',
        week: post?.week ?? '',
        date: normalizeDate(post?.date ?? ''),
        featured_images: [],
        removed_featured_images: [],
        ...(submitMethod === 'put' ? { _method: 'put' } : {}),
    });

    const selectedFiles = Array.isArray(data.featured_images) ? data.featured_images : [];
    const removedImages = Array.isArray(data.removed_featured_images) ? data.removed_featured_images : [];
    const selectedFileNames = selectedFiles
        .map((file) => file?.name)
        .filter((name) => typeof name === 'string' && name !== '');
    const existingImages = Array.isArray(post?.featured_images) && post.featured_images.length > 0
        ? post.featured_images
        : (post?.featured_image ? [post.featured_image] : []);
    const visibleExistingImages = existingImages.filter((image) => !removedImages.includes(image));
    const featuredImageErrors = [
        errors.featured_images,
        ...Object.entries(errors)
            .filter(([key]) => key.startsWith('featured_images.'))
            .map(([, message]) => message),
    ].filter((message) => typeof message === 'string' && message !== '');
    const [activeImage, setActiveImage] = useState(null);

    const handleSubmit = (event) => {
        event.preventDefault();
        sendPost(submitUrl, { forceFormData: true });
    };

    const removeExistingImage = (image) => {
        if (removedImages.includes(image)) {
            return;
        }

        setData('removed_featured_images', [...removedImages, image]);
    };

    return (
        <div className="space-y-6">
            {/* Form Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-base-300">
                <div className="space-y-2">
                    <h1 className="text-3xl sm:text-4xl font-bold text-base-content">
                        {formTitle} <span className="text-primary">{formAccent}</span>
                    </h1>
                </div>
                <Link href="/admin/blog" className="btn btn-outline btn-lg font-semibold rounded-lg">
                    ← Back to Dashboard
                </Link>
            </div>

            {/* Form */}
            <div className="card border border-base-300 bg-base-100 shadow-md">
                <div className="card-body p-6 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Post Details Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="badge badge-primary font-bold">Step 1</div>
                                <h2 className="text-xl font-bold text-base-content">Post Details</h2>
                            </div>

                            {/* Title Field */}
                            <div className="form-control gap-2">
                                <label className="label" htmlFor="title">
                                    <span className="label-text font-semibold text-base">Post Title</span>
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    className={`input input-bordered input-lg font-medium ${
                                        errors.title ? 'input-error' : 'focus:input-primary'
                                    }`}
                                    placeholder="Enter an engaging post title..."
                                    value={data.title}
                                    onChange={(event) => setData('title', event.target.value)}
                                    disabled={processing}
                                />
                                {errors.title && (
                                    <p className="text-sm text-error font-medium">
                                        <span className="inline-block mr-1">⚠</span>
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            {/* Task and Week Fields */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="form-control gap-2">
                                    <label className="label" htmlFor="task">
                                        <span className="label-text font-semibold text-base">Task</span>
                                    </label>
                                    <input
                                        id="task"
                                        type="text"
                                        className={`input input-bordered input-lg font-medium ${
                                            errors.task ? 'input-error' : 'focus:input-primary'
                                        }`}
                                        placeholder="e.g. Research, Writing, Development..."
                                        value={data.task}
                                        onChange={(event) => setData('task', event.target.value)}
                                        disabled={processing}
                                    />
                                    {errors.task && (
                                        <p className="text-sm text-error font-medium">
                                            <span className="inline-block mr-1">⚠</span>
                                            {errors.task}
                                        </p>
                                    )}
                                </div>

                                <div className="form-control gap-2">
                                    <label className="label" htmlFor="week">
                                        <span className="label-text font-semibold text-base">Week</span>
                                    </label>
                                    <input
                                        id="week"
                                        type="text"
                                        className={`input input-bordered input-lg font-medium ${
                                            errors.week ? 'input-error' : 'focus:input-primary'
                                        }`}
                                        placeholder="e.g. Week 4, Week 5..."
                                        value={data.week}
                                        onChange={(event) => setData('week', event.target.value)}
                                        disabled={processing}
                                    />
                                    {errors.week && (
                                        <p className="text-sm text-error font-medium">
                                            <span className="inline-block mr-1">⚠</span>
                                            {errors.week}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Date Field */}
                            <div className="form-control gap-2">
                                <label className="label" htmlFor="date">
                                    <span className="label-text font-semibold text-base">Publication Date</span>
                                </label>
                                <input
                                    id="date"
                                    type="date"
                                    className={`input input-bordered input-lg font-medium ${
                                        errors.date ? 'input-error' : 'focus:input-primary'
                                    }`}
                                    value={data.date}
                                    onChange={(event) => setData('date', event.target.value)}
                                    disabled={processing}
                                />
                                {errors.date && (
                                    <p className="text-sm text-error font-medium">
                                        <span className="inline-block mr-1">⚠</span>
                                        {errors.date}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="divider my-4"></div>

                        {/* Media & Content Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="badge badge-primary font-bold">Step 2</div>
                                <h2 className="text-xl font-bold text-base-content">Media & Content</h2>
                            </div>

                            {/* Featured Images */}
                            <div className="form-control gap-3">
                                <label className="label" htmlFor="featured_images">
                                    <span className="label-text font-semibold text-base">Featured Images</span>
                                </label>

                                {/* Existing Images Gallery */}
                                {visibleExistingImages.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-sm text-base-content/70 font-medium">Current Images</p>
                                        <div className={galleryGridClass(visibleExistingImages.length)}>
                                            {visibleExistingImages.map((image, index) => (
                                                <figure
                                                    key={`${image}-${index}`}
                                                    className={visibleExistingImages.length === 1 ? 'group aspect-video' : 'group aspect-square'}
                                                >
                                                    <div className="card relative h-full w-full overflow-hidden border border-base-300 bg-base-100 shadow-sm hover:shadow-md transition-shadow">
                                                        <button
                                                            type="button"
                                                            className="block h-full w-full"
                                                            onClick={() => setActiveImage(image)}
                                                        >
                                                            <img
                                                                className="h-full w-full cursor-zoom-in object-cover object-center transition-transform duration-200 group-hover:scale-105"
                                                                src={image}
                                                                alt={`${post?.title ?? 'Post'} ${index + 1}`}
                                                            />
                                                        </button>
                                                        {submitMethod === 'put' ? (
                                                            <button
                                                                type="button"
                                                                className="btn btn-error btn-sm absolute right-2 top-2 z-10"
                                                                onClick={() => removeExistingImage(image)}
                                                                disabled={processing}
                                                            >
                                                                Delete
                                                            </button>
                                                        ) : null}
                                                    </div>
                                                </figure>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Upload Area */}
                                <div className="border-2 border-dashed border-base-300 rounded-xl p-8 text-center bg-base-100/50 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
                                    <label htmlFor="featured_images" className="cursor-pointer block space-y-3">
                                        <div className="text-4xl">🖼️</div>
                                        <div>
                                            <p className="font-bold text-base-content">Click to upload</p>
                                            <p className="text-sm text-base-content/70">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-base-content/60 font-medium">
                                            JPG, PNG, or WEBP up to 2MB each (max 10 files)
                                        </p>
                                    </label>
                                    <input
                                        id="featured_images"
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp"
                                        multiple
                                        className="hidden"
                                        onChange={(event) => setData('featured_images', Array.from(event.target.files ?? []))}
                                        disabled={processing}
                                    />
                                </div>

                                {/* Selected Files */}
                                {selectedFileNames.length > 0 && (
                                    <div className="alert alert-success bg-success/10 border border-success/30">
                                        <span className="text-sm font-medium">
                                            ✓ {selectedFileNames.length} file(s) selected: {selectedFileNames.join(', ')}
                                        </span>
                                    </div>
                                )}

                                {/* Image Errors */}
                                {featuredImageErrors.length > 0 && (
                                    <p className="text-sm text-error font-medium">
                                        <span className="inline-block mr-1">⚠</span>
                                        {featuredImageErrors[0]}
                                    </p>
                                )}
                            </div>

                            {/* Content Field */}
                            <div className="form-control gap-2 pt-4">
                                <label className="label" htmlFor="content">
                                    <span className="label-text font-semibold text-base">Post Content</span>
                                </label>
                                <textarea
                                    id="content"
                                    className={`textarea textarea-bordered textarea-lg font-medium ${
                                        errors.content ? 'textarea-error' : 'focus:textarea-primary'
                                    }`}
                                    placeholder="Write your post content here... Tell your story."
                                    value={data.content}
                                    onChange={(event) => setData('content', event.target.value)}
                                    disabled={processing}
                                    rows="10"
                                />
                                {errors.content && (
                                    <p className="text-sm text-error font-medium">
                                        <span className="inline-block mr-1">⚠</span>
                                        {errors.content}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="divider my-4"></div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-between pt-4">
                            <Link 
                                href="/admin/blog" 
                                className="btn btn-outline btn-lg font-semibold rounded-lg order-2 sm:order-1"
                            >
                                Cancel
                            </Link>
                            <button
                                className="btn btn-primary btn-lg font-semibold rounded-lg order-1 sm:order-2"
                                type="submit"
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        {processingLabel}
                                    </>
                                ) : (
                                    submitLabel
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <ImageLightbox src={activeImage} alt={post?.title ?? 'Post image'} onClose={() => setActiveImage(null)} />
        </div>
    );
}
