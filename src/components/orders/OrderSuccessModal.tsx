'use client';

import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface OrderSuccessModalProps {
    isOpen: boolean;
    onClose: () => void; // Optional if we just want them to navigate away
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ isOpen }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center animate-in fade-in zoom-in duration-300">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">Quote Request Submitted!</h3>

                <p className="text-gray-500 mb-6">
                    We have received your request. Our team will review it and send you a formal quote shortly. You can track the status in your dashboard.
                </p>

                <div className="space-y-3">
                    <Link href="/dashboard/buyer" className="block w-full">
                        <Button className="w-full" size="lg">
                            View My Orders
                        </Button>
                    </Link>

                    <Link href="/catalog" className="block w-full">
                        <Button variant="outline" className="w-full">
                            Continue Browsing
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
