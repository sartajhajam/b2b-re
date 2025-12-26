'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AdminOrderTable } from '@/components/admin/AdminOrderTable';
import { ProductForm } from '@/components/admin/ProductForm';
import { ProductManagementModal } from '@/components/admin/ProductManagementModal';
import { UserManagementModal } from '@/components/admin/UserManagementModal';
import { Button } from '@/components/ui/Button';
import { Toast, ToastType } from '@/components/ui/Toast';

interface DashboardStats {
    totalPendingOrders: number;
    monthlyRevenue: number;
    activeBuyers: number;
}

interface AdminDashboardClientProps {
    stats: DashboardStats;
}

export function AdminDashboardClient({ stats }: AdminDashboardClientProps) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            console.log('Admin Dashboard Auth Check:', { user });
            if (!user) {
                console.log('No user, redirecting to login...');
                router.push('/admin/login');
            } else if (user.role !== 'ADMIN') {
                console.log('User is not admin, redirecting...');
                router.push('/');
            }
        }
    }, [user, isLoading, router]);


    const [showProductForm, setShowProductForm] = useState(false);
    const [showProductManagement, setShowProductManagement] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const [showUserManagement, setShowUserManagement] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
        message: '',
        type: 'success',
        isVisible: false
    });

    const showToast = (message: string, type: ToastType = 'success') => {
        setToast({ message, type, isVisible: true });
    };

    const handleProductSuccess = () => {
        showToast(editingProduct ? 'Product updated successfully!' : 'Product created successfully!', 'success');
        setRefreshTrigger(prev => prev + 1);
        setEditingProduct(null);
        // Re-open management modal to show updated list
        setShowProductManagement(true);
    };

    const handleCloseForm = () => {
        setShowProductForm(false);
        setEditingProduct(null);
        // If editing was cancelled, return to management list
        if (editingProduct) {
            setShowProductManagement(true);
        }
    };

    const handleEditProduct = (product: any) => {
        setEditingProduct(product);
        setShowProductManagement(false); // Close list to show form
        setShowProductForm(true);
    };

    return (
        <div className="flex min-h-screen flex-col">
            {/* In real app, Admin would have a different Layout/Navbar */}
            <Navbar />
            <main className="flex-grow bg-gray-100 py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="md:flex md:items-center md:justify-between">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Portal</h1>
                        <div className="flex space-x-3">
                            <Button variant="outline" onClick={() => {
                                setEditingProduct(null);
                                setShowProductForm(true);
                            }}>
                                Add New Product
                            </Button>
                            <Button variant="outline" onClick={() => setShowProductManagement(true)}>
                                Manage Products
                            </Button>
                            <Button onClick={() => setShowUserManagement(true)}>Manage Users</Button>
                            <Button
                                onClick={async () => {
                                    await fetch('/api/auth/logout', { method: 'POST' });
                                    window.location.href = '/admin/login';
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-500"
                            >
                                Logout
                            </Button>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
                        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                            <dt className="truncate text-sm font-medium text-gray-500">Total Pending Orders</dt>
                            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{stats.totalPendingOrders}</dd>
                        </div>
                        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                            <dt className="truncate text-sm font-medium text-gray-500">Revenue (Monthly)</dt>
                            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                                {new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(stats.monthlyRevenue)}
                            </dd>
                        </div>
                        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                            <dt className="truncate text-sm font-medium text-gray-500">Active Buyers</dt>
                            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{stats.activeBuyers}</dd>
                        </div>
                    </div>

                    <div className="mt-10">
                        <h2 className="text-lg font-medium text-gray-900">Order Management</h2>
                        <div className="mt-4">
                            <AdminOrderTable />
                        </div>
                    </div>
                </div>
            </main>
            <Footer />

            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
            />

            {showProductForm && (
                <ProductForm
                    onClose={handleCloseForm}
                    onSuccess={handleProductSuccess}
                    initialData={editingProduct}
                />
            )}

            {showProductManagement && (
                <ProductManagementModal
                    onClose={() => setShowProductManagement(false)}
                    onEdit={handleEditProduct}
                    refreshTrigger={refreshTrigger}
                />
            )}

            {showUserManagement && (
                <UserManagementModal
                    onClose={() => setShowUserManagement(false)}
                />
            )}
        </div>
    );
}
