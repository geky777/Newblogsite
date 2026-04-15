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
        <div className="min-h-screen bg-base-200 px-4 py-10">
            <div className="mx-auto flex w-full max-w-md flex-col gap-6">
                <div className="space-y-2 text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-base-content/50">
                        Weekly Blog
                    </p>
                    <h1 className="text-4xl font-black text-base-content">Admin Sign In</h1>
                    <p className="text-sm text-base-content/70">
                        Only the admin account can manage posts. Everyone else stays in view-only mode.
                    </p>
                </div>

                <FlashBanner />

                <div className="card border border-base-300 bg-base-100 shadow-xl">
                    <div className="card-body gap-5">
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="form-control">
                                <label className="label" htmlFor="email">
                                    <span className="label-text">Email</span>
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    className="input input-bordered w-full"
                                    value={data.email}
                                    onChange={(event) => setData('email', event.target.value)}
                                />
                                {errors.email ? <p className="mt-2 text-sm text-error">{errors.email}</p> : null}
                            </div>

                            <div className="form-control">
                                <label className="label" htmlFor="password">
                                    <span className="label-text">Password</span>
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    className="input input-bordered w-full"
                                    value={data.password}
                                    onChange={(event) => setData('password', event.target.value)}
                                />
                                {errors.password ? (
                                    <p className="mt-2 text-sm text-error">{errors.password}</p>
                                ) : null}
                            </div>

                            <button className="btn btn-primary w-full" type="submit" disabled={processing}>
                                {processing ? 'Signing In...' : 'Sign In'}
                            </button>
                        </form>

                        <div className="text-center text-sm text-base-content/60">
                            <Link href="/" className="link link-hover">
                                Back to home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
