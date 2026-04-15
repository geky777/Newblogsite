import React from 'react';
import { Link, useForm } from '@inertiajs/react';

const normalizeDate = (value) => {
    if (typeof value !== 'string') return '';

    return value.slice(0, 10);
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
        featured_image: null,
        ...(submitMethod === 'put' ? { _method: 'put' } : {}),
    });

    const selectedFileName = data.featured_image?.name ?? '';

    const handleSubmit = (event) => {
        event.preventDefault();
        sendPost(submitUrl, { forceFormData: true });
    };

    return (
        <div className="create-post-body">
            <div className="create-post-page">
                <header className="create-post-header">
                    <h1 className="create-post-title">
                        {formTitle}
                        <br />
                        <span>{formAccent}</span>
                    </h1>
                    <Link href="/admin/blog" className="create-post-back">
                        Back to Admin
                    </Link>
                </header>

                <div className="create-post-card">
                    <form onSubmit={handleSubmit}>
                        <p className="create-post-section-label">Post Details</p>

                        <div className="create-post-field">
                            <label htmlFor="title">Title</label>
                            <input
                                id="title"
                                type="text"
                                placeholder="Enter an engaging post title..."
                                value={data.title}
                                onChange={(event) => setData('title', event.target.value)}
                            />
                            {errors.title ? <div className="mt-1 text-sm text-error">{errors.title}</div> : null}
                        </div>

                        <div className="create-post-fields-row">
                            <div className="create-post-field">
                                <label htmlFor="task">Task</label>
                                <input
                                    id="task"
                                    type="text"
                                    placeholder="e.g. Research, Writing..."
                                    value={data.task}
                                    onChange={(event) => setData('task', event.target.value)}
                                />
                                {errors.task ? <div className="mt-1 text-sm text-error">{errors.task}</div> : null}
                            </div>

                            <div className="create-post-field">
                                <label htmlFor="week">Week</label>
                                <input
                                    id="week"
                                    type="text"
                                    placeholder="e.g. Week 4"
                                    value={data.week}
                                    onChange={(event) => setData('week', event.target.value)}
                                />
                                {errors.week ? <div className="mt-1 text-sm text-error">{errors.week}</div> : null}
                            </div>
                        </div>

                        <div className="create-post-field">
                            <label htmlFor="date">Date</label>
                            <input
                                id="date"
                                type="date"
                                value={data.date}
                                onChange={(event) => setData('date', event.target.value)}
                            />
                            {errors.date ? <div className="mt-1 text-sm text-error">{errors.date}</div> : null}
                        </div>

                        <div className="create-post-separator"></div>
                        <p className="create-post-section-label">Media & Content</p>

                        <div className="create-post-field">
                            <label htmlFor="featured_image">Featured Image</label>

                            {post?.featured_image ? (
                                <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-200">
                                    <img
                                        className="h-56 w-full object-cover"
                                        src={post.featured_image}
                                        alt={post.title}
                                    />
                                </div>
                            ) : null}

                            <div className="create-post-upload-area">
                                <input
                                    id="featured_image"
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    onChange={(event) => setData('featured_image', event.target.files?.[0] ?? null)}
                                />
                                <p>
                                    <strong>Click to upload</strong> a new featured image
                                </p>
                                <p className="create-post-upload-hint">JPG, PNG, or WEBP up to 2MB</p>
                                {selectedFileName ? (
                                    <p className="mt-2 text-sm text-base-content/70">{selectedFileName}</p>
                                ) : null}
                            </div>

                            {errors.featured_image ? (
                                <div className="mt-1 text-sm text-error">{errors.featured_image}</div>
                            ) : null}
                        </div>

                        <div className="create-post-field">
                            <label htmlFor="content">Content</label>
                            <textarea
                                id="content"
                                placeholder="Write your post content here... Tell your story."
                                value={data.content}
                                onChange={(event) => setData('content', event.target.value)}
                            />
                            {errors.content ? <div className="mt-1 text-sm text-error">{errors.content}</div> : null}
                        </div>

                        <div className="create-post-actions">
                            <Link href="/admin/blog" className="create-post-btn create-post-btn-ghost">
                                Cancel
                            </Link>
                            <button
                                className="create-post-btn create-post-btn-primary"
                                type="submit"
                                disabled={processing}
                            >
                                {processing ? processingLabel : submitLabel}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
