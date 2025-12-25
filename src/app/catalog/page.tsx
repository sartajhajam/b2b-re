import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CATEGORIES } from '@/lib/data';
import { prisma } from '@/lib/prisma';
import { ProductType } from '@prisma/client';

export const dynamic = 'force-dynamic';

// Helper to map display category to Prisma Enum
const getPrismaCategory = (category: string): ProductType => {
    const map: Record<string, ProductType> = {
        'Shawls': 'SHAWL',
        'Stoles': 'STOLE',
        'Mufflers': 'MUFFLER',
        'Rumala': 'RUMALA',
        'Dresses': 'DRESS',
        'Kimonos': 'KIMONO',
        'Capes': 'CAPE',
        'Kaftans': 'KAFTAN',
        'Scarfs': 'SCARF'
    };
    return map[category] || 'SHAWL';
};

async function getCategoryImages() {
    const images: Record<string, string> = {};

    for (const category of CATEGORIES) {
        const productType = getPrismaCategory(category);
        const latestProduct = await prisma.product.findFirst({
            where: {
                product_type: productType,
                images: { isEmpty: false } // Ensure product has images
            },
            orderBy: { created_at: 'desc' },
            select: { images: true }
        });

        if (latestProduct && latestProduct.images.length > 0) {
            images[category] = latestProduct.images[0];
        }
    }
    return images;
}

export default async function CatalogPage() {
    const categoryImages = await getCategoryImages();

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Navbar />
            <main className="flex-grow">
                {/* Header */}
                <div className="bg-surface border-b border-border">
                    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl font-serif font-bold tracking-tight text-primary">Our Collections</h1>
                        <p className="mt-4 text-text-muted max-w-xl mx-auto">
                            Explore our diverse range of premium textiles, handcrafted for elegance and quality.
                        </p>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-y-12 gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
                        {CATEGORIES.map((category) => (
                            <Link href={`/catalog/${category.toLowerCase()}`} key={category} className="group cursor-pointer">
                                <div className="aspect-[4/5] w-full overflow-hidden rounded-sm bg-gray-100 relative">
                                    {/* Cover Image */}
                                    {categoryImages[category] ? (
                                        <Image
                                            src={categoryImages[category]}
                                            alt={category}
                                            fill
                                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-gray-200 text-text-muted font-serif italic text-xl group-hover:scale-105 transition-transform duration-700 ease-out">
                                            {category}
                                        </div>
                                    )}

                                    {/* Decorative border on hover */}
                                    <div className="absolute inset-4 border border-white/30 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                    {/* Overlay Gradient for readability if needed, though design seems to prefer clean image or labeled below */}
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500"></div>
                                </div>
                                <div className="mt-6 text-center">
                                    <h3 className="text-2xl font-serif font-medium text-primary group-hover:text-accent transition-colors">
                                        {category}
                                    </h3>
                                    <p className="mt-2 text-sm text-text-muted uppercase tracking-wider">Explore Collection</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

