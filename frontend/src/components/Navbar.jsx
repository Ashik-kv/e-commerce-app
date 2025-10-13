import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useDebouncedValue } from '../hooks/useDebouncedValue';


export default function Navbar({ onMenuClick, isSidebarOpen }) {
    const { currentUser, navigate, logout, cart, filters, updateFilters } = useAppContext();
    const [searchTerm, setSearchTerm] = useState(filters.keyword || "");
    const navLinkStyle = "text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition";
    const debouncedSearch = useDebouncedValue(searchTerm, 400);

    // Update global filters only when debounced value changes
    React.useEffect(() => {
        updateFilters({ keyword: debouncedSearch });
    }, [debouncedSearch]);


    return (
        <nav className="bg-white shadow-md">
            <div className="px-4 md-px-8">
                <div className="flex justify-between items-center py-4">
                    {currentUser?.roles?.includes('ROLE_SELLER') && (
                        <button onClick={onMenuClick} className="p-2 mr-2 text-gray-600 hover:text-blue-600 bg-transparent">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isSidebarOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    )}
                    <div
                        className="text-2xl font-bold text-blue-600 cursor-pointer"
                        onClick={() => navigate("home")}
                    >
                        SpringCart
                    </div>

                    <div className="flex-1 max-w-md mx-4">
                        <input
                            type="text"
                            placeholder="Search for products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="flex items-center space-x-2 md:space-x-4">
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