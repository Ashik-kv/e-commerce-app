// src/pages/CartPage.jsx

import React, { useContext } from 'react'; // Corrected import
import { AppContext } from '../context/AppContext'; // Corrected import

export default function CartPage() {
  const { cart, total, removeFromCart, navigate } = useContext(AppContext); // Corrected to use AppContext

  const handleCheckout = () => {
    if (cart.length > 0) {
      navigate('checkout');
    }
  };

  return (
    <div className="cart-page container mx-auto p-4 md:p-8">
      <h2 className="text-3xl font-bold mb-6">Your Cart</h2>
      {cart.length === 0 ? (
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
          <button onClick={() => navigate('home')} className="text-blue-500 hover:underline">
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white shadow-md rounded-lg p-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="cart-item flex items-center justify-between border-b py-4"
              >
                <div className="flex items-center">
                  <img
                    src={
                        item.images && item.images[0]
                          ? `data:${item.images[0].imageType};base64,${item.images[0].imageFile}`
                          : 'https://via.placeholder.com/150'
                      }
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-gray-600">
                      ₹{item.discountedPrice.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <p className="text-lg font-semibold mr-4">
                    Quantity: {item.quantity}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary mt-6 text-right">
            <h3 className="text-2xl font-bold">
              Total: ₹{total.toLocaleString()}
            </h3>
            <button
              onClick={handleCheckout}
              className="bg-green-500 text-white px-6 py-2 rounded mt-4 hover:bg-green-600"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}