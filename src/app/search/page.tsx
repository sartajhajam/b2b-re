'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';
import { Pagination } from '@/components/ui/Pagination';
import { Product } from '@prisma/client';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const query = searchParams.get('search');

    const [products, setProducts] = useState<Product[]>([]);
    const [metadata, setMetadata] = useState({
        total: 0,
        page: 1,
        limit: 12,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false
    });
    const [loading, setLoading] = useState(true);

    const currentPage = Number(searchParams.get('page')) || 1;

    useEffect(() => {
        if (!query) {
            setLoading(false);
            return;
        }

        async function fetchProducts() {
            setLoading(true);
            try {
                const queryParams = new URLSearchParams(searchParams.toString());

                // Ensure page is set from URL or default
                if (!queryParams.has('page')) {
                    queryParams.set('page', '1');
                }

                const res = await fetch(`/api/products?${queryParams.toString()}`);
                if (!res.ok) throw new Error('Failed to fetch products');

                const data = await res.json();

                if (data.products) {
                    setProducts(data.products);
                    setMetadata(data.metadata || { total: 0, page: 1, limit: 12, totalPages: 1 });
                } else if (Array.isArray(data)) {
                    // Fallback
                    setProducts(data);
                } else {
                    setProducts([]);
                }
            } catch (error) {
                console.error(error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, [query, currentPage, searchParams]);

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`${pathname}?${params.toString()}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Navbar />
            <main className="flex-grow">
                {/* Header */}
                <div className="bg-surface border-b border-border">
                    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-3xl font-serif font-bold tracking-tight text-primary">
                            Search Results
                        </h1>
                        <p className="mt-4 text-text-muted max-w-xl mx-auto">
                            {query ? `Showing results for "${query}"` : 'Enter a search term'}
                        </p>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        </div>
                    ) : products.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                                {products.map((product) => {
                                    // Transform Prisma data to match ProductCard props
                                    const cardProduct = {
                                        id: product.id,
                                        name: product.name,
                                        category: product.product_type ? product.product_type.charAt(0) + product.product_type.slice(1).toLowerCase() : 'Product',
                                        materials: product.materials,
                                        price: `€${Number(product.price).toFixed(2)}`,
                                        image: product.images && product.images.length > 0 ? product.images[0] : '',
                                    };
                                    return (
                                        <ProductCard key={product.id} product={cardProduct} isAuthenticated={false} />
                                    );
                                })}
                            </div>

                            {/* Pagination Controls */}
                            <Pagination
                                currentPage={metadata.page}
                                totalPages={metadata.totalPages}
                                onPageChange={handlePageChange}
                            />
                        </>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-lg">
                            <p className="text-text-muted text-lg">
                                {query ? `No products found for "${query}"` : 'Start searching to find products.'}
                            </p>
                            <button
                                onClick={() => router.push('/catalog')}
                                className="mt-4 text-accent hover:text-primary underline"
                            >
                                Browse Full Catalog
                            </button>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
