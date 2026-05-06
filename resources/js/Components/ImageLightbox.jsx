import React, { useEffect } from 'react';

export default function ImageLightbox({ src, alt = 'Full size image', onClose }) {
    useEffect(() => {
        if (!src) {
            return undefined;
        }

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose?.();
            }
        };

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = originalOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [src, onClose]);

    if (!src) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 sm:p-8"
            role="dialog"
            aria-modal="true"
            onClick={onClose}
        >
            <button
                type="button"
                className="btn btn-sm btn-circle btn-neutral absolute right-3 top-3 sm:right-6 sm:top-6"
                aria-label="Close image preview"
                onClick={onClose}
            >
                x
            </button>
            <div className="max-h-full max-w-full" onClick={(event) => event.stopPropagation()}>
                <img className="max-h-[90vh] max-w-[95vw] rounded-xl object-contain" src={src} alt={alt} />
            </div>
        </div>
    );
}
