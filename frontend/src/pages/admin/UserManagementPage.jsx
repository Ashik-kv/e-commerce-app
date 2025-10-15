import React, { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';

export default function UserManagementPage() {
    const { users, currentUser, navigate, fetchUsers, demoteSeller, deleteUser } = useAppContext();

    useEffect(() => {
        if (currentUser?.roles?.includes('ROLE_ADMIN')) {
            fetchUsers();
        }
    }, [currentUser]);

    if (!currentUser || !currentUser.roles?.includes('ROLE_ADMIN')) {
        return <div className="text-center"><p className="text-red-500">Access Denied.</p><button onClick={() => navigate('home')} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">Go to Home</button></div>;
    }

    const handleDemoteClick = async (userId) => {
        const result = await demoteSeller(userId);
        if (!result.success) {
            alert(`Failed to demote seller: ${result.error}`);
        }
    };

    const handleDeleteClick = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            const result = await deleteUser(userId);
            if (!result.success) {
                alert(`Failed to delete user: ${result.error}`);
            }
        }
    };

    return (
        <div>
            <h1 className="text-4xl font-extrabold text-gray-800">User Management</h1>
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="p-3">ID</th>
                            <th className="p-3">First Name</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Role</th>
                            <th className="p-3">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users && users.map(user => (
                            <tr key={user.id} className="border-b">
                                <td className="p-3">{user.id}</td>
                                <td className="p-3">{user.firstName}</td>
                                <td className="p-3">{user.email}</td>
                                <td className="p-3"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'ROLE_ADMIN' ? 'bg-red-200 text-red-800' : user.role === 'ROLE_SELLER' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>{user.role}</span></td>
                                <td className="p-3">
                                    {user.role === 'ROLE_SELLER' && (
                                        <button
                                            onClick={() => handleDemoteClick(user.id)}
                                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-xs font-semibold mr-2"
                                        >
                                            Demote to User
                                        </button>
                                    )}
                                    {user.role !== 'ROLE_ADMIN' && (
                                        <button
                                            onClick={() => handleDeleteClick(user.id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs font-semibold"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}