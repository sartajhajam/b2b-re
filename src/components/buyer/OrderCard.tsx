'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface OrderItem {
    id: string;
    quantity: number;
    product: {
        name: string;
        images: string[];
        product_code: string;
        price?: number | null;
    };
}

interface Order {
    id: string;
    order_number?: string | null;
    created_at: Date | string;
    status: string;
    total_cost: number | null;
    items: OrderItem[];
    admin_notes?: string | null;
    admin_contact_email?: string | null;
    admin_contact_phone?: string | null;
    payment_terms?: string | null;
    payment_mode?: string | null;
    delivery_mode?: string | null;
    delivery_timeline?: string | null;
}

interface OrderCardProps {
    order: Order;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200 transition-all duration-200">
            {/* Clickable Header */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="px-4 py-5 sm:px-6 bg-gray-50 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
            >
                <div>
                    <div className="flex items-center space-x-2">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Order #{order.order_number || order.id.slice(0, 8)}
                        </h3>
                        {isOpen ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
                    </div>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>
                <div className="flex items-center space-x-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold 
                        ${order.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                            order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'}`}>
                        {order.status}
                    </span>
                    <div className="text-right hidden sm:block">
                        <p className="text-sm text-gray-500">Total Estimates</p>
                        <p className="text-lg font-bold text-gray-900">
                            {order.total_cost ? `€${Number(order.total_cost).toFixed(2)}` : 'Pending'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Expandable Body */}
            {isOpen && (
                <div className="border-t border-gray-200 bg-white">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="col-span-6">Product</div>
                        <div className="col-span-2 text-center">Unit Price</div>
                        <div className="col-span-2 text-center">Qty</div>
                        <div className="col-span-2 text-right">Total</div>
                    </div>
                    <ul role="list" className="divide-y divide-gray-200">
                        {order.items.map((item) => {
                            const unitPrice = item.product.price || 0;
                            const itemTotal = unitPrice * item.quantity;

                            return (
                                <li key={item.id} className="px-4 py-4 sm:px-6 grid grid-cols-12 gap-4 items-center">
                                    <div className="col-span-6 flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 border border-gray-200 rounded-md overflow-hidden bg-gray-100">
                                            {item.product.images && item.product.images[0] ? (
                                                <img
                                                    src={item.product.images[0]}
                                                    alt={item.product.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-indigo-600 truncate max-w-[200px]">
                                                {item.product.name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Code: {item.product.product_code}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-center text-sm text-gray-500">
                                        {unitPrice > 0 ? `€${unitPrice.toFixed(2)}` : 'N/A'}
                                    </div>
                                    <div className="col-span-2 text-center text-sm text-gray-900 font-medium">
                                        {item.quantity}
                                    </div>
                                    <div className="col-span-2 text-right text-sm font-bold text-gray-900">
                                        {itemTotal > 0 ? `€${itemTotal.toFixed(2)}` : 'N/A'}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                    <div className="px-4 py-5 sm:px-6 bg-gray-50 border-t border-gray-200 flex justify-end">
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Total Order Cost</p>
                            <p className="text-2xl font-bold text-indigo-600">
                                {order.total_cost ? `€${Number(order.total_cost).toFixed(2)}` : 'Pending Quote'}
                            </p>
                        </div>
                    </div>

                    {(order.status === 'APPROVED' || order.status === 'REJECTED' || (order.admin_notes && order.status !== 'PENDING')) && (
                        <div className="px-4 py-4 bg-blue-50 border-t border-blue-100 space-y-4">
                            {/* Approved Details */}
                            {order.status === 'APPROVED' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/60 p-3 rounded border border-blue-100">
                                    {order.payment_terms && (
                                        <div>
                                            <p className="text-xs text-blue-800 font-semibold uppercase tracking-wider">Payment Terms</p>
                                            <p className="text-sm font-medium text-blue-900">{order.payment_terms}</p>
                                        </div>
                                    )}
                                    {order.payment_mode && (
                                        <div>
                                            <p className="text-xs text-blue-800 font-semibold uppercase tracking-wider">Payment Mode</p>
                                            <p className="text-sm font-medium text-blue-900">{order.payment_mode}</p>
                                        </div>
                                    )}
                                    {order.delivery_mode && (
                                        <div>
                                            <p className="text-xs text-blue-800 font-semibold uppercase tracking-wider">Delivery Mode</p>
                                            <p className="text-sm font-medium text-blue-900">{order.delivery_mode}</p>
                                        </div>
                                    )}
                                    {order.delivery_timeline && (
                                        <div>
                                            <p className="text-xs text-blue-800 font-semibold uppercase tracking-wider">Estimated Delivery</p>
                                            <p className="text-sm font-medium text-blue-900">{order.delivery_timeline}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {order.admin_notes && (
                                <div>
                                    <h4 className="text-sm font-medium text-blue-900 mb-1">Admin Notes</h4>
                                    <p className="text-sm text-blue-800 bg-white/50 p-2 rounded border border-blue-100">
                                        {order.admin_notes}
                                    </p>
                                </div>
                            )}

                            {(order.admin_contact_email || order.admin_contact_phone) && (
                                <div>
                                    <h4 className="text-sm font-medium text-blue-900 mb-1">Order Support & Contact</h4>
                                    <div className="flex flex-col sm:flex-row sm:space-x-6 text-sm text-blue-800">
                                        {order.admin_contact_email && (
                                            <p className="flex items-center gap-2">
                                                <span className="font-medium">Email:</span>
                                                <a href={`mailto:${order.admin_contact_email}`} className="underline hover:text-blue-900">
                                                    {order.admin_contact_email}
                                                </a>
                                            </p>
                                        )}
                                        {order.admin_contact_phone && (
                                            <p className="flex items-center gap-2">
                                                <span className="font-medium">WhatsApp:</span>
                                                <a href={`https://wa.me/${order.admin_contact_phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">
                                                    {order.admin_contact_phone}
                                                </a>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )
            }
        </div >
    );
};
