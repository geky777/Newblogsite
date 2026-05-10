<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" data-theme="cupcake">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <script>
            (() => {
                const storedTheme = localStorage.getItem('weekly-blog-theme');
                const theme = storedTheme === 'sunset' || storedTheme === 'cupcake'
                    ? storedTheme
                    : 'cupcake';

                document.documentElement.dataset.theme = theme;
            })();
        </script>

        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">

        @inertiaHead
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.jsx'])

        <script type="module" src="https://unpkg.com/cally"></script>
    </head>
    <body>
        <header class="sticky top-0 z-50 border-b border-base-300 bg-base-100/95 backdrop-blur-sm shadow-md">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between h-16 sm:h-20">
                    <!-- Logo Section -->
                    <div class="flex items-center gap-3">
                        <a href="/" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <div class="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-md">
                                <span class="text-primary-content font-bold text-lg">W</span>
                            </div>
                            <div class="hidden sm:block">
                                <span class="font-bold text-lg text-base-content block">Weekly Blog</span>
                                <span class="text-xs text-base-content/60 font-medium">Learning Journey</span>
                            </div>
                        </a>
                    </div>

                    <!-- Navigation & Actions -->
                    <div class="flex items-center gap-2 sm:gap-6">
                        <nav class="hidden sm:flex items-center gap-6">
                            <a href="/" class="text-sm font-medium text-base-content/70 hover:text-primary transition-colors">Home</a>
                            <a href="/blog" class="text-sm font-medium @if(request()->routeIs('blog.*')) text-primary @else text-base-content/70 hover:text-primary @endif transition-colors">Blog</a>
                            <a href="#" class="text-sm font-medium text-base-content/70 hover:text-primary transition-colors">Documents</a>
                            <a href="#" class="text-sm font-medium text-base-content/70 hover:text-primary transition-colors">About Me</a>
                        </nav>

                        <!-- Mobile Menu Hamburger -->
                        <div class="sm:hidden">
                            <div class="dropdown dropdown-end">
                                <button class="btn btn-ghost btn-circle">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                                <ul class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 border border-base-300">
                                    <li><a href="/">Home</a></li>
                                    <li><a href="/blog">Blog</a></li>
                                    <li><a href="#">Documents</a></li>
                                    <li><a href="#">About Me</a></li>
                                </ul>
                            </div>
                        </div>

                        <!-- Theme Toggle -->
                        <label class="swap swap-rotate btn btn-ghost btn-circle">
                            <input id="theme-toggle" type="checkbox" class="theme-controller" value="sunset" />
                            <svg class="swap-off h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                            </svg>
                            <svg class="swap-on h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                            </svg>
                        </label>
                    </div>
                </div>
            </div>
        </header>
        @inertia
        <script>
            (() => {
                const themeToggle = document.getElementById('theme-toggle');

                if (! themeToggle) {
                    return;
                }

                const applyTheme = (theme) => {
                    document.documentElement.dataset.theme = theme;
                    localStorage.setItem('weekly-blog-theme', theme);
                    themeToggle.checked = theme === 'sunset';
                };

                applyTheme(document.documentElement.dataset.theme === 'sunset' ? 'sunset' : 'cupcake');

                themeToggle.addEventListener('change', () => {
                    applyTheme(themeToggle.checked ? 'sunset' : 'cupcake');
                });
            })();
        </script>
    </body>
</html>
