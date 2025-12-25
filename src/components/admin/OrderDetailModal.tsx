'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface Order {
    id: string;
    buyer_id: string;
    // Removed direct product fields
    items: {
        id: string;
        quantity: number;
        product: {
            id: string;
            name: string;
            product_code: string;
            product_type: string;
            images: string[];
        }
    }[];
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    total_cost: number | null;
    payment_terms: string | null;
    payment_mode: string | null;
    delivery_mode: string | null;
    delivery_timeline: string | null;
    admin_notes: string | null;
    admin_contact_email: string | null;
    admin_contact_phone: string | null;
    created_at: string;
    buyer: {
        id: string;
        name: string;
        email: string;
        company_name: string;
        country: string;
    };
    order_number?: string;
}

interface OrderDetailModalProps {
    order: Order;
    onClose: () => void;
    onSuccess: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose, onSuccess }) => {
    const isPending = order.status === 'PENDING';
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        total_cost: order.total_cost?.toString() || '',
        payment_terms: order.payment_terms || '',
        payment_mode: order.payment_mode || '',
        delivery_mode: order.delivery_mode || '',
        delivery_timeline: order.delivery_timeline || '',
        admin_notes: order.admin_notes || '',
        admin_contact_email: order.admin_contact_email || '',
        admin_contact_phone: order.admin_contact_phone || ''
    });

    const handleStatusUpdate = async (newStatus: 'APPROVED' | 'REJECTED') => {
        setIsSubmitting(true);
        setError('');

        try {
            const updateData: any = { status: newStatus };

            if (newStatus === 'APPROVED') {
                // Validate required fields
                if (!formData.total_cost || !formData.payment_terms || !formData.payment_mode ||
                    !formData.delivery_mode || !formData.delivery_timeline) {
                    setError('All pricing and delivery fields are required for approval');
                    setIsSubmitting(false);
                    return;
                }

                updateData.total_cost = parseFloat(formData.total_cost);
                updateData.payment_terms = formData.payment_terms;
                updateData.payment_mode = formData.payment_mode;
                updateData.delivery_mode = formData.delivery_mode;
                updateData.delivery_timeline = formData.delivery_timeline;
            }

            if (formData.admin_notes) {
                updateData.admin_notes = formData.admin_notes;
            }
            if (formData.admin_contact_email) {
                updateData.admin_contact_email = formData.admin_contact_email;
            }
            if (formData.admin_contact_phone) {
                updateData.admin_contact_phone = formData.admin_contact_phone;
            }

            const response = await fetch(`/api/orders/admin/${order.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || `Failed to ${newStatus.toLowerCase()} order`);
            }

            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                        <p className="text-sm text-gray-500 mt-1">Order ID: {order.order_number || order.id}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    {/* Status Badge */}
                    <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-700">Status:</span>
                        <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${order.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                            order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                            }`}>
                            {order.status}
                        </span>
                    </div>

                    {/* Buyer Information */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Buyer Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Name</p>
                                <p className="font-medium">{order.buyer.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Company</p>
                                <p className="font-medium">{order.buyer.company_name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{order.buyer.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Country</p>
                                <p className="font-medium">{order.buyer.country}</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Items</h3>
                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-center bg-white p-3 rounded-md border border-gray-200">
                                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                        {item.product.images && item.product.images[0] ? (
                                            <img
                                                src={item.product.images[0]}
                                                alt={item.product.name}
                                                className="h-full w-full object-cover object-center"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs text-gray-500">
                                                No Img
                                            </div>
                                        )}
                                    </div>
                                    <div className="ml-4 flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between text-base font-medium text-gray-900">
                                                <h3>{item.product.name}</h3>
                                                <p className="ml-4">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="mt-1 text-sm text-gray-500">{item.product.product_code}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="pt-2 text-right">
                                <p className="text-sm text-gray-500">Order Date: {formatDate(order.created_at)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Pricing and Delivery Details */}
                    {isPending ? (
                        <div className="bg-blue-50 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Pricing & Delivery Details</h3>
                            <p className="text-sm text-gray-600 mb-4">Fill in the details below to approve this order</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Total Cost (€) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.total_cost}
                                        onChange={(e) => setFormData({ ...formData, total_cost: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="1500.00"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Payment Terms <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.payment_terms}
                                        onChange={(e) => setFormData({ ...formData, payment_terms: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="50% advance, 50% on delivery"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Payment Mode <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.payment_mode}
                                        onChange={(e) => setFormData({ ...formData, payment_mode: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select payment mode</option>
                                        <option value="Bank Transfer">Bank Transfer</option>
                                        <option value="Letter of Credit">Letter of Credit</option>
                                        <option value="PayPal">PayPal</option>
                                        <option value="Wire Transfer">Wire Transfer</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Delivery Mode <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.delivery_mode}
                                        onChange={(e) => setFormData({ ...formData, delivery_mode: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select delivery mode</option>
                                        <option value="Air Freight">Air Freight</option>
                                        <option value="Sea Freight">Sea Freight</option>
                                        <option value="Express Courier">Express Courier</option>
                                        <option value="Road Transport">Road Transport</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Delivery Timeline <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.delivery_timeline}
                                        onChange={(e) => setFormData({ ...formData, delivery_timeline: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="4-6 weeks from order confirmation"
                                    />
                                </div>

                                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Communication Email (Optional)
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.admin_contact_email}
                                            onChange={(e) => setFormData({ ...formData, admin_contact_email: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="support@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            WhatsApp Number (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.admin_contact_phone}
                                            onChange={(e) => setFormData({ ...formData, admin_contact_phone: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="+1 234 567 890"
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Admin Notes
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={formData.admin_notes}
                                        onChange={(e) => setFormData({ ...formData, admin_notes: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Any additional notes or special instructions..."
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Pricing & Delivery Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Total Cost</p>
                                    <p className="font-medium">€{order.total_cost ? Number(order.total_cost).toFixed(2) : 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Payment Terms</p>
                                    <p className="font-medium">{order.payment_terms || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Payment Mode</p>
                                    <p className="font-medium">{order.payment_mode || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Delivery Mode</p>
                                    <p className="font-medium">{order.delivery_mode || 'N/A'}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-500">Delivery Timeline</p>
                                    <p className="font-medium">{order.delivery_timeline || 'N/A'}</p>
                                </div>
                                {order.admin_notes && (
                                    <div className="col-span-2">
                                        <p className="text-sm text-gray-500">Admin Notes</p>
                                        <p className="font-medium">{order.admin_notes}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                            Close
                        </Button>
                        {isPending && (
                            <>
                                <Button
                                    type="button"
                                    onClick={() => handleStatusUpdate('REJECTED')}
                                    disabled={isSubmitting}
                                    className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                                >
                                    {isSubmitting ? 'Processing...' : 'Reject Order'}
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => handleStatusUpdate('APPROVED')}
                                    disabled={isSubmitting}
                                    className="bg-green-600 hover:bg-green-700 focus:ring-green-500"
                                >
                                    {isSubmitting ? 'Processing...' : 'Approve Order'}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
