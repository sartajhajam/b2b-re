import { NextResponse } from 'next/server';
import { uploadMultipleImages } from '@/lib/cloudinary';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const files = formData.getAll('images') as File[];
        const folder = formData.get('folder') as string;

        // Validate input
        if (!files || files.length === 0) {
            return NextResponse.json(
                { error: 'No images provided' },
                { status: 400 }
            );
        }

        // Convert files to base64
        const base64Images = await Promise.all(
            files.map(async (file) => {
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const base64 = buffer.toString('base64');
                const mimeType = file.type;
                return `data:${mimeType};base64,${base64}`;
            })
        );

        // Upload images to Cloudinary
        const uploadResults = await uploadMultipleImages(base64Images, folder || 'products');

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
