import React, { useEffect, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';

export default function ManageOrdersPage() {
    const { allOrders, fetchAllOrders, updateOrderStatus } = useAppContext();

    useEffect(() => {
        fetchAllOrders();
    }, []);

    const handleStatusChange = (orderId, status) => {
        updateOrderStatus(orderId, status);
    };

    const sortedOrders = useMemo(() => {
        if (!allOrders) return [];
        return [...allOrders].sort((a, b) => {
            const isACompleted = a.orderStatus === 'CANCELLED' || a.orderStatus === 'DELIVERED';
            const isBCompleted = b.orderStatus === 'CANCELLED' || b.orderStatus === 'DELIVERED';

            if (isACompleted && !isBCompleted) {
                return 1;
            }
            if (!isACompleted && isBCompleted) {
                return -1;
            }

            return new Date(b.orderDate) - new Date(a.orderDate);
        });
    }, [allOrders]);

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <table className="w-full text-left">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="p-3">Order ID</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Total</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortedOrders.map(order => (
                        <tr key={order.orderId} className="border-b">
                            <td className="p-3">{order.orderId}</td>
                            <td className="p-3">{order.user.email}</td>
                            <td className="p-3">{new Date(order.orderDate).toLocaleDateString()}</td>
                            <td className="p-3">₹{order.totalAmount.toLocaleString()}</td>
                            <td className="p-3">{order.orderStatus}</td>
                            <td className="p-3">
                                <select
                                    value={order.orderStatus}
                                    onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                                    disabled={order.orderStatus === 'CANCELLED' || order.orderStatus === 'DELIVERED'}
                                    className="p-2 border rounded bg-white text-black disabled:bg-gray-200 disabled:cursor-not-allowed"
                                >
                                    <option value="PENDING">Pending</option>
                                    <option value="PROCESSING">Processing</option>
                                    <option value="SHIPPED">Shipped</option>
                                    <option value="DELIVERED">Delivered</option>
                                    <option value="CANCELLED">Cancelled</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}