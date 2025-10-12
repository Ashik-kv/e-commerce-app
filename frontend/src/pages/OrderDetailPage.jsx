// src/pages/OrderDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

export default function OrderDetailPage({ orderId }) {
    const { orders } = useAppContext();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const foundOrder = orders.find(o => o.orderId === orderId);
        setOrder(foundOrder);
    }, [orderId, orders]);


    if (!order) {
        return <div className="text-center">Loading order details...</div>;
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6">Order Details</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <div>
                        <p className="text-xl font-semibold">Order #{order.orderId}</p>
                        <p className="text-sm text-gray-500">Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold">Total: ₹{order.totalAmount.toLocaleString()}</p>
                        <p className={`font-semibold ${order.orderStatus === 'DELIVERED' ? 'text-green-600' : 'text-yellow-600'}`}>{order.orderStatus}</p>
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Items</h2>
                    {order.orderItems.map(item => (
                        <div key={item.id} className="flex justify-between items-center py-2 border-b">
                            <div>
                                <p className="font-semibold">{item.productName}</p>
                                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                            </div>
                            <p>₹{item.subtotal.toLocaleString()}</p>
                        </div>
                    ))}
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                    <div className="bg-gray-50 p-4 rounded-md">
                        <p className="font-semibold">{order.shippingAddress.name}</p>
                        <p>{order.shippingAddress.addressLine1}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pinCode}</p>
                        <p>Phone: {order.shippingAddress.phoneNumber}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}