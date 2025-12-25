'use client';

import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type?: ToastType;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

export function Toast({
    message,
    type = 'success',
    isVisible,
    onClose,
    duration = 3000
}: ToastProps) {
    const [isShowing, setIsShowing] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setIsShowing(true);
            const timer = setTimeout(() => {
                setIsShowing(false);
                setTimeout(onClose, 300); // Wait for fade out animation
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible && !isShowing) return null;

    const bgColors = {
        success: 'bg-green-50 border-green-200',
        error: 'bg-red-50 border-red-200',
        info: 'bg-blue-50 border-blue-200'
    };

    const iconColors = {
        success: 'text-green-500',
        error: 'text-red-500',
        info: 'text-blue-500'
    };

    const Icons = {
        success: CheckCircle,
        error: AlertCircle,
        info: AlertCircle
    };

    const Icon = Icons[type];

    return (
        <div className={`fixed top-4 right-4 z-[100] transition-all duration-300 transform ${isShowing ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
            <div className={`flex items-start p-4 rounded-lg border shadow-lg max-w-sm w-full ${bgColors[type]}`}>
                <div className="flex-shrink-0">
                    <Icon className={`w-5 h-5 ${iconColors[type]}`} />
                </div>
                <div className="ml-3 flex-1 pt-0.5">
                    <p className={`text-sm font-medium ${type === 'error' ? 'text-red-800' : 'text-gray-800'}`}>
                        {message}
                    </p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                    <button
                        onClick={() => {
                            setIsShowing(false);
                            setTimeout(onClose, 300);
                        }}
                        className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${iconColors[type]} hover:bg-white hover:bg-opacity-50`}
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
