import React from 'react';
import { Link } from '@inertiajs/react';
import FlashBanner from '../Components/FlashBanner';

export default function AdminLayout({ title, description, children }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
            {/* Header Navigation */}
            <header className="sticky top-0 z-40 border-b border-base-300 bg-base-100/95 backdrop-blur-sm shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                                    <span className="text-primary-content font-bold text-lg">W</span>
                                </div>
                                <span className="font-bold text-lg hidden sm:inline text-base-content">Weekly Blog</span>
                            </Link>
                        </div>
                        <nav className="flex items-center gap-2 sm:gap-4">
                            <Link href="/blog" className="link link-hover text-sm sm:text-base font-medium hover:text-primary transition-colors">
                                View Blog
                            </Link>
                            <Link href="/admin/blog" className="link link-hover text-sm sm:text-base font-medium hover:text-primary transition-colors">
                                Dashboard
                            </Link>
                            <form method="post" action="/admin/logout" className="inline">
                                <button type="submit" className="btn btn-sm btn-ghost text-sm sm:text-base">
                                    Logout
                                </button>
                            </form>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
                    {/* Page Header */}
                    {(title || description) ? (
                        <div className="space-y-2 pb-6 border-b border-base-300">
                            {title ? (
                                <h1 className="text-3xl sm:text-4xl font-bold text-base-content tracking-tight">
                                    {title}
                                </h1>
                            ) : null}
                            {description ? (
                                <p className="max-w-2xl text-sm sm:text-base text-base-content/70">
                                    {description}
                                </p>
                            ) : null}
                        </div>
                    ) : null}

                    {/* Flash Messages */}
                    <FlashBanner />

                    {/* Content */}
                    <div className="space-y-6">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
