'use client';

import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface AddToCartModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddToCartModal: React.FC<AddToCartModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center animate-in fade-in zoom-in duration-300">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">Product Added to Cart</h3>

                <p className="text-gray-500 mb-6">
                    We have added the product to your order list. You can continue exploring more products or proceed to cart to request a formal quote.
                </p>

                <div className="space-y-3">
                    <Link href="/cart" className="block w-full">
                        <Button className="w-full" size="lg">
                            Proceed to Cart & Request Quote
                        </Button>
                    </Link>

                    <Button variant="outline" className="w-full" onClick={onClose}>
                        Continue Browsing
                    </Button>
                </div>
            </div>
        </div>
    );
};
