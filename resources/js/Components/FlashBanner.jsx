import React from 'react';
import { usePage } from '@inertiajs/react';

export default function FlashBanner() {
    const { flash = {} } = usePage().props;

    const messages = [
        { key: 'success', value: flash.success, className: 'alert-success' },
        { key: 'error', value: flash.error, className: 'alert-error' },
    ].filter((message) => Boolean(message.value));

    if (messages.length === 0) {
        return null;
    }

    return (
        <div className="space-y-3">
            {messages.map((message) => (
                <div key={message.key} className={`alert ${message.className} shadow-sm`}>
                    <span>{message.value}</span>
                </div>
            ))}
        </div>
    );
}
