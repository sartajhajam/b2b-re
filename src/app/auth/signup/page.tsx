'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // State for form
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company_name: '',
        password: '',
        country: '',
        phone: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Signup failed');
            }

            // Auto-login
            login(data.user);
            // Redirect is handled in login() but fallback:
            router.push('/');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <Navbar />
            <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-lg space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100 relative overflow-hidden">
                    {/* Decorative Header Accent */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-accent"></div>

                    <div>
                        <h2 className="mt-2 text-center text-3xl font-extrabold tracking-tight text-gray-900">
                            Apply for a Partner Account
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Join our exclusive network of wholesale buyers
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm animate-pulse">
                            {error}
                        </div>
                    )}

                    <form className="mt-8 space-y-5" onSubmit={handleSignup}>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                                <input
                                    name="company_name"
                                    type="text"
                                    required
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-colors cursor-text border"
                                    placeholder="Your Business Name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Contact Person Name</label>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-colors cursor-text border"
                                    placeholder="Full Name"
                                />
                            </div>
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-colors cursor-text border"
                                        placeholder="name@company.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                    <input
                                        name="phone"
                                        type="tel"
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-colors cursor-text border"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Country</label>
                                <input
                                    name="country"
                                    type="text"
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-colors cursor-text border"
                                    placeholder="e.g. United States"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-colors cursor-text border"
                                    placeholder="Create a secure password"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer transition-all duration-300"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creating Account...' : 'Submit Application'}
                            </Button>
                        </div>

                        <div className="text-center mt-4">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link href="/auth/login" className="font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer">
                                    Log in here
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
}
