'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from './ImageUpload';
import { MATERIALS, WASH_CARE_OPTIONS, SUB_CATEGORIES, CATEGORY_MATERIALS } from '@/lib/data';

interface ProductFormProps {
    onClose: () => void;
    onSuccess: () => void;
    initialData?: any; // To render form in edit mode
}

export const ProductForm: React.FC<ProductFormProps> = ({ onClose, onSuccess, initialData }) => {
    const isEditMode = !!initialData;

    // Parse initial materials if they come as string or array
    const initialMaterials = initialData?.materials
        ? (Array.isArray(initialData.materials) ? initialData.materials : [initialData.materials])
        : [];

    const initialWashCare = initialData?.wash_care
        ? (Array.isArray(initialData.wash_care) ? initialData.wash_care : [initialData.wash_care])
        : [];

    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        product_type: initialData?.product_type || 'SHAWL',
        sub_category: initialData?.sub_category || '',
        materials: initialMaterials as string[],
        description: initialData?.description || '',
        price: initialData?.price?.toString() || '',
        moq: initialData?.moq || 30,
        width: initialData?.width?.toString() || '',
        length: initialData?.length?.toString() || '',
        wash_care: initialWashCare as string[],
    });

    const [images, setImages] = useState<string[]>(initialData?.images || []);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const availableMaterials = CATEGORY_MATERIALS[formData.product_type] || MATERIALS;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            // Validate images
            if (images.length === 0) {
                setError('Please upload at least one product image');
                setIsSubmitting(false);
                return;
            }

            // Materials are already an array now
            const materialsArray = formData.materials;

            if (materialsArray.length === 0) {
                setError('Please select at least one material');
                setIsSubmitting(false);
                return;
            }

            const url = isEditMode ? `/api/products/${initialData.id}` : '/api/products';
            const method = isEditMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    materials: materialsArray,
                    images: images
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || `Failed to ${isEditMode ? 'update' : 'create'} product`);
            }

            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">{isEditMode ? 'Edit Product' : 'Add New Product'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                placeholder="e.g., Royal Kani Shawl"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                required
                                value={formData.product_type}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        product_type: e.target.value,
                                        sub_category: '', // Reset sub-category on type change
                                        materials: [] // Reset materials on type change to avoid invalid ones
                                    });
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                            >
                                <option value="SHAWL">Shawl</option>
                                <option value="STOLE">Stole</option>
                                <option value="MUFFLER">Muffler</option>
                                <option value="RUMALA">Rumala</option>
                                <option value="DRESS">Dress</option>
                                <option value="KIMONO">Kimono</option>
                                <option value="CAPE">Cape</option>
                                <option value="KAFTAN">Kaftan</option>
                                <option value="SCARF">Scarf</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Sub Category - Rendered locally to be dependent on product_type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Sub Category
                            </label>
                            <select
                                value={formData.sub_category}
                                onChange={(e) => setFormData({ ...formData, sub_category: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                disabled={!SUB_CATEGORIES[formData.product_type]}
                            >
                                <option value="">Select Sub Category</option>
                                {SUB_CATEGORIES[formData.product_type]?.map((sub) => (
                                    <option key={sub} value={sub}>
                                        {sub}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price (€) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                min="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                placeholder="99.99"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                MOQ (Minimum Order Quantity) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                min="1"
                                value={formData.moq}
                                onChange={(e) => setFormData({ ...formData, moq: parseInt(e.target.value) })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Width (cm)
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                value={formData.width}
                                onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                placeholder="e.g., 100"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Length (cm)
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                value={formData.length}
                                onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                placeholder="e.g., 200"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Materials <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {availableMaterials.map((material) => (
                                <label key={material} className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox h-4 w-4 text-accent border-gray-300 rounded focus:ring-accent"
                                        checked={formData.materials.includes(material)}
                                        onChange={(e) => {
                                            const checked = e.target.checked;
                                            setFormData(prev => ({
                                                ...prev,
                                                materials: checked
                                                    ? [...prev.materials, material]
                                                    : prev.materials.filter(m => m !== material)
                                            }));
                                        }}
                                    />
                                    <span className="ml-2 text-gray-700 text-sm">{material}</span>
                                </label>
                            ))}
                        </div>
                        <p className="mt-1 text-sm text-gray-500">Select all materials that apply.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Wash Care
                        </label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {WASH_CARE_OPTIONS.map((care) => (
                                <label key={care} className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox h-4 w-4 text-accent border-gray-300 rounded focus:ring-accent"
                                        checked={formData.wash_care.includes(care)}
                                        onChange={(e) => {
                                            const checked = e.target.checked;
                                            setFormData(prev => ({
                                                ...prev,
                                                wash_care: checked
                                                    ? [...prev.wash_care, care]
                                                    : prev.wash_care.filter(c => c !== care)
                                            }));
                                        }}
                                    />
                                    <span className="ml-2 text-gray-700 text-sm">{care}</span>
                                </label>
                            ))}
                        </div>
                        <p className="mt-1 text-sm text-gray-500">Select recommended wash care instructions.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            required
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="Describe the product..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product Images <span className="text-red-500">*</span>
                        </label>
                        <ImageUpload onImagesChange={setImages} maxImages={10} />
                        <p className="mt-2 text-sm text-gray-500">
                            Upload high-quality product images. First image will be the main product image.
                        </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex">
                            <svg className="h-5 w-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <div className="ml-3">
                                <p className="text-sm text-blue-700">
                                    <strong>Note:</strong> Product code will be automatically generated based on the product type (e.g., SHAWL-001, STOLE-002).
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Product' : 'Create Product')}
                        </Button>
                    </div>
                </form >
            </div >
        </div >
    );
};
