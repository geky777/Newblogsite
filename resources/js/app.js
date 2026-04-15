import './bootstrap';

const root = document.getElementById('app');

if (root) {
    root.innerHTML = `
        <main style="min-height: 100vh; display: flex; align-items: center; justify-content: center;">
            <div style="text-align: center;">
                <h1 style="font-size: 48px; font-weight: 700; margin: 0;">BLOG SITE</h1>
                <p style="margin-top: 12px; font-size: 16px; opacity: 0.8;">Welcome to your JavaScript landing page.</p>
            </div>
        </main>
    `;
}
