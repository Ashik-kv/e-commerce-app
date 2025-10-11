// src/pages/CheckoutPage.jsx

import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

const CheckoutPage = () => {
  const { cart, createOrder, navigate } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    try {
      // In a real app, you would process the payment here
      alert('Order placed successfully!');
      navigate('home'); // Navigate to home after order
    } catch (error) {
      alert('Failed to place order. Please try again.');
      console.error('Error placing order:', error);
    }
  };

  if (!cart || cart.length === 0) {
    return (
        <div className="container mx-auto p-4 md:p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        </div>
    );
  }

  const totalPrice = cart.reduce((total, item) => total + (item.discountedPrice * item.quantity), 0);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between border-b py-2">
            <span>
              {item.name} (x{item.quantity})
            </span>
            <span>₹{(item.discountedPrice * item.quantity).toLocaleString()}</span>
          </div>
        ))}
        <div className="mt-4 text-right">
          <h3 className="text-2xl font-bold">
            Total: ₹{totalPrice.toLocaleString()}
          </h3>
        </div>
        <form onSubmit={handlePlaceOrder} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="form-group col-span-1 md:col-span-2">
              <textarea
                name="address"
                placeholder="Shipping Address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="cardNumber"
                placeholder="Card Number"
                value={formData.cardNumber}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="form-row grid grid-cols-2 gap-4">
              <input
                type="text"
                name="expiryDate"
                placeholder="MM/YY"
                value={formData.expiryDate}
                onChange={handleInputChange}
                required
                className="p-2 border rounded"
              />
              <input
                type="text"
                name="cvv"
                placeholder="CVV"
                value={formData.cvv}
                onChange={handleInputChange}
                required
                className="p-2 border rounded"
              />
            </div>
          </div>
          <div className="mt-4 text-right">
            <button
              type="submit"
              className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600"
            >
              Place Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;