import React from 'react';
import { usePage } from '@inertiajs/react';

export default function FlashBanner() {
    const { flash = {} } = usePage().props;

    const messages = [
        { key: 'success', value: flash.success, className: 'alert-success', icon: '✓' },
        { key: 'error', value: flash.error, className: 'alert-error', icon: '✕' },
    ].filter((message) => Boolean(message.value));

    if (messages.length === 0) {
        return null;
    }

    return (
        <div className="space-y-2">
            {messages.map((message) => (
                <div
                    key={message.key}
                    className={`alert ${message.className} shadow-md border-l-4 rounded-lg flex items-start gap-4`}
                >
                    <span className="text-xl font-bold flex-shrink-0">{message.icon}</span>
                    <span className="text-sm sm:text-base font-medium">{message.value}</span>
                </div>
            ))}
        </div>
    );
}
