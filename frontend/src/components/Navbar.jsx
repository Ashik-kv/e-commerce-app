import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { useDebouncedValue } from '../hooks/useDebouncedValue';


export default function Navbar() {
    const { currentUser, navigate, logout, cart, filters, updateFilters, becomeSeller } = useAppContext();
    const [searchTerm, setSearchTerm] = useState(filters.keyword || "");
    const debouncedSearch = useDebouncedValue(searchTerm, 400);

    // State and ref for the profile dropdown
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Update global filters only when debounced value changes
    useEffect(() => {
        updateFilters({ keyword: debouncedSearch });
    }, [debouncedSearch]);

    // Effect to handle clicks outside the dropdown to close it
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    const handleBecomeSeller = () => {
        becomeSeller();
    };


    return (
        <nav className="bg-white shadow-md">
            <div className="px-4 md:px-8">
                <div className="flex justify-between items-center py-2">
                    {/* Left side: Brand */}
                    <div className="flex items-center">
                        <div
                            className="text-2xl font-bold text-blue-600 cursor-pointer"
                            onClick={() => navigate("home")}
                        >
                            SpringCart
                        </div>
                    </div>


                    {/* Middle: Search Bar */}
                    <div className="flex-1 max-w-2xl mx-4">
                        <input
                            type="text"
                            placeholder="Search for Products, Brands and More"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Right side: Actions */}
                    <div className="flex items-center space-x-2">
                        {/* Become a Seller Button - only for regular users */}
                        {currentUser && currentUser.roles?.includes('ROLE_USER') && !currentUser.roles.includes('ROLE_SELLER') && !currentUser.roles.includes('ROLE_ADMIN') && (
                            <button onClick={handleBecomeSeller} className="text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium transition hidden md:block">
                                Become a Seller
                            </button>
                        )}


                        {/* Cart Button - Not for sellers or admins */}
                        {!currentUser?.roles?.includes('ROLE_SELLER') && !currentUser?.roles?.includes('ROLE_ADMIN') && (
                            <button onClick={() => navigate('cart')} className="flex items-center text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium transition">
                                <svg className="w-6 h-6 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                Cart {cart && cart.cartItems.length > 0 && `(${cart.cartItems.length})`}
                            </button>
                        )}


                        {/* Login/Profile Dropdown */}
                        {currentUser ? (
                            <div className="relative" ref={dropdownRef}>
                                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm font-medium">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                    <span>{currentUser.email.split('@')[0]}</span>
                                    <svg className={`w-4 h-4 ml-1 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                                        <button onClick={() => { navigate('profile'); setIsDropdownOpen(false); }} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            My Profile
                                        </button>

                                        {/* Saved Addresses - Only for regular users */}
                                        {!currentUser?.roles?.includes('ROLE_SELLER') && !currentUser?.roles?.includes('ROLE_ADMIN') && (
                                            <button onClick={() => { navigate('addresses'); setIsDropdownOpen(false); }} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                Saved Addresses
                                            </button>
                                        )}

                                        {/* Orders - Not for sellers */}
                                        {!currentUser?.roles?.includes('ROLE_SELLER') && !currentUser?.roles?.includes('ROLE_ADMIN') &&(
                                            <button onClick={() => { navigate('order-history'); setIsDropdownOpen(false); }} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                Orders
                                            </button>
                                        )}

                                        {/* Manage Orders - Only for sellers */}
                                        {currentUser?.roles?.includes('ROLE_SELLER') && (
                                            <button onClick={() => { navigate('manage-orders'); setIsDropdownOpen(false); }} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                Manage Orders
                                            </button>
                                        )}

                                        {/* Admin Dashboard Links */}
                                        {currentUser?.roles?.includes('ROLE_ADMIN') && (
                                            <>
                                                <button onClick={() => { navigate('admin/seller-requests'); setIsDropdownOpen(false); }} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                    Seller Requests
                                                </button>
                                                <button onClick={() => { navigate('admin/user-management'); setIsDropdownOpen(false); }} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                    User Management
                                                </button>
                                            </>
                                        )}

                                        <div className="border-t my-1"></div>
                                        <button onClick={logout} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button onClick={() => navigate('login')} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm font-medium">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}