'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { OrderDetailModal } from './OrderDetailModal';
import { Trash2 } from 'lucide-react';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';

interface Order {
    id: string;
    buyer_id: string;
    // product_id and product removed
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

export const AdminOrderTable = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await fetch('/api/orders/admin');

            if (response.status === 403) {
                window.location.href = '/admin/login';
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }

            const data = await response.json();
            setOrders(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleOrderSuccess = () => {
        fetchOrders();
    };

    const handleDelete = async () => {
        if (!orderToDelete) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/orders/admin/${orderToDelete.id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete order');
            }

            fetchOrders();
            setOrderToDelete(null);
        } catch (err: any) {
            alert('Error deleting order: ' + err.message);
        } finally {
            setIsDeleting(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-gray-500">Loading orders...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
                <p className="mt-1 text-sm text-gray-500">No orders have been placed yet.</p>
            </div>
        );
    }

    return (
        <>
            <div className="flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Order ID</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Buyer</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Items</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total Qty</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                        <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {orders.map((order) => (
                                        <tr key={order.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                {order.order_number || order.id.substring(0, 8)}...
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                <div>
                                                    <div className="font-medium text-gray-900">{order.buyer.name}</div>
                                                    <div className="text-gray-500">{order.buyer.company_name}</div>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {order.items.length} Products
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatDate(order.created_at)}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${order.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                    order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <div className="flex justify-end space-x-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setSelectedOrder(order)}
                                                    >
                                                        View Details
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => setOrderToDelete(order)}
                                                        title="Delete Order"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {selectedOrder && (
                <OrderDetailModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onSuccess={handleOrderSuccess}
                />
            )}

            {orderToDelete && (
                <DeleteConfirmDialog
                    title="Delete Order"
                    itemName={`Order #${orderToDelete.order_number || orderToDelete.id.substring(0, 8)}`}
                    onConfirm={handleDelete}
                    onCancel={() => setOrderToDelete(null)}
                    isDeleting={isDeleting}
                />
            )}
        </>
    );
};
