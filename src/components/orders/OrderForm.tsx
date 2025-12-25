'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/store/cartStore';
import { ShoppingBag, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { AddToCartModal } from './AddToCartModal';

interface OrderFormProps {
    product: {
        id: string;
        name: string;
        price: number;
        productType: string;
        image: string;
        moq?: number;
        specification?: string;
    };
}

export const OrderForm = ({ product }: OrderFormProps) => {
    const { addItem } = useCartStore();
    const { user, isLoading } = useAuth();

    // Form state
    const [quantity, setQuantity] = useState(product.moq || 30);
    const [color, setColor] = useState('Standard');
    const [size, setSize] = useState('Free Size');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleAddToOrder = () => {
        if (!user) return; // Guard

        addItem({
            id: `${product.id}-${color}-${size}`,
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.image,
            color: color,
            size: size,
            moq: product.moq || 30
        });
        setShowSuccessModal(true);
    };

    if (isLoading) {
        return <div className="p-6 bg-surface rounded-lg shadow-sm border border-border animate-pulse h-64"></div>;
    }

    if (!user) {
        return (
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-center">
                <Lock className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <h3 className="text-lg font-medium text-gray-900">Partner Exclusive Pricing</h3>
                <p className="mt-2 text-sm text-gray-500 mb-4">
                    Please sign in with your verified partner account to view wholesale pricing and place orders.
                </p>
                <Link href="/auth/login">
                    <Button variant="primary" className="w-full">Sign In to View Price</Button>
                </Link>
                <p className="mt-3 text-xs text-gray-500">
                    Don't have an account? <Link href="/auth/signup" className="text-primary underline">Apply here</Link>
                </p>
            </div>
        );
    }

    // Authenticated View
    return (
        <div className="bg-surface p-6 rounded-lg shadow-sm border border-border">
            <div className="mb-6">
                <p className="text-3xl font-bold text-primary">€{product.price.toFixed(2)}</p>
                <p className="text-sm text-text-muted">/ piece (Excl. VAT)</p>
                <p className="text-xs text-accent mt-1">MOQ: {product.moq || 30} pieces</p>
            </div>

            <div className="space-y-4">
                {/* Default Color/Size selectors for now as DB doesn't have variants yet */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Specification</label>
                    <p className="text-sm text-gray-500 mt-1">{product.specification || 'Standard / Free Size'}</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                    <input
                        type="number"
                        min={product.moq || 30}
                        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                </div>

                <Button className="w-full mt-4" size="lg" onClick={handleAddToOrder}>
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Add to Order List
                </Button>
            </div>
            <AddToCartModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} />
        </div>
    );
};
