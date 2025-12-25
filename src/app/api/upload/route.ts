import { NextResponse } from 'next/server';
import { uploadMultipleImages } from '@/lib/cloudinary';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { images, folder } = body;

        // Validate input
        if (!images || !Array.isArray(images) || images.length === 0) {
            return NextResponse.json(
                { error: 'No images provided' },
                { status: 400 }
            );
        }

        // Validate image format (base64)
        const validImages = images.every((img: string) =>
            typeof img === 'string' && (img.startsWith('data:image/') || img.startsWith('http'))
        );

        if (!validImages) {
            return NextResponse.json(
                { error: 'Invalid image format. Expected base64 or URL' },
                { status: 400 }
            );
        }

        // Upload images to Cloudinary
        const uploadResults = await uploadMultipleImages(images, folder || 'products');

        // Return Cloudinary URLs
        return NextResponse.json({
            success: true,
            images: uploadResults.map(result => ({
                url: result.secure_url,
                publicId: result.public_id,
                width: result.width,
                height: result.height,
                format: result.format
            }))
        });

    } catch (error: any) {
        console.error('Upload API error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to upload images' },
            { status: 500 }
        );
    }
}
