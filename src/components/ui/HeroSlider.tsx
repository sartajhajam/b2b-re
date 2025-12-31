'use client';

import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface BannerImage {
    src: string;
    alt: string;
    title?: string;
    subtitle?: string;
}

interface HeroSliderProps {
    images: BannerImage[];
}

export function HeroSlider({ images }: HeroSliderProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
        Autoplay({ delay: 5000, stopOnInteraction: false })
    ]);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    return (
        <div className="relative group overflow-hidden bg-gray-100">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {images.map((image, index) => (
                        <div key={index} className="relative flex-[0_0_100%] min-w-0 h-[350px] sm:h-[500px] lg:h-[700px]">
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                priority={index === 0}
                                className="object-cover"
                                sizes="100vw"
                                quality={90}
                            />
                            {/* Dark Gradient Overlay for text readability */}
                            <div className="absolute inset-0 bg-black/20" />

                            {/* Optional Text Content */}
                            {(image.title || image.subtitle) && (
                                <div className="absolute inset-0 flex items-center justify-center text-center">
                                    <div className="max-w-4xl px-6 animate-fade-in-up">
                                        {image.subtitle && (
                                            <p className="text-sm sm:text-lg md:text-xl text-white font-medium mb-4 tracking-widest uppercase shadow-sm">
                                                {image.subtitle}
                                            </p>
                                        )}
                                        {image.title && (
                                            <h2 className="text-3xl sm:text-5xl lg:text-7xl font-serif font-bold text-white mb-8 drop-shadow-lg">
                                                {image.title}
                                            </h2>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            <button
                onClick={scrollPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-8 h-8" />
            </button>
            <button
                onClick={scrollNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                aria-label="Next slide"
            >
                <ChevronRight className="w-8 h-8" />
            </button>
        </div>
    );
}
