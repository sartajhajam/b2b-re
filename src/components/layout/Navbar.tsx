'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Search, ShoppingBag, Menu, X } from 'lucide-react'; // Removing User icon import
import { useCartStore } from '@/store/cartStore';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import { SearchBar } from '@/components/ui/SearchBar';

export const Navbar = () => {
    const cartItemsCount = useCartStore((state) => state.totalItems());
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    return (
        <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">
                    <div className="flex items-center">
                        {/* Mobile Menu Trigger */}
                        <div className="md:hidden mr-4" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? (
                                <X className="h-7 w-7 text-primary cursor-pointer hover:text-accent transition-colors" />
                            ) : (
                                <Menu className="h-7 w-7 text-primary cursor-pointer hover:text-accent transition-colors" />
                            )}
                        </div>

                        <Link href="/" className="group flex items-center gap-3">
                            <div className="h-11 w-11 bg-primary text-accent flex items-center justify-center font-serif text-2xl font-bold rounded-sm shadow-md transition-all duration-300 group-hover:scale-105 group-hover:rotate-3 group-hover:shadow-accent/40 group-hover:bg-accent group-hover:text-primary">
                                RE
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-2xl font-serif font-bold text-primary tracking-tight group-hover:text-accent transition-colors duration-300 leading-none">Ramba Exports</span>
                                <span className="text-sm font-cute text-accent mt-1 tracking-wide group-hover:text-primary transition-colors duration-300">Lifestyle & Fashion</span>
                            </div>
                        </Link>

                        <div className="hidden md:ml-12 md:flex md:space-x-2 items-center">
                            <Link
                                href="/"
                                className="px-5 py-2 rounded-md text-base font-medium text-text-muted transition-all duration-300 hover:bg-primary hover:text-accent hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-0.5"
                            >
                                Home
                            </Link>

                            {/* Collections Dropdown */}
                            <div className="relative group">
                                <button
                                    className="flex items-center gap-1 px-5 py-2 rounded-md text-base font-medium text-text-muted transition-all duration-300 hover:bg-primary hover:text-accent hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-0.5 cursor-pointer"
                                    onClick={() => window.location.href = '/catalog'}
                                >
                                    Collections
                                    <svg className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Dropdown Menu */}
                                <div className="absolute left-0 mt-0 w-56 rounded-md shadow-xl bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left z-50 overflow-hidden">
                                    <div className="py-2">
                                        {[
                                            'Shawls', 'Stoles', 'Mufflers', 'Rumala',
                                            'Dresses', 'Kimonos', 'Capes', 'Kaftans', 'Scarfs'
                                        ].map((item) => (
                                            <Link
                                                key={item}
                                                href={`/catalog/${item.toLowerCase()}`}
                                                className="block px-4 py-3 text-sm text-gray-700 hover:bg-primary hover:text-accent transition-colors border-b border-gray-50 last:border-0"
                                            >
                                                {item}
                                            </Link>
                                        ))}
                                        <Link
                                            href="/catalog"
                                            className="block px-4 py-3 text-sm font-semibold text-primary bg-gray-50 hover:bg-primary hover:text-accent transition-colors"
                                        >
                                            View All Collections
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <Link
                                href="/custom-orders"
                                className="px-5 py-2 rounded-md text-base font-medium text-text-muted transition-all duration-300 hover:bg-primary hover:text-accent hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-0.5"
                            >
                                Custom Orders
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center space-x-8">
                        {!isAdminPath && (
                            <div className="hidden md:flex items-center space-x-4 text-text-muted">
                                <SearchBar />

                                {/* Cart Icon Desktop */}
                                <Link href="/cart" className="relative group p-2 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-all duration-300">
                                    <ShoppingBag className="h-6 w-6" />
                                    {mounted && cartItemsCount > 0 && (
                                        <span
                                            key={cartItemsCount}
                                            className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform bg-red-500 rounded-full animate-pulse shadow-sm"
                                        >
                                            {cartItemsCount}
                                        </span>
                                    )}
                                </Link>
                            </div>
                        )}

                        {/* Divider */}
                        <div className="hidden md:block h-8 w-px bg-gray-200"></div>

                        <div className="hidden md:flex items-center gap-4">
                            {/* Auth Toggle - Hidden on admin paths */}
                            {!(pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard/admin')) && (
                                <>
                                    {user ? (
                                        <>
                                            {user.role !== 'ADMIN' && (
                                                <Link href="/dashboard/buyer">
                                                    <Button
                                                        variant="ghost"
                                                        size="lg"
                                                        className="hidden md:inline-flex cursor-pointer text-base px-6 hover:text-primary hover:bg-gray-50"
                                                    >
                                                        My Orders
                                                    </Button>
                                                </Link>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="lg"
                                                onClick={() => logout()}
                                                className="hidden md:inline-flex cursor-pointer text-base px-6 hover:text-red-600 hover:bg-red-50"
                                            >
                                                Sign Out
                                            </Button>
                                        </>
                                    ) : (
                                        <Link href="/auth/login">
                                            <Button
                                                variant="ghost"
                                                size="lg"
                                                className="hidden md:inline-flex cursor-pointer text-base px-6 hover:text-primary hover:bg-gray-50"
                                            >
                                                Sign In
                                            </Button>
                                        </Link>
                                    )}

                                    {!user && (
                                        <Link href="/auth/signup">
                                            <Button variant="primary" size="lg" className="hidden md:inline-flex shadow-accent/20 hover:shadow-accent/40 cursor-pointer text-base px-6">
                                                Sign Up
                                            </Button>
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Cart Icon Mobile */}
                        {!isAdminPath && (
                            <Link href="/cart" className="relative md:hidden p-2 rounded-full bg-indigo-50 text-indigo-600">
                                <ShoppingBag className="h-6 w-6" />
                                {mounted && cartItemsCount > 0 && (
                                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full animate-pulse shadow-sm">
                                        {cartItemsCount}
                                    </span>
                                )}
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-200 shadow-xl overflow-y-auto max-h-screen">
                    <div className="px-4 pt-2 pb-6 space-y-4">
                        <div className="mb-4">
                            <SearchBar />
                        </div>

                        <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                            Home
                        </Link>

                        <div className="space-y-1">
                            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Collections</p>
                            {[
                                'Shawls', 'Stoles', 'Mufflers', 'Rumala',
                                'Dresses', 'Kimonos', 'Capes', 'Kaftans', 'Scarfs'
                            ].map((item) => (
                                <Link
                                    key={item}
                                    href={`/catalog/${item.toLowerCase()}`}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-indigo-50 ml-2 border-l-2 border-transparent hover:border-primary transition-colors"
                                >
                                    {item}
                                </Link>
                            ))}
                        </div>

                        <Link href="/custom-orders" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                            Custom Orders
                        </Link>

                        <div className="border-t border-gray-200 pt-4 mt-4">
                            {user ? (
                                <div className="space-y-3 px-3">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <div className="h-8 w-8 rounded-full bg-primary text-accent flex items-center justify-center font-bold">
                                            {user.name?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                    </div>

                                    {user.role !== 'ADMIN' && (
                                        <Link href="/dashboard/buyer" className="block w-full">
                                            <Button variant="outline" className="w-full justify-center">My Orders</Button>
                                        </Link>
                                    )}
                                    <Button
                                        onClick={() => logout()}
                                        variant="outline"
                                        className="w-full justify-center text-red-600 hover:bg-red-50 border-red-200"
                                    >
                                        Sign Out
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3 px-3">
                                    <Link href="/auth/login" className="block w-full">
                                        <Button variant="ghost" className="w-full justify-center border border-gray-300">Sign In</Button>
                                    </Link>
                                    <Link href="/auth/signup" className="block w-full">
                                        <Button variant="primary" className="w-full justify-center shadow-md">Sign Up</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};
