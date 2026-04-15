import React, { useEffect, useRef, useState } from 'react';
import { Link, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
        task: '',
        week: '',
        date: '',
        featured_image: null,
    });

    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const calendarRef = useRef(null);

    const onSubmit = (e) => {
        e.preventDefault();
        post('/blog', { forceFormData: true });
    };

    useEffect(() => {
        const el = calendarRef.current;
        if (!el) return;

        const handler = (event) => {
            const nextValue =
                event?.detail?.value ??
                event?.target?.value ??
                el?.value ??
                event?.target?.getAttribute?.('value') ??
                '';
            if (typeof nextValue === 'string') {
                setData('date', nextValue);
                setIsCalendarOpen(false);
            }
        };

        el.addEventListener('change', handler);
        el.addEventListener('input', handler);

        return () => {
            el.removeEventListener('change', handler);
            el.removeEventListener('input', handler);
        };
    }, [setData]);

    useEffect(() => {
        const el = calendarRef.current;
        if (!el) return;
        if (typeof data.date !== 'string' || data.date === '') return;
        if (el.value === data.date) return;

        el.value = data.date;
    }, [data.date]);

     return (
        <>
            <div className="create-post-body">
                <div className="create-post-page">
                    <header className="create-post-header">
                        <h1 className="create-post-title">Create<br /><span>Blog Post</span></h1>
                        <Link href="/blog" className="create-post-back">Back to Blog</Link>
                    </header>

                    <div className="create-post-card">
                        <form onSubmit={onSubmit}>
                            <p className="create-post-section-label">Post Details</p>

                            <div className="create-post-field">
                                <label htmlFor="title">Title</label>
                                <input
                                    id="title"
                                    type="text"
                                    placeholder="Enter an engaging post title…"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                />
                                {errors.title ? <div className="text-error text-sm mt-1">{errors.title}</div> : null}
                            </div>

                            <div className="create-post-fields-row">
                                <div className="create-post-field">
                                    <label htmlFor="task">Task</label>
                                    <input
                                        id="task"
                                        type="text"
                                        placeholder="e.g. Research, Writing…"
                                        value={data.task}
                                        onChange={(e) => setData('task', e.target.value)}
                                    />
                                    {errors.task ? <div className="text-error text-sm mt-1">{errors.task}</div> : null}
                                </div>
                                <div className="create-post-field">
                                    <label htmlFor="week">Week</label>
                                    <input
                                        id="week"
                                        type="text"
                                        placeholder="e.g. Week 4"
                                        value={data.week}
                                        onChange={(e) => setData('week', e.target.value)}
                                    />
                                    {errors.week ? <div className="text-error text-sm mt-1">{errors.week}</div> : null}
                                </div>
                            </div>

                            <div className="create-post-field">
                                <label htmlFor="date">Date</label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        className="w-full text-left flex items-center justify-between"
                                        onClick={() => setIsCalendarOpen((v) => !v)}>
                                        <span className={data.date ? '' : 'text-base-content/50'}>
                                            {data.date || 'Select a date'}
                                        </span>
                                        <span className="text-base-content/60">▾</span>
                                    </button>

                                    {isCalendarOpen ? (
                                        <div className="absolute z-50 mt-2">
                                            <calendar-date ref={calendarRef} class="cally bg-base-100 border border-base-300 shadow-lg rounded-box">
                                                <svg aria-label="Previous" className="fill-current size-4" slot="previous" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                    <path fill="currentColor" d="M15.75 19.5 8.25 12l7.5-7.5"></path>
                                                </svg>
                                                <svg aria-label="Next" className="fill-current size-4" slot="next" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                    <path fill="currentColor" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
                                                </svg>
                                                <calendar-month></calendar-month>
                                            </calendar-date>
                                        </div>
                                    ) : null}
                                </div>
                                {errors.date ? <div className="text-error text-sm mt-1">{errors.date}</div> : null}
                            </div>

                            <div className="create-post-separator"></div>
                            <p className="create-post-section-label">Media & Content</p>

                            <div className="create-post-field">
                                <label>Upload Images</label>
                                <div className="create-post-upload-area">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setData('featured_image', e.target.files?.[0] ?? null)}
                                    />
                                    <div className="create-post-upload-icon">📷</div>
                                    <p><strong>Click to upload</strong> or drag & drop</p>
                                    <p className="create-post-upload-hint">PNG, JPG, GIF up to 10MB each</p>
                                </div>
                                {errors.featured_image ? (
                                    <div className="text-error text-sm mt-1">{errors.featured_image}</div>
                                ) : null}
                            </div>

                            <div className="create-post-field">
                                <label htmlFor="content">Content</label>
                                <textarea
                                    id="content"
                                    placeholder="Write your post content here… Tell your story."
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                />
                                {errors.content ? <div className="text-error text-sm mt-1">{errors.content}</div> : null}
                            </div>

                            <div className="create-post-actions">
                                <Link href="/blog" className="create-post-btn create-post-btn-ghost">Cancel</Link>
                                <button className="create-post-btn create-post-btn-primary" type="submit" disabled={processing}>
                                    <span className="icon">✦</span> {processing ? 'Publishing...' : 'Publish Post'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
