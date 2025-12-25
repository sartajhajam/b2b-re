'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { UserTable } from './UserTable';
import { UserForm } from './UserForm';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'BUYER' | 'ADMIN';
    company_name: string;
    country: string;
    created_at: string;
}

interface UserManagementModalProps {
    onClose: () => void;
}

export const UserManagementModal: React.FC<UserManagementModalProps> = ({ onClose }) => {
    const [showUserForm, setShowUserForm] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleAddUser = () => {
        setEditingUser(null);
        setShowUserForm(true);
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setShowUserForm(true);
    };

    const handleFormClose = () => {
        setShowUserForm(false);
        setEditingUser(null);
    };

    const handleFormSuccess = () => {
        setRefreshTrigger(prev => prev + 1);
        handleFormClose();
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                        <div className="flex items-center space-x-3">
                            <Button onClick={handleAddUser}>
                                Add User
                            </Button>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="p-6 overflow-y-auto flex-grow">
                        <UserTable
                            onEdit={handleEditUser}
                            refreshTrigger={refreshTrigger}
                        />
                    </div>
                </div>
            </div>

            {showUserForm && (
                <UserForm
                    user={editingUser}
                    onClose={handleFormClose}
                    onSuccess={handleFormSuccess}
                />
            )}
        </>
    );
};
