import React from 'react';
import FlashBanner from '../Components/FlashBanner';

export default function AdminLayout({ title, description, children }) {
    return (
        <div className="min-h-screen bg-base-200">
            <main className="px-4 py-6 sm:px-6 sm:py-8">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
                    {(title || description) ? (
                        <div className="space-y-2">
                            {title ? <h1 className="text-3xl font-bold text-base-content">{title}</h1> : null}
                            {description ? (
                                <p className="max-w-2xl text-sm text-base-content/70">{description}</p>
                            ) : null}
                        </div>
                    ) : null}

                    <FlashBanner />

                    {children}
                </div>
            </main>
        </div>
    );
}
