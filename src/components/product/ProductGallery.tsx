'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export const ProductGallery = ({ images = [] }: { images?: string[] }) => {
    // Determine initial image (safeguard against empty array though parent handles it)
    const [selectedImage, setSelectedImage] = useState(images[0] || '/placeholder.jpg');

    return (
        <div className="flex flex-col">
            {/* Main Image Display */}
            <div className="aspect-[4/5] w-full overflow-hidden rounded-lg bg-gray-100 relative group">
                <Image
                    src={selectedImage}
                    alt="Product Main Image"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                />
            </div>

            {/* Thumbnails Grid */}
            {images.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-4">
                    {images.map((img, index) => (
                        <div
                            key={index}
                            className={`aspect-[4/5] overflow-hidden rounded-lg bg-gray-100 relative cursor-pointer border-2 transition-all ${selectedImage === img ? 'border-primary opacity-100' : 'border-transparent opacity-70 hover:opacity-100'
                                }`}
                            onClick={() => setSelectedImage(img)}
                        >
                            <Image
                                src={img}
                                alt={`Thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="25vw"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
