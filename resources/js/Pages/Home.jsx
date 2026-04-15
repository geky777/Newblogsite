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
            <div className="p-4">
                <div className="mx-auto mb-4 flex w-full max-w-7xl flex-col gap-4">
                    <FlashBanner />
                </div>

                <div className="card mx-auto w-full max-w-7xl items-stretch border border-base-300 bg-base-100 shadow-sm transition lg:card-side">
                    <div className="card-body">
                        <h1 className="text-4xl font-black leading-tight md:text-6xl">
                            Hi, Iam{' '}
                            <span className="text-primary italic">Lord Zaro Fiber A. Quintanilla</span>, Welcome To my
                            Weekly Blog Site
                        </h1>

                        <p className="max-w-xl text-base-content/70">
                            I document my learning journey every week - from class projects to personal builds. This is
                            where I share what I&apos;m making, reading, and figuring out.
                        </p>

                        <div className="card-actions justify-start gap-3 pt-2">
                            <button className="btn btn-neutral rounded-full">Get to Know Me</button>
                            <Link href="/blog" className="btn btn-outline rounded-full">
                                Read My Blog
                            </Link>
                            {isAdmin ? (
                                <Link href="/admin/blog/create" className="btn btn-primary rounded-full">
                                    Add Blog
                                </Link>
                            ) : null}
                        </div>
                    </div>

                    <figure className="flex items-center justify-end p-4 lg:w-5/12 lg:p-6">
                        <div className="hover-3d h-64 w-full max-w-md translate-x-2 sm:h-74 lg:h-74 lg:translate-x-4">
                            <div className="hover-3d-zone"></div>
                            <div className="hover-3d-zone"></div>
                            <div className="hover-3d-zone"></div>
                            <div className="hover-3d-zone"></div>
                            <div className="hover-3d-zone"></div>
                            <div className="hover-3d-zone"></div>
                            <div className="hover-3d-zone"></div>
                            <div className="hover-3d-zone"></div>
                            <div className="hover-3d-target h-full overflow-hidden rounded-2xl">
                                <img
                                    className="h-full w-full object-cover"
                                    src="https://img.daisyui.com/images/stock/creditcard.webp"
                                    alt="3D card"
                                />
                            </div>
                        </div>
                    </figure>
                </div>
            </div>

            <div className="px-4 pb-10">
                <div className="flex items-center gap-4 py-6">
                    <div className="text-xs font-semibold tracking-widest text-base-content/60">MY BLOGS</div>
                    <div className="h-px flex-1 bg-base-300"></div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {recentPosts.map((post) => (
                        <article
                            key={post.id}
                            className="card overflow-hidden border border-base-300 bg-base-100 shadow-sm"
                        >
                            <Link href={`/blog/${post.slug}`} className="block">
                                <figure className="relative h-56 sm:h-64">
                                    <img
                                        className="h-full w-full object-cover"
                                        src={post.featured_image || fallbackImage}
                                        alt={post.title}
                                    />
                                    <div className="absolute left-4 top-4 badge badge-secondary">{post.week}</div>
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-black/0 p-4">
                                        <div className="text-xs text-white/80">{post.date || ''}</div>
                                        <div className="mt-1 text-lg font-bold leading-snug text-white sm:text-xl">
                                            {post.title}
                                        </div>
                                    </div>
                                </figure>
                            </Link>

                            {isAdmin ? (
                                <div className="card-body pt-4">
                                    <div className="card-actions justify-end">
                                        <Link href={`/admin/blog/${post.slug}/edit`} className="btn btn-outline btn-sm">
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
                                </div>
                            ) : null}
                        </article>
                    ))}
                </div>
            </div>
        </>
    );
}
