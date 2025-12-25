import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductNavigation } from '@/components/product/ProductNavigation';
import { OrderForm } from '@/components/orders/OrderForm';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Lock } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

// Mock auth check - in real app use session/auth hook
// For demo purposes, we'll assume a "false" state that can be toggled by the user in a real app,
// but since I can't easily toggle it here, I will check if I can make it depend on a cookie or something?
// Or just default to TRUE for the user to see the "Add to Order" flow as requested?
// The user said "Login to view price , and when logged user shall be able to added in order list".
// I will pass a prop `isAuthenticated` which hardcodes to true for now or checks something.
// Actually, let's keep it simple. I'll pass a prop to client component `OrderForm` and `ProductPrice` 
// that checks a mock "isLoggedIn" state or just defaults to true for demonstration if the user wants to test it.
// However, the prompt says "when logged user shall be able to...". 
// I will simulate this by checking a query param ?auth=true or just hardcoding it to true for this demo?
// Or better: Use a Client Component wrapper for the Price/Add section that checks localStorage "authToken".

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Fetch product from DB
    // Cast to any to handle stale Prisma types until server restart
    const product = await prisma.product.findUnique({
        where: { id }
    }) as any;

    if (!product) {
        notFound();
    }

    // Fetch adjacent products for navigation
    const [prevProduct, nextProduct] = await Promise.all([
        prisma.product.findFirst({
            where: {
                product_type: product.product_type,
                created_at: { gt: product.created_at }
            },
            orderBy: { created_at: 'asc' },
            select: { id: true, name: true }
        }),
        prisma.product.findFirst({
            where: {
                product_type: product.product_type,
                created_at: { lt: product.created_at }
            },
            orderBy: { created_at: 'desc' },
            select: { id: true, name: true }
        })
    ]);

    return (
        <div className="flex min-h-screen flex-col bg-background relative">
            <Navbar />
            <ProductNavigation prevProductId={prevProduct?.id} nextProductId={nextProduct?.id} />
            <main className="flex-grow">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-12">
                        {/* Gallery */}
                        <ProductGallery images={product.images && product.images.length > 0 ? product.images : ['/placeholder.jpg']} />

                        {/* Product Info */}
                        <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                            <span className="text-accent text-sm font-semibold tracking-wider uppercase">{product.product_type}</span>
                            <h1 className="mt-2 text-4xl font-serif font-bold tracking-tight text-primary">{product.name}</h1>

                            {/* Price and Add to Order Section - Handled by Client Component for Auth check */}
                            <OrderForm
                                product={{
                                    id: product.id,
                                    name: product.name,
                                    price: Number(product.price),
                                    productType: product.product_type,
                                    image: product.images && product.images.length > 0 ? product.images[0] : '',
                                    moq: product.moq,
                                    specification: (product.width && product.length)
                                        ? `${product.width}cm x ${product.length}cm`
                                        : 'Standard / Free Size'
                                }}
                            />

                            <div className="mt-8">
                                <h3 className="sr-only">Description</h3>
                                <div className="prose prose-sm text-text-muted leading-relaxed">
                                    <p>{product.description}</p>
                                </div>
                            </div>

                            {/* Product Attributes */}
                            <div className="mt-8 border-t border-border pt-8">
                                <h3 className="text-sm font-medium text-primary">Specifications</h3>
                                <div className="mt-4 grid grid-cols-1 gap-y-4 sm:grid-cols-2">
                                    <div className="border border-border p-3 rounded-sm">
                                        <dt className="text-xs text-text-muted uppercase tracking-wider">Materials composition</dt>
                                        <dd className="mt-1 text-sm font-semibold text-primary">{product.materials.join(', ')}</dd>
                                    </div>
                                    <div className="border border-border p-3 rounded-sm">
                                        <dt className="text-xs text-text-muted uppercase tracking-wider">MOQ</dt>
                                        <dd className="mt-1 text-sm font-semibold text-primary">{product.moq} Pieces</dd>
                                    </div>
                                    {(product.width || product.length) && (
                                        <div className="border border-border p-3 rounded-sm">
                                            <dt className="text-xs text-text-muted uppercase tracking-wider">Dimensions</dt>
                                            <dd className="mt-1 text-sm font-semibold text-primary">
                                                {product.width ? `${product.width}cm (W)` : ''}
                                                {product.width && product.length ? ' x ' : ''}
                                                {product.length ? `${product.length}cm (L)` : ''}
                                            </dd>
                                        </div>
                                    )}
                                    {product.wash_care && product.wash_care.length > 0 && (
                                        <div className="border border-border p-3 rounded-sm">
                                            <dt className="text-xs text-text-muted uppercase tracking-wider">Wash Care</dt>
                                            <dd className="mt-1 text-sm font-semibold text-primary">
                                                {product.wash_care.join(', ')}
                                            </dd>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
