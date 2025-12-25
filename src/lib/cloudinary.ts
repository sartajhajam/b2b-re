// Cloudinary configuration and utilities
// Install required package: npm install cloudinary

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
    public_id: string;
    secure_url: string;
    width: number;
    height: number;
    format: string;
}

/**
 * Upload an image to Cloudinary
 * @param file - Base64 encoded image or file path
 * @param folder - Folder path in Cloudinary (e.g., 'products/shawls')
 * @returns Upload result with URL and metadata
 */
export async function uploadImage(
    file: string,
    folder: string = 'products'
): Promise<CloudinaryUploadResult> {
    try {
        const result = await cloudinary.uploader.upload(file, {
            folder: `ramba-exports/${folder}`,
            resource_type: 'image',
            transformation: [
                { quality: 'auto', fetch_format: 'auto' }
            ]
        });

        return {
            public_id: result.public_id,
            secure_url: result.secure_url,
            width: result.width,
            height: result.height,
            format: result.format,
        };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Failed to upload image to Cloudinary');
    }
}

/**
 * Upload multiple images to Cloudinary
 * @param files - Array of base64 encoded images
 * @param folder - Folder path in Cloudinary
 * @returns Array of upload results
 */
export async function uploadMultipleImages(
    files: string[],
    folder: string = 'products'
): Promise<CloudinaryUploadResult[]> {
    try {
        const uploadPromises = files.map(file => uploadImage(file, folder));
        return await Promise.all(uploadPromises);
    } catch (error) {
        console.error('Multiple upload error:', error);
        throw new Error('Failed to upload images to Cloudinary');
    }
}

/**
 * Delete an image from Cloudinary
 * @param publicId - The public ID of the image to delete
 */
export async function deleteImage(publicId: string): Promise<void> {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        throw new Error('Failed to delete image from Cloudinary');
    }
}

/**
 * Get optimized image URL with transformations
 * @param url - Original Cloudinary URL
 * @param width - Desired width
 * @param height - Desired height
 * @returns Transformed URL
 */
export function getOptimizedImageUrl(
    url: string,
    width?: number,
    height?: number
): string {
    if (!url.includes('cloudinary.com')) return url;

    const transformations = [];
    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    transformations.push('c_fill', 'q_auto', 'f_auto');

    const transformation = transformations.join(',');
    return url.replace('/upload/', `/upload/${transformation}/`);
}

export { cloudinary };
