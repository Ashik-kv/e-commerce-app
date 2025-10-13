// src/pages/CartPage.jsx
import React from 'react';
import { useAppContext } from '../context/AppContext';

export default function CartPage() {
    const { cart, removeFromCart, updateCartItemQuantity, navigate } = useAppContext();

    const handleCheckout = () => {
        if (cart && cart.cartItems.length > 0) {
            navigate('checkout');
        }
    };

    if (!cart || cart.cartItems.length === 0) {
        return (
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
                <button onClick={() => navigate('home')} className="text-blue-500 hover:underline">
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="cart-page container mx-auto p-4 md:p-8">
            <h2 className="text-3xl font-bold mb-6">Your Cart</h2>
            <div className="bg-white shadow-md rounded-lg p-6">
                {cart.cartItems.map((item) => {
                    // MODIFICATION: Switched from using the 'images' array to the direct 'mainImage' object.
                    const imageUrl = item.product?.mainImage
                        ? `data:${item.product.mainImage.imageType};base64,${item.product.mainImage.imageFile}`
                        : 'https://via.placeholder.com/150';

                    return (
                        <div
                            key={item.id}
                            className="cart-item flex items-center justify-between border-b py-4"
                        >
                            <div className="flex items-center">
                                <img
                                    src={imageUrl}
                                    alt={item.productName}
                                    className="w-20 h-20 object-cover rounded mr-4"
                                />
                                <div>
                                    <h3 className="text-lg font-semibold">{item.productName}</h3>
                                    <p className="text-gray-600">
                                        ₹{item.price.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <button
                                    onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded-l"
                                >
                                    -
                                </button>
                                <p className="px-4 py-1 border-t border-b">{item.quantity}</p>
                                <button
                                    onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded-r"
                                >
                                    +
                                </button>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded ml-4 hover:bg-red-600"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="cart-summary mt-6 text-right">
                <h3 className="text-2xl font-bold">
                    Total: ₹{cart.totalPrice.toLocaleString()}
                </h3>
                <button
                    onClick={handleCheckout}
                    className="bg-green-500 text-white px-6 py-2 rounded mt-4 hover:bg-green-600"
                >
                    Proceed to Checkout
                </button>
            </div>
        </div>
    );
}