import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

export default function OrderHistoryPage() {
    const { orders, fetchOrders, navigate, cancelOrder } = useAppContext();

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleCancelOrder = (e, orderId) => {
        e.stopPropagation(); // Prevent navigation when clicking the button
        if (window.confirm("Are you sure you want to cancel this order?")) {
            cancelOrder(orderId);
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
            {orders.length === 0 ? (
                <p>You have no past orders.</p>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order.orderId} className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex justify-between items-start cursor-pointer" onClick={() => navigate('order-detail', order.orderId)}>
                                <div>
                                    <p className="text-lg font-semibold">Order #{order.orderId}</p>
                                    <p className="text-sm text-gray-500">Placed on: {new Date(order.orderDate).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold">₹{order.totalAmount.toLocaleString()}</p>
                                    <p className={`text-sm font-semibold ${
                                        order.orderStatus === 'DELIVERED' ? 'text-green-600' :
                                            order.orderStatus === 'CANCELLED' ? 'text-red-600' : 'text-yellow-600'}`
                                    }>{order.orderStatus}</p>
                                </div>
                            </div>
                            {order.orderStatus === 'PENDING' && (
                                <div className="text-right mt-4">
                                    <button
                                        onClick={(e) => handleCancelOrder(e, order.orderId)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 text-sm"
                                    >
                                        Cancel Order
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}