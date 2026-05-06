import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import FlashBanner from '../../../Components/FlashBanner';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        post('/admin/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-100 flex flex-col">
            {/* Logo Header */}
            <header className="pt-6 px-4">
                <Link href="/" className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-primary-content font-bold text-lg">W</span>
                    </div>
                    <span className="font-bold text-lg text-base-content">Weekly Blog</span>
                </Link>
            </header>

            {/* Login Container */}
            <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
                <div className="w-full max-w-md space-y-6">
                    {/* Title Section */}
                    <div className="space-y-3 text-center">
                        <div className="inline-block mb-2">
                            <div className="badge badge-primary badge-lg font-semibold">Admin Access</div>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-base-content">
                            Welcome Back
                        </h1>
                        <p className="text-base-content/70 text-sm sm:text-base max-w-sm mx-auto">
                            Sign in to your admin account to manage your blog posts and content.
                        </p>
                    </div>

                    {/* Flash Messages */}
                    <FlashBanner />

                    {/* Login Card */}
                    <div className="card border border-base-300 bg-base-100 shadow-xl">
                        <div className="card-body gap-6">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Email Field */}
                                <div className="form-control gap-2">
                                    <label className="label" htmlFor="email">
                                        <span className="label-text font-semibold text-base">Email Address</span>
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        className={`input input-bordered input-lg font-medium ${
                                            errors.email ? 'input-error' : 'focus:input-primary'
                                        }`}
                                        placeholder="admin@example.com"
                                        value={data.email}
                                        onChange={(event) => setData('email', event.target.value)}
                                        disabled={processing}
                                    />
                                    {errors.email ? (
                                        <p className="text-sm text-error font-medium">
                                            <span className="inline-block mr-1">⚠</span>
                                            {errors.email}
                                        </p>
                                    ) : null}
                                </div>

                                {/* Password Field */}
                                <div className="form-control gap-2">
                                    <label className="label" htmlFor="password">
                                        <span className="label-text font-semibold text-base">Password</span>
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        className={`input input-bordered input-lg font-medium ${
                                            errors.password ? 'input-error' : 'focus:input-primary'
                                        }`}
                                        placeholder="••••••••"
                                        value={data.password}
                                        onChange={(event) => setData('password', event.target.value)}
                                        disabled={processing}
                                    />
                                    {errors.password ? (
                                        <p className="text-sm text-error font-medium">
                                            <span className="inline-block mr-1">⚠</span>
                                            {errors.password}
                                        </p>
                                    ) : null}
                                </div>

                                {/* Submit Button */}
                                <button
                                    className="btn btn-primary btn-lg w-full font-semibold mt-6"
                                    type="submit"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>
                                            Signing in...
                                        </>
                                    ) : (
                                        'Sign In'
                                    )}
                                </button>
                            </form>

                            {/* Footer Link */}
                            <div className="divider my-2"></div>
                            <div className="text-center">
                                <p className="text-sm text-base-content/70">
                                    <Link href="/" className="link link-primary font-semibold hover:link-secondary">
                                        Back to Home
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Security Info */}
                    <div className="alert alert-info shadow-md border border-info/30">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span className="text-sm">
                            Only authorized administrators can access this area. Keep your credentials secure.
                        </span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-base-300 py-6 px-4 text-center text-base-content/60 text-sm">
                <p>© 2024 Weekly Blog. All rights reserved.</p>
            </footer>
        </div>
    );
}
