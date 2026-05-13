import React from 'react';
import FlashBanner from '../Components/FlashBanner';

export default function AdminLayout({ title, description, children }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
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
