<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()) {
            return redirect()
                ->route('admin.login')
                ->with('error', 'Please sign in as an admin to continue.');
        }

        if (! $request->user()->isAdmin()) {
            return redirect()
                ->route('blog.index')
                ->with('error', 'You are not authorized to access the admin area.');
        }

        return $next($request);
    }
}
