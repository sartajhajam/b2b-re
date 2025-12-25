'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/Button';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Toast } from '@/components/ui/Toast';
import { OrderSuccessModal } from '@/components/orders/OrderSuccessModal';

export default function CartPage() {
    const { items, removeItem, updateQuantity, clearCart } = useCartStore();
    const { user } = useAuth();
    const [mounted, setMounted] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Toast State
    const [toastState, setToastState] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
        message: '',
        type: 'info',
        isVisible: false
    });

    const [productDetails, setProductDetails] = useState<Record<string, { moq: number, price: number }>>({});
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Fetch fresh product details to get updated MOQs
    useEffect(() => {
        const fetchProductDetails = async () => {
            if (items.length === 0) return;

            const productIds = Array.from(new Set(items.map(i => i.productId)));
            setIsLoadingDetails(true);

            try {
                const response = await fetch(`/api/products?ids=${productIds.join(',')}`);
                if (response.ok) {
                    const data = await response.json();
                    // API returns { products: [], metadata: {} } or potentially just [] in some generic handlers,
                    // but looking at route.ts it returns { products, metadata }
                    const productsList = data.products || (Array.isArray(data) ? data : []);

                    const details: Record<string, { moq: number, price: number }> = {};
                    productsList.forEach((p: any) => {
                        details[p.id] = { moq: p.moq, price: p.price };
                    });
                    setProductDetails(details);
                }
            } catch (error) {
                console.error('Failed to fetch product details', error);
            } finally {
                setIsLoadingDetails(false);
            }
        };

        if (items.length > 0) {
            fetchProductDetails();
        }
    }, [items.length]); // Re-fetch if number of items changes

    const [isSubmitting, setIsSubmitting] = useState(false);

    const calculateTotal = () => {
        return items.reduce((total, item) => total + (item.price || 0) * item.quantity, 0);
    };

    const [error, setError] = useState<string | null>(null);

    const handleCheckout = async () => {
        if (!user) return; // Should not happen if button is hidden/disabled
        setError(null);

        // Validate quantities before submitting
        const invalidItems = items.filter(item => {
            const freshMoq = productDetails[item.productId]?.moq || item.moq || 30;
            return item.quantity < freshMoq;
        });
        if (invalidItems.length > 0) {
            const itemNames = invalidItems.map(i => {
                const freshMoq = productDetails[i.productId]?.moq || i.moq || 30;
                return `${i.name} (Min: ${freshMoq})`;
            }).join(', ');

            setToastState({
                message: `Please request minimum order quantity for: ${itemNames}`,
                type: 'error',
                isVisible: true
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: items.map(item => ({
                        product_id: item.productId,
                        quantity: item.quantity
                    }))
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to submit order');
            }

            // Success
            clearCart();
            setShowSuccessModal(true);
        } catch (error: any) {
            // Log as warning since it's likely a validation error, not a system crash
            console.warn('Checkout validation failed:', error.message);

            setToastState({
                message: error.message,
                type: 'error',
                isVisible: true
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!mounted) return null;

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Navbar />
            <main className="flex-grow">
                {/* ... (existing JSX) ... */}
                <div className="bg-surface border-b border-border">
                    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-serif font-bold tracking-tight text-primary">Your Order List</h1>
                        <p className="mt-2 text-text-muted">Review your selected items before requesting a formal quote.</p>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    {items.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-lg">
                            <div className="mx-auto h-24 w-24 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                                <ShoppingBag className="h-12 w-12 text-indigo-600" />
                            </div>
                            <h3 className="mt-2 text-xl font-semibold text-gray-900">Your cart is empty</h3>
                            <p className="mt-2 text-gray-500 max-w-sm mx-auto">Looks like you haven't added any items to the cart yet. Explore our collections to find the perfect products.</p>
                            <div className="mt-8">
                                <Link href="/catalog">
                                    <Button variant="primary" className="cursor-pointer px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all">
                                        Browse Collections
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                            <section className="lg:col-span-7">
                                <ul className="divide-y divide-gray-200 border-t border-b border-gray-200">
                                    {items.map((item) => (
                                        <li key={item.id} className="flex py-6 sm:py-10">
                                            {/* ... (item details) ... */}
                                            <div className="flex-shrink-0 relative h-24 w-24 sm:h-32 sm:w-32 rounded-md overflow-hidden bg-gray-100">
                                                {/* Use Next.js Image for better performance if possible, or keep standard img but valid */}
                                                <img
                                                    src={item.image || '/placeholder.jpg'}
                                                    alt={item.name}
                                                    className="h-full w-full object-cover object-center"
                                                />
                                            </div>

                                            <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                                                <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                                    <div>
                                                        <div className="flex justify-between">
                                                            <h3 className="text-sm">
                                                                <Link href={`/product/${item.productId}`} className="font-medium text-gray-700 hover:text-gray-800">
                                                                    {item.name}
                                                                </Link>
                                                            </h3>
                                                        </div>
                                                        <div className="mt-1 flex text-sm">
                                                            <p className="text-gray-500">{item.color}</p>
                                                            {item.size && (
                                                                <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">{item.size}</p>
                                                            )}
                                                        </div>
                                                        <p className="mt-1 text-sm font-medium text-gray-900">€{item.price?.toFixed(2)}</p>
                                                    </div>

                                                    <div className="mt-4 sm:mt-0 sm:pr-9">
                                                        <label htmlFor={`quantity-${item.id}`} className="sr-only">
                                                            Quantity, {item.name}
                                                        </label>
                                                        <select
                                                            id={`quantity-${item.id}`}
                                                            name={`quantity-${item.id}`}
                                                            className="max-w-full rounded-md border border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                                                            value={item.quantity}
                                                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                                        >
                                                            {(() => {
                                                                const moq = productDetails[item.productId]?.moq || item.moq || 1; // Default to 1 if no MOQ found (though usually we have it)
                                                                const options = new Set<number>([item.quantity]);

                                                                // Use user Request: MOQ, MOQ+1... up to 100
                                                                // If MOQ is higher than 100, we should at least show some options above MOQ
                                                                const maxOption = Math.max(100, moq + 20);

                                                                for (let i = moq; i <= maxOption; i++) {
                                                                    options.add(i);
                                                                }

                                                                return Array.from(options)
                                                                    .sort((a, b) => a - b)
                                                                    .map(q => (
                                                                        <option key={q} value={q}>{q}</option>
                                                                    ));
                                                            })()}
                                                        </select>

                                                        <div className="absolute top-0 right-0">
                                                            <button
                                                                type="button"
                                                                className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500 cursor-pointer"
                                                                onClick={() => removeItem(item.id)}
                                                            >
                                                                <span className="sr-only">Remove</span>
                                                                <Trash2 className="h-5 w-5" aria-hidden="true" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <section className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
                                <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>

                                <dl className="mt-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <dt className="text-sm text-gray-600">Total Items</dt>
                                        <dd className="text-sm font-medium text-gray-900">{items.reduce((acc, i) => acc + i.quantity, 0)}</dd>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                        <dt className="text-base font-medium text-gray-900">Estimated Total</dt>
                                        <dd className="text-base font-medium text-gray-900">€{calculateTotal().toFixed(2)}</dd>
                                    </div>
                                    <p className="text-xs text-text-muted mt-2">
                                        * Final costs including shipping and bulk discounts will be calculated in the formal quote.
                                    </p>
                                </dl>

                                <div className="mt-6">
                                    {/* Inline error removed in favor of Toast, but keeping conditional rendering clean */}
                                    {user ? (
                                        <Button
                                            className="w-full cursor-pointer"
                                            size="lg"
                                            onClick={handleCheckout}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Processing...' : 'Request Formal Quote'}
                                        </Button>
                                    ) : (
                                        <Link href="/auth/login">
                                            <Button className="w-full" size="lg" variant="outline">
                                                Login to Request Quote
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </section>
                        </div>
                    )}
                </div>
            </main>
            <Footer />

            <OrderSuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
            />

            <Toast
                message={toastState.message}
                type={toastState.type}
                isVisible={toastState.isVisible}
                onClose={() => setToastState(prev => ({ ...prev, isVisible: false }))}
            />
        </div>
    );
};
