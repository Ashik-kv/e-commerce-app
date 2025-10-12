// src/components/Navbar.jsx
import React from 'react';
import { useAppContext } from '../context/AppContext';

export default function Navbar() {
    const { currentUser, navigate, logout, cart } = useAppContext();

    const navLinkStyle = "text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition";

    return (
        <nav className="bg-white shadow-md">
            <div className="px-4 md:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="text-2xl font-bold text-blue-600 cursor-pointer" onClick={() => navigate('home')}>
                        SpringCart
                    </div>
                    <div className="flex items-center space-x-2 md:space-x-4">
                        <button onClick={() => navigate('home')} className={navLinkStyle}>Home</button>
                        <button onClick={() => navigate('cart')} className={navLinkStyle}>
                            Cart {cart && cart.cartItems.length > 0 && `(${cart.cartItems.length})`}
                        </button>
                        {currentUser ? (
                            <>
                                <button onClick={() => navigate('order-history')} className={navLinkStyle}>My Orders</button>
                                {currentUser.roles?.includes('ROLE_SELLER') && (
                                    <button onClick={() => navigate('seller')} className={navLinkStyle}>Seller</button>
                                )}
                                {currentUser.roles?.includes('ROLE_ADMIN') && (
                                    <button onClick={() => navigate('admin')} className={navLinkStyle}>Admin</button>
                                )}
                                <span className="text-gray-700 hidden md:block">Welcome, {currentUser.email.split('@')[0]}!</span>
                                <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition text-sm font-medium">Logout</button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => navigate('login')} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition text-sm font-medium">Login</button>
                                <button onClick={() => navigate('register')} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition text-sm font-medium">Register</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}