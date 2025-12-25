'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { SUB_CATEGORIES, MATERIALS, CATEGORY_MATERIALS } from '@/lib/data';

export type FilterState = {
    material: string[];
    minPrice: number;
    maxPrice: number;
    sortBy: string;
};

interface ProductFilterProps {
    className?: string;
    category?: string; // e.g. "SHAWL", "STOLE"
}

export function ProductFilter({ className, category }: ProductFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Initial state from URL params
    const [selectedMaterials, setSelectedMaterials] = useState<string[]>(
        searchParams.getAll('material')
    );
    const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
        searchParams.get('sub_category')
    );

    const handleMaterialChange = (material: string) => {
        const newMaterials = selectedMaterials.includes(material)
            ? selectedMaterials.filter(m => m !== material)
            : [...selectedMaterials, material];

        setSelectedMaterials(newMaterials);
        updateFilters(newMaterials, selectedSubCategory);
    };

    const handleSubCategoryChange = (subCategory: string) => {
        const newSubCategory = selectedSubCategory === subCategory ? null : subCategory;
        setSelectedSubCategory(newSubCategory);
        updateFilters(selectedMaterials, newSubCategory);
    };

    const updateFilters = (materials: string[], subCategory: string | null) => {
        const params = new URLSearchParams(searchParams.toString());

        // Update Material params
        params.delete('material');
        materials.forEach(m => params.append('material', m));

        // Update Sub-Category param
        if (subCategory) {
            params.set('sub_category', subCategory);
        } else {
            params.delete('sub_category');
        }

        router.push(`?${params.toString()}`);
    };

    const clearFilters = () => {
        setSelectedMaterials([]);
        setSelectedSubCategory(null);
        router.push('?');
    };

    const relevantSubCategories = category ? SUB_CATEGORIES[category] : [];
    const relevantMaterials = category && CATEGORY_MATERIALS[category]
        ? CATEGORY_MATERIALS[category]
        : MATERIALS;

    return (
        <div className={`space-y-8 ${className}`}>
            {relevantSubCategories && relevantSubCategories.length > 0 && (
                <div>
                    <h3 className="text-lg font-serif font-medium text-primary mb-4">Sub-Categories</h3>
                    <div className="space-y-3">
                        {relevantSubCategories.map((sub) => (
                            <div key={sub} className="flex items-center">
                                <input
                                    id={`filter-sub-${sub}`}
                                    name={`filter-sub-${sub}`}
                                    type="checkbox"
                                    value={sub}
                                    checked={selectedSubCategory === sub}
                                    onChange={() => handleSubCategoryChange(sub)}
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <label
                                    htmlFor={`filter-sub-${sub}`}
                                    className="ml-3 text-sm text-text-muted"
                                >
                                    {sub}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div>
                <h3 className="text-lg font-serif font-medium text-primary mb-4">Material</h3>
                <div className="space-y-3">
                    {relevantMaterials.map((material) => (
                        <div key={material} className="flex items-center">
                            <input
                                id={`filter-${material}`}
                                name={`filter-${material}`}
                                type="checkbox"
                                value={material}
                                checked={selectedMaterials.includes(material)}
                                onChange={() => handleMaterialChange(material)}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <label
                                htmlFor={`filter-${material}`}
                                className="ml-3 text-sm text-text-muted"
                            >
                                {material}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {(selectedMaterials.length > 0 || selectedSubCategory) && (
                <button
                    onClick={clearFilters}
                    className="text-sm text-accent hover:text-primary transition-colors underline"
                >
                    Clear all filters
                </button>
            )}
        </div>
    );
}
