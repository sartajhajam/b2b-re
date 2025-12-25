'use client';

import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export interface CollectionItem {
    name: string;
    href: string;
    image?: string | null;
}

interface CollectionCarouselProps {
    items: CollectionItem[];
}

export function CollectionCarousel({ items }: CollectionCarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: 'start',
        containScroll: 'trimSnaps'
    }, [
        Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })
    ]);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    return (
        <div className="relative group">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex -ml-4 sm:-ml-8">
                    {items.map((item) => (
                        <div key={item.name} className="pl-4 sm:pl-8 flex-[0_0_80%] sm:flex-[0_0_50%] lg:flex-[0_0_30%] min-w-0">
                            <div className="group/card cursor-pointer h-full relative">
                                <div className="aspect-[4/5] w-full overflow-hidden rounded-sm bg-gray-100 relative">
                                    {/* Decorative border on hover */}
                                    <div className="absolute inset-4 border border-white/30 z-10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>

                                    {item.image ? (
                                        <>
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-full w-full object-cover group-hover/card:scale-110 transition-transform duration-700 ease-out"
                                            />
                                            {/* Overlay Gradient for readability */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-60"></div>
                                        </>
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-gray-200 text-text-muted font-serif italic text-xl group-hover/card:scale-105 transition-transform duration-700 ease-out">
                                            {item.name}
                                        </div>
                                    )}
                                </div>
                                <div className="mt-6 text-center">
                                    <h3 className="text-xl font-serif font-medium text-primary group-hover/card:text-accent transition-colors">
                                        <Link href={item.href}>
                                            <span aria-hidden="true" className="absolute inset-0" />
                                            {item.name}
                                        </Link>
                                    </h3>
                                    <p className="mt-2 text-sm text-text-muted uppercase tracking-wider">View Products</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons - Transparent Arrows */}
            <button
                onClick={scrollPrev}
                className="absolute -left-4 sm:-left-12 top-1/2 -translate-y-full sm:-translate-y-1/2 text-primary/50 hover:text-primary p-2 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 disabled:opacity-0 cursor-pointer"
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-8 h-8 sm:w-12 sm:h-12" />
            </button>
            <button
                onClick={scrollNext}
                className="absolute -right-4 sm:-right-12 top-1/2 -translate-y-full sm:-translate-y-1/2 text-primary/50 hover:text-primary p-2 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 disabled:opacity-0 cursor-pointer"
                aria-label="Next slide"
            >
                <ChevronRight className="w-8 h-8 sm:w-12 sm:h-12" />
            </button>
        </div>
    );
}
