'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProductNavigationProps {
    prevProductId?: string | null;
    nextProductId?: string | null;
}

export const ProductNavigation: React.FC<ProductNavigationProps> = ({ prevProductId, nextProductId }) => {
    const router = useRouter();

    // Keyboard navigation support
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft' && prevProductId) {
                router.push(`/product/${prevProductId}`);
            } else if (e.key === 'ArrowRight' && nextProductId) {
                router.push(`/product/${nextProductId}`);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [prevProductId, nextProductId, router]);

    if (!prevProductId && !nextProductId) return null;

    return (
        <>
            {/* Previous Button */}
            {prevProductId && (
                <Link
                    href={`/product/${prevProductId}`}
                    className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white/80 backdrop-blur-md shadow-lg border border-gray-100 text-gray-800 transition-all duration-300 hover:scale-110 hover:bg-accent hover:text-white hover:shadow-accent/30 group"
                    aria-label="Previous Product"
                >
                    <ChevronLeft className="w-6 h-6 transition-transform group-hover:-translate-x-0.5" />
                </Link>
            )}

            {/* Next Button */}
            {nextProductId && (
                <Link
                    href={`/product/${nextProductId}`}
                    className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white/80 backdrop-blur-md shadow-lg border border-gray-100 text-gray-800 transition-all duration-300 hover:scale-110 hover:bg-accent hover:text-white hover:shadow-accent/30 group"
                    aria-label="Next Product"
                >
                    <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-0.5" />
                </Link>
            )}

            {/* Mobile Navigation (Bottom Fixed) - Optional, can be sticky footer or just standard links */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex justify-between px-4 py-3 bg-white/90 backdrop-blur-md border-t border-gray-200">
                <div className="flex-1 text-left">
                    {prevProductId ? (
                        <Link href={`/product/${prevProductId}`} className="flex items-center text-sm font-medium text-gray-600 hover:text-accent p-2">
                            <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                        </Link>
                    ) : <span />}
                </div>
                <div className="w-px bg-gray-200 mx-2 h-full"></div>
                <div className="flex-1 text-right">
                    {nextProductId ? (
                        <Link href={`/product/${nextProductId}`} className="flex items-center justify-end text-sm font-medium text-gray-600 hover:text-accent p-2">
                            Next <ChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                    ) : <span />}
                </div>
            </div>
        </>
    );
};
