'use client';

import { useState, useEffect, use } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductFilter } from '@/components/product/ProductFilter';
import { Pagination } from '@/components/ui/Pagination';
import { Product } from '@/generated/client';
import { notFound } from 'next/navigation';
import { Loader2, Filter as FilterIcon } from 'lucide-react';

// Mapping from URL slug/Display name to Prisma Enum
const CATEGORY_MAP: Record<string, string> = {
    'shawls': 'SHAWL',
    'stoles': 'STOLE',
    'mufflers': 'MUFFLER',
    'rumala': 'RUMALA',
    'dresses': 'DRESS',
    'kimonos': 'KIMONO',
    'capes': 'CAPE',
    'kaftans': 'KAFTAN',
    'scarfs': 'SCARF'
};

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category } = use(params);
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

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
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    const uppercasedCategory = category.charAt(0).toUpperCase() + category.slice(1);
    const apiCategory = CATEGORY_MAP[category.toLowerCase()];

    // Get page from URL or default to 1
    const currentPage = Number(searchParams.get('page')) || 1;

    useEffect(() => {
        if (!apiCategory) return;

        async function fetchProducts() {
            setLoading(true);
            try {
                // Build query string from searchParams
                const queryParams = new URLSearchParams(searchParams.toString());
                queryParams.set('type', apiCategory); // Ensure category is always set

                // Ensure page is set from URL or default
                if (!queryParams.has('page')) {
                    queryParams.set('page', '1');
                }

                const res = await fetch(`/api/products?${queryParams.toString()}`);
                if (!res.ok) throw new Error('Failed to fetch products');

                // Handle new response structure { products, metadata }
                const data = await res.json();

                if (data.products && data.metadata) {
                    setProducts(data.products);
                    setMetadata(data.metadata);
                } else {
                    // Fallback for backward compatibility if API hasn't updated in all envs yet
                    setProducts(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                console.error(error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, [apiCategory, searchParams]);

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`${pathname}?${params.toString()}`);

        // Scroll to top of product grid
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!apiCategory) {
        return notFound();
    }

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Navbar />
            <main className="flex-grow">
                {/* Header */}
                <div className="bg-surface border-b border-border">
                    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl font-serif font-bold tracking-tight text-primary">{uppercasedCategory} Collection</h1>
                        <p className="mt-4 text-text-muted max-w-xl mx-auto">
                            Browse our exclusive collection of {category}.
                        </p>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Desktop Sidebar Filter */}
                        <aside className="hidden lg:block w-64 flex-shrink-0">
                            <div className="sticky top-24">
                                <h2 className="text-lg font-serif font-bold text-primary mb-6 pb-4 border-b border-border">Filters</h2>
                                <ProductFilter category={apiCategory} />
                            </div>
                        </aside>

                        {/* Mobile Filter Toggle */}
                        <div className="lg:hidden mb-6">
                            <button
                                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                                className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-sm text-primary font-medium"
                            >
                                <FilterIcon className="h-4 w-4" />
                                {isMobileFilterOpen ? 'Hide Filters' : 'Show Filters'}
                            </button>

                            {isMobileFilterOpen && (
                                <div className="mt-4 p-4 bg-surface border border-border rounded-sm">
                                    <ProductFilter category={apiCategory} />
                                </div>
                            )}
                        </div>

                        {/* Product Grid */}
                        <div className="flex-1">
                            {loading ? (
                                <div className="flex justify-center py-20">
                                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                                </div>
                            ) : products.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                                        {products.map((product) => {
                                            // Transform Prisma data to match ProductCard props
                                            const cardProduct = {
                                                id: product.id,
                                                name: product.name,
                                                category: product.product_type ? product.product_type.charAt(0) + product.product_type.slice(1).toLowerCase() : category,
                                                materials: product.materials,
                                                price: `€${Number(product.price).toFixed(2)}`,
                                                image: product.images && product.images.length > 0 ? product.images[0] : '',
                                                moq: product.moq
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
                                    <p className="text-text-muted text-lg">No products found matching your filters.</p>
                                    <button
                                        onClick={() => window.location.href = window.location.pathname}
                                        className="mt-4 text-accent hover:text-primary underline"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
