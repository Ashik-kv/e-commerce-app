// src/pages/CheckoutPage.jsx
import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

const CheckoutPage = () => {
  // MODIFICATION: Using new state and functions for address selection.
  const { cart, addresses, createOrder, navigate, fetchAddresses, startAddressSelection, selectedAddressId, setSelectedAddressId } = useAppContext();

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!selectedAddressId) {
      alert('Please select a shipping address.');
      return;
    }
    try {
      const success = await createOrder(selectedAddressId);
      if (success) {
        alert('Order placed successfully!');
        navigate('order-history');
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      alert('Failed to place order. Please try again.');
      console.error('Error placing order:', error);
    }
  };

  if (!cart || cart.cartItems.length === 0) {
    return (
        <div className="container mx-auto p-4 md:p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
          <button onClick={() => navigate('home')} className="text-blue-500 hover:underline">
            Continue Shopping
          </button>
        </div>
    );
  }

  return (
      <div className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {cart.cartItems.map((item) => (
              <div key={item.id} className="flex justify-between border-b py-2">
                        <span>
                            {item.productName} (x{item.quantity})
                        </span>
                <span>₹{(item.price * item.quantity).toLocaleString()}</span>
              </div>
          ))}
          <div className="mt-4 text-right">
            <h3 className="text-2xl font-bold">
              Total: ₹{cart.totalPrice.toLocaleString()}
            </h3>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            {addresses.length > 0 ? (
                <select
                    // MODIFICATION: The value and onChange are now linked to the context state.
                    value={selectedAddressId}
                    onChange={(e) => setSelectedAddressId(e.target.value)}
                    className="w-full p-2 border rounded bg-white text-black"
                >
                  <option value="">Select an address</option>
                  {addresses.map(address => (
                      <option key={address.id} value={address.id}>
                        {address.name}, {address.addressLine1}, {address.city}, {address.state} - {address.pinCode}
                      </option>
                  ))}
                </select>
            ) : (
                <p>No addresses found. Please add an address.</p>
            )}
            {/* MODIFICATION: The "Manage Addresses" button now starts the selection flow. */}
            <button onClick={startAddressSelection} className="text-blue-500 hover:underline mt-2">
              Manage Addresses
            </button>
          </div>


          <div className="mt-6 text-right">
            <button
                onClick={handlePlaceOrder}
                className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
  );
};

export default CheckoutPage;