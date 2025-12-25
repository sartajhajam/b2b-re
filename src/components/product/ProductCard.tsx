'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Added
import { Lock, ShoppingCart, Check } from 'lucide-react'; // Added ShoppingCart, Check
import { useAuth } from '@/context/AuthContext'; // Added
import { useCartStore } from '@/store/cartStore'; // Added
import { useState } from 'react'; // Added

import { Toast } from '@/components/ui/Toast'; // Added

// Mock type definition
interface Product {
    id: string;
    name: string;
    category: string;
    image: string;
    price?: string;
    materials: string[];
    moq?: number;
}

interface ProductCardProps {
    product: Product;
    isAuthenticated?: boolean; // Kept for compatibility but we'll prioritize hook
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, isAuthenticated: propIsAuthenticated = false }) => {
    const { user } = useAuth();
    const { addItem } = useCartStore();
    const [isAdded, setIsAdded] = useState(false);
    const [showToast, setShowToast] = useState(false); // Added

    // Use hook user if available, otherwise fallback to prop (though hook is source of truth on client)
    const isAuthenticated = !!user || propIsAuthenticated;

    const router = useRouter();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            setShowToast(true);
            return;
        }

        // Parse price from string "€123.45" -> 123.45
        const priceNumber = product.price ? parseFloat(product.price.replace(/[^0-9.]/g, '')) : 0;
        const moq = product.moq || 1;

        addItem({
            id: `${product.id}-${Date.now()}`,
            productId: product.id,
            name: product.name,
            image: product.image,
            price: priceNumber,
            quantity: moq, // Start with MOQ
            moq: moq
        });

        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <div className="group relative flex flex-col h-full bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-transparent hover:border-gray-100">
            <div className="aspect-[4/5] w-full overflow-hidden bg-gray-100 relative">
                <Link href={`/product/${product.id}`} className="block w-full h-full">
                    {product.image ? (
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="h-full w-full bg-gray-50 flex items-center justify-center text-text-muted font-serif italic text-lg group-hover:scale-105 transition-transform duration-700 ease-out">
                            {product.category} Image
                        </div>
                    )}
                </Link>

                {/* Quick Material Badge */}
                {product.materials && product.materials.length > 0 && (
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1 z-10">
                        <span className="inline-flex items-center px-2 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-medium text-primary uppercase tracking-wide rounded-sm shadow-sm">
                            {product.materials[0]}
                        </span>
                    </div>
                )}

                {/* Add to Order List Button - Visible on Hover (Desktop) or Always (Mobile if desired) */}
                <button
                    onClick={handleAddToCart}
                    className={`absolute bottom-4 right-4 z-20 p-5 rounded-full shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer ${isAdded
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-[#FFFDD0] text-black hover:bg-[#F5F5DC]'
                        }`}
                    title={isAuthenticated ? "Add to Order List" : "Login to Add"}
                >
                    {isAdded ? <Check className="h-8 w-8" /> : <ShoppingCart className="h-6 w-6" />}
                </button>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="mb-2">
                    <p className="text-xs text-accent uppercase tracking-widest font-semibold">{product.category}</p>
                </div>
                <h3 className="text-lg font-serif font-bold text-primary mb-2 line-clamp-2">
                    <Link href={`/product/${product.id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                    </Link>
                </h3>

                <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100 relative z-10">
                    {isAuthenticated ? (
                        <div className="flex items-center justify-between w-full">
                            <p className="text-lg font-medium text-primary">{product.price}</p>
                        </div>
                    ) : (
                        <div className="flex items-center text-text-muted group-hover:text-accent transition-colors">
                            <Lock className="h-3 w-3 mr-1.5" />
                            <span className="text-xs font-medium uppercase tracking-wide">Login to view price</span>
                        </div>
                    )}
                </div>
            </div>

            <Toast
                message="You need to be logged in to add items to your cart."
                type="info"
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
};
