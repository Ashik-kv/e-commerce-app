import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';

export default function AdminDashboard() {
    const { users, products, currentUser, navigate, fetchUsers, promoteUserToSeller, getSellerRequests, approveSellerRequest, rejectSellerRequest } = useAppContext();
    const [sellerRequests, setSellerRequests] = useState([]);

    useEffect(() => {
        if (currentUser?.roles?.includes('ROLE_ADMIN')) {
            fetchUsers();
            const fetchRequests = async () => {
                const requests = await getSellerRequests();
                setSellerRequests(requests);
            };
            fetchRequests();
        }
    }, [currentUser]);

    if (!currentUser || !currentUser.roles?.includes('ROLE_ADMIN')) {
        return <div className="text-center"><p className="text-red-500">Access Denied.</p><button onClick={() => navigate('home')} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">Go to Home</button></div>;
    }

    const handlePromoteClick = async (userId) => {
        const result = await promoteUserToSeller(userId);
        if (!result.success) {
            alert(`Failed to promote user: ${result.error}`);
        }
    };

    const handleApprove = async (requestId) => {
        await approveSellerRequest(requestId);
        const requests = await getSellerRequests();
        setSellerRequests(requests);
    };

    const handleReject = async (requestId) => {
        await rejectSellerRequest(requestId);
        const requests = await getSellerRequests();
        setSellerRequests(requests);
    };

    return (
        <div className="space-y-12">
            <h1 className="text-4xl font-extrabold text-gray-800">Admin Dashboard</h1>

            <div>
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Seller Requests</h2>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                            <tr className="bg-gray-100">
                                <th className="p-3">User Email</th>
                                <th className="p-3">Request Date</th>
                                <th className="p-3">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {sellerRequests.map(request => (
                                <tr key={request.id} className="border-b">
                                    <td className="p-3">{request.user.email}</td>
                                    <td className="p-3">{new Date(request.createdAt).toLocaleDateString()}</td>
                                    <td className="p-3">
                                        <button onClick={() => handleApprove(request.id)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-xs font-semibold mr-2">Approve</button>
                                        <button onClick={() => handleReject(request.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs font-semibold">Reject</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-gray-700 mb-4">User Management</h2>
                <div className="bg-white p-6 rounded-lg shadow-md">
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
                                        {user.role !== 'ROLE_SELLER' && user.role !== 'ROLE_ADMIN' && (
                                            <button
                                                onClick={() => handlePromoteClick(user.id)}
                                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xs font-semibold"
                                            >
                                                Promote to Seller
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

            <div>
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Product Management</h2>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    {products.length > 0 ? (
                        <div className="space-y-4">
                            {products.map(product => (
                                <div key={product.id} className="flex items-center justify-between p-4 border rounded-md">
                                    <div>
                                        <p className="font-bold">{product.name}</p>
                                        <p className="text-sm text-gray-500">Seller Email: {product.seller?.email || 'N/A'}</p>
                                        {product.category && (
                                            <p className="text-xs text-gray-400">Category: {product.category.categoryName}</p>
                                        )}
                                    </div>
                                    <button onClick={() => alert("Admin delete action not implemented in backend yet.")} className="bg-gray-400 text-white px-3 py-1 rounded cursor-not-allowed">Delete Product</button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">No products available.</p>
                    )}
                </div>
            </div>
        </div>
    );
}