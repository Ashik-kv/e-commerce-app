import React, { useEffect, useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';

export default function AdminDashboard() {
    const { currentUser, navigate, users, products, allOrders, fetchUsers, fetchAllOrders, getSellerRequests } = useAppContext();
    const [sellerRequests, setSellerRequests] = useState([]);

    useEffect(() => {
        if (currentUser?.roles?.includes('ROLE_ADMIN')) {
            fetchUsers();
            fetchAllOrders();
            const fetchRequests = async () => {
                const requests = await getSellerRequests();
                setSellerRequests(requests);
            };
            fetchRequests();
        }
    }, [currentUser]);

    const topSellingProducts = useMemo(() => {
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);

        const sales = allOrders
            .filter(order => new Date(order.orderDate) > lastWeek)
            .flatMap(order => order.orderItems)
            .reduce((acc, item) => {
                acc[item.productName] = (acc[item.productName] || 0) + item.quantity;
                return acc;
            }, {});

        return Object.entries(sales)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([name, quantity]) => ({ name, quantity }));
    }, [allOrders]);


    if (!currentUser || !currentUser.roles?.includes('ROLE_ADMIN')) {
        return <div className="text-center"><p className="text-red-500">Access Denied.</p><button onClick={() => navigate('home')} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">Go to Home</button></div>;
    }

    const recentSellerRequests = sellerRequests.slice(0, 5);

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-extrabold text-gray-800">Admin Dashboard</h1>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-600">Total Users</h3>
                    <p className="text-3xl font-bold">{users.length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-600">Total Products</h3>
                    <p className="text-3xl font-bold">{products.length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-600">Total Orders</h3>
                    <p className="text-3xl font-bold">{allOrders.length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-600">Pending Seller Requests</h3>
                    <p className="text-3xl font-bold">{sellerRequests.length}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Selling Products */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">Top Selling Products (Last 7 Days)</h2>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        {topSellingProducts.length > 0 ? (
                            <ul className="space-y-4">
                                {topSellingProducts.map(product => (
                                    <li key={product.name} className="flex justify-between items-center">
                                        <span className="font-semibold">{product.name}</span>
                                        <span className="text-gray-600">Sold: {product.quantity}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-gray-500">No sales in the last 7 days.</p>
                        )}
                    </div>
                </div>

                {/* Pending Seller Requests */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">Pending Seller Requests</h2>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        {recentSellerRequests.length > 0 ? (
                            <ul className="space-y-4">
                                {recentSellerRequests.map(request => (
                                    <li key={request.id} className="flex justify-between items-center">
                                        <span className="font-semibold">{request.user.email}</span>
                                        <span className="text-gray-500 text-sm">{new Date(request.createdAt).toLocaleDateString()}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-gray-500">No pending seller requests.</p>
                        )}
                        <div className="mt-6 text-right">
                            <button
                                onClick={() => navigate('admin/seller-requests')}
                                className="text-blue-500 hover:underline"
                            >
                                View All Requests
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}