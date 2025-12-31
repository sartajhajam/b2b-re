import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSlider } from '@/components/ui/HeroSlider';
import { CollectionCarousel } from '@/components/ui/CollectionCarousel';
import { prisma } from '@/lib/prisma';
import { ProductType } from '@prisma/client';
import { CATEGORIES } from '@/lib/data';

export const dynamic = 'force-dynamic';

// Define banner images (placeholders - user to replace with Cloudinary URLs)
const HERO_BANNERS = [
  {
    src: "https://res.cloudinary.com/ramba-exports/image/upload/v1767177368/Banner-2_v2002w.png",
    alt: "Mystical Floral Collection ",
  },
  {
    src: "https://res.cloudinary.com/ramba-exports/image/upload/v1767177370/banner-1_dbhwcm.png",
    alt: "Merino Stoles",
  },
  {
    src: "https://res.cloudinary.com/ramba-exports/image/upload/v1767177369/Banner-5_r66wjd.png",
    alt: "Boiled Wool Stoles Collection",

  },
  {
    src: "https://res.cloudinary.com/ramba-exports/image/upload/v1767177370/banner-202_egweje.png",
    alt: "Dresses & Kimonos Collection"
  },
  {
    src: "https://res.cloudinary.com/ramba-exports/image/upload/v1767177369/banner-4_yorb8n.png",
    alt: "Luxurious Scarves & Capes Collection"
  },
  {
    src: "https://res.cloudinary.com/ramba-exports/image/upload/v1767179567/banner-6_rb2web.png",
    alt: "Ari Muffler & Woolen Mufflers Collection"
  }

];

// Map display names to Prisma Enums
const CATEGORY_ENUM_MAP: Record<string, ProductType> = {
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

async function getCuratedCollections() {
  const collections = await Promise.all(CATEGORIES.map(async (cat) => {
    // 1. Determine Prisma Enum type
    const productType = CATEGORY_ENUM_MAP[cat];

    // 2. Fetch latest product image for this category
    let image = null;
    if (productType) {
      // Trying to find a product that HAS images
      const product = await prisma.product.findFirst({
        where: {
          product_type: productType,
          images: { isEmpty: false } // Only products with images
        },
        orderBy: { created_at: 'desc' }, // Get the newest one
        select: { images: true }
      });

      if (product && product.images.length > 0) {
        image = product.images[0];
      }
    }

    return {
      name: cat,
      href: `/catalog/${cat.toLowerCase()}`,
      image: image
    };
  }));

  return collections;
}

export default async function Home() {
  // Fetch dynamic collections
  const CURATED_COLLECTIONS = await getCuratedCollections();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Slider Section */}
        <section className="relative">
          <HeroSlider images={HERO_BANNERS} />
        </section>

        {/* Featured Collections */}
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 border-t border-border">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold tracking-tight text-primary sm:text-4xl">Curated Collections</h2>
            <p className="mt-4 text-text-muted font-light">Explore our finest categories suited for high-end retail.</p>
          </div>

          <div className="relative px-4 sm:px-12">
            <CollectionCarousel items={CURATED_COLLECTIONS} />
          </div>
        </div>

        {/* Trust/Heritage Section */}
        <div className="bg-surface py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-16 items-center">
              <div>
                <h2 className="text-3xl font-serif font-bold tracking-tight text-primary sm:text-4xl mb-6">
                  A Legacy of Craftsmanship
                </h2>
                <p className="text-lg leading-8 text-text-muted font-light mb-6">
                  Founded in 1993, Ramba Exports has remained true to the art of textile manufacturing.
                  We combine traditional Kashmiri embroidery techniques with modern quality control
                  standards required by the European market.
                </p>
                <dl className="grid grid-cols-2 gap-8 text-center lg:text-left">
                  <div>
                    <dt className="text-3xl font-serif font-bold text-accent">30+</dt>
                    <dd className="text-sm text-primary uppercase tracking-wider mt-1">Years Experience</dd>
                  </div>
                  <div>
                    <dt className="text-3xl font-serif font-bold text-accent">100%</dt>
                    <dd className="text-sm text-primary uppercase tracking-wider mt-1">Export Quality</dd>
                  </div>
                </dl>
              </div>
              <div className="relative aspect-[3/2] bg-gray-100 rounded-sm overflow-hidden">
                <Image
                  src="/images/atelier-workshop.jpg"
                  alt="Ramba Exports Atelier Workshop"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
