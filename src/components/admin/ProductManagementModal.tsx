'use client';

import { AdminProductList } from './AdminProductList';

interface ProductManagementModalProps {
    onClose: () => void;
    onEdit: (product: any) => void;
    refreshTrigger: number;
}

export const ProductManagementModal: React.FC<ProductManagementModalProps> = ({ onClose, onEdit, refreshTrigger }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] flex flex-col">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg z-10">
                    <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-grow">
                    <p className="mb-4 text-gray-600">
                        Search, view details, modify, or delete existing products.
                    </p>
                    <AdminProductList
                        onEdit={onEdit}
                        refreshTrigger={refreshTrigger}
                    />
                </div>
            </div>
        </div>
    );
};
