import React, { useState, useEffect, createContext, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext);
};

export const AppProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [currentPage, setCurrentPage] = useState('home');
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [cart, setCart] = useState(null);
    const [orders, setOrders] = useState([]);
    const [addresses, setAddresses] = useState([]);

    const API_BASE_URL = 'http://localhost:8080';

    const navigate = (page, productId = null) => {
        setCurrentPage(page);
        setSelectedProductId(productId);
    };

    const logout = async () => {
        const token = localStorage.getItem('authToken');
        console.log('🔓 Logging out, token exists:', !!token);

        if (token) {
            try {
                await fetch(`${API_BASE_URL}/logout`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                console.log('✅ Backend logout successful');
            } catch (error) {
                console.error("❌ Backend logout call failed:", error);
            }
        }
        setCurrentUser(null);
        localStorage.removeItem('authToken');
        setCart(null);
        setOrders([]);
        setAddresses([]);
        navigate('home');
    };

    const authenticatedFetch = async (endpoint, options = {}) => {
        const token = localStorage.getItem('authToken');

        console.group(`🌐 Authenticated Fetch: ${endpoint}`);
        console.log('Token exists:', !!token);
        console.log('Token value:', token ? `${token.substring(0, 20)}...` : 'null');
        console.log('Current user:', currentUser);

        const headers = { ...options.headers };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
            console.log('✅ Authorization header added');
        } else {
            console.warn('⚠️ No token found in localStorage!');
        }

        if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
            options.body = JSON.stringify(options.body);
            headers['Content-Type'] = 'application/json';
        }

        console.log('Request headers:', headers);
        console.log('Request body:', options.body);

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            if (response.status === 401 || response.status === 403) {
                console.error('🚫 Authentication failed! Status:', response.status);
                const errorText = await response.text();
                console.error('Error response:', errorText);
                logout();
                throw new Error('Authentication failed. Please log in again.');
            }

            console.groupEnd();
            return response;
        } catch (error) {
            console.error('❌ Fetch error:', error);
            console.groupEnd();
            throw error;
        }
    };

    const fetchCart = async () => {
        if (!localStorage.getItem('authToken')) {
            console.log('⏭️ Skipping cart fetch - no token');
            return;
        }
        try {
            const response = await authenticatedFetch('/api/cart');
            if (response.ok) setCart(await response.json());
            else setCart({ cartItems: [], totalPrice: 0 });
        } catch (error) {
            console.error("Failed to fetch cart:", error.message);
        }
    };

    const fetchAddresses = async () => {
        if (!localStorage.getItem('authToken')) {
            console.log('⏭️ Skipping addresses fetch - no token');
            return;
        }
        try {
            console.log('📍 Fetching addresses...');
            const response = await authenticatedFetch('/api/addresses');
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Addresses fetched:', data);
                setAddresses(data);
            }
        } catch (error) {
            console.error("Failed to fetch addresses:", error.message);
        }
    };

    const fetchOrders = async () => {
        if (!localStorage.getItem('authToken')) {
            console.log('⏭️ Skipping orders fetch - no token');
            return;
        }
        try {
            const response = await authenticatedFetch('/api/orders');
            if (response.ok) setOrders(await response.json());
        } catch (error) {
            console.error("Failed to fetch orders:", error.message);
        }
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            console.group('🚀 Initial Data Load');

            try {
                const productsResponse = await fetch(`${API_BASE_URL}/api/products`);
                if (productsResponse.ok) {
                    const productsData = await productsResponse.json();
                    console.log('✅ Products loaded:', productsData.length);
                    setProducts(productsData);
                }

                const categoriesResponse = await fetch(`${API_BASE_URL}/api/categories`);
                if (categoriesResponse.ok) {
                    const categoriesData = await categoriesResponse.json();
                    console.log('✅ Categories loaded:', categoriesData.length);
                    setCategories(categoriesData);
                }

                const token = localStorage.getItem('authToken');
                console.log('Token in storage:', !!token);

                if (token) {
                    try {
                        const decodedToken = jwtDecode(token);
                        console.log('Decoded token:', decodedToken);
                        console.log('Token expiry:', new Date(decodedToken.exp * 1000));
                        console.log('Current time:', new Date());

                        if (decodedToken.exp * 1000 < Date.now()) {
                            console.warn('⚠️ Token expired!');
                            logout();
                        } else {
                            console.log('✅ Token valid, setting user');
                            setCurrentUser({
                                email: decodedToken.sub,
                                roles: decodedToken.roles || []
                            });
                        }
                    } catch (decodeError) {
                        console.error('❌ Error decoding token:', decodeError);
                        logout();
                    }
                }
            } catch (error) {
                console.error("❌ Initial data load failed:", error);
                if (localStorage.getItem('authToken')) logout();
            } finally {
                setIsLoading(false);
                console.groupEnd();
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        console.log('👤 User changed:', currentUser);
        if (currentUser) {
            console.log('Fetching user-specific data...');
            fetchCart();
            fetchAddresses();
            fetchOrders();
        }
    }, [currentUser]);

    const login = async (email, password) => {
        console.group('🔐 Login Attempt');
        console.log('Email:', email);

        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            console.log('Login response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Login failed:', errorText);
                console.groupEnd();
                return false;
            }

            const data = await response.json();
            console.log('Login response data:', data);

            if (data.token) {
                localStorage.setItem('authToken', data.token);
                console.log('✅ Token saved to localStorage');

                const decodedToken = jwtDecode(data.token);
                console.log('Decoded token:', decodedToken);

                setCurrentUser({
                    email: decodedToken.sub,
                    roles: decodedToken.roles || []
                });

                navigate('home');
                console.groupEnd();
                return true;
            } else {
                console.error('❌ No token in response');
                console.groupEnd();
                return false;
            }
        } catch (error) {
            console.error("❌ Login failed:", error);
            console.groupEnd();
            return false;
        }
    };

    const register = async (userData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                body: JSON.stringify(userData),
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) {
                const errorBody = await response.json();
                return { success: false, error: errorBody.message || "Registration failed." };
            }
            navigate('login');
            return { success: true };
        } catch (error) {
            return { success: false, error: "An unexpected error occurred." };
        }
    };

    const addToCart = async (productId, quantity = 1) => {
        if (!currentUser) return navigate('login');
        try {
            const response = await authenticatedFetch('/api/cart', {
                method: 'POST',
                body: { productId, quantity }
            });
            if (response.ok) setCart(await response.json());
        } catch (error) {
            console.error("Failed to add to cart:", error.message);
        }
    };

    const removeFromCart = async (cartItemId) => {
        try {
            const response = await authenticatedFetch(`/api/cart/${cartItemId}`, { method: 'DELETE' });
            if (response.ok) await fetchCart();
        } catch (error) {
            console.error("Failed to remove from cart:", error.message);
        }
    };

    const updateCartItemQuantity = async (cartItemId, quantity) => {
        if (quantity <= 0) return await removeFromCart(cartItemId);
        try {
            const response = await authenticatedFetch(`/api/cart/${cartItemId}?quantity=${quantity}`, {
                method: 'PUT'
            });
            if (response.ok) await fetchCart();
        } catch (error) {
            console.error("Failed to update cart quantity:", error.message);
        }
    };

    const addAddress = async (addressData) => {
        console.group('📍 Adding Address');
        console.log('Address data:', addressData);
        console.log('Current user:', currentUser);
        console.log('Token in storage:', !!localStorage.getItem('authToken'));

        try {
            const response = await authenticatedFetch('/api/addresses', {
                method: 'POST',
                body: addressData
            });

            console.log('Add address response status:', response.status);

            if (response.ok) {
                console.log('✅ Address added successfully');
                await fetchAddresses();
                console.groupEnd();
                return true;
            }

            const errorText = await response.text();
            console.error('❌ Failed to add address:', errorText);
            console.groupEnd();
            return false;
        } catch (error) {
            console.error("❌ Failed to add address:", error.message);
            console.groupEnd();
            return false;
        }
    };

    const createOrder = async (shippingAddressId) => {
        try {
            const response = await authenticatedFetch('/api/orders', {
                method: 'POST',
                body: { shippingAddressId }
            });
            if (response.ok) {
                await fetchCart();
                await fetchOrders();
                return true;
            }
            return false;
        } catch (error) {
            console.error("Failed to create order:", error.message);
            return false;
        }
    };

    const addProduct = async (productData, images) => {
        try {
            const formData = new FormData();
            formData.append('product', new Blob([JSON.stringify(productData)], { type: 'application/json' }));
            images.forEach(image => formData.append('images', image));
            const response = await authenticatedFetch('/api/seller/products', {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                const newProduct = await response.json();
                setProducts(prev => [...prev, newProduct]);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Failed to add product:", error.message);
            return false;
        }
    };

    const updateProduct = async (productId, productDetails) => {
        try {
            const response = await authenticatedFetch(`/api/seller/products/${productId}`, {
                method: 'PUT',
                body: productDetails
            });
            if (response.ok) {
                const returnedProduct = await response.json();
                setProducts(products.map(p => p.id === returnedProduct.id ? returnedProduct : p));
                return true;
            }
            return false;
        } catch (error) {
            console.error("Failed to update product:", error.message);
            return false;
        }
    };

    const deleteProduct = async (productId) => {
        try {
            const response = await authenticatedFetch(`/api/seller/products/${productId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setProducts(products.filter(p => p.id !== productId));
            }
        } catch (error) {
            console.error("Failed to delete product:", error.message);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await authenticatedFetch('/api/admin/users');
            if (response.ok) {
                setUsers(await response.json());
            }
        } catch (error) {
            console.error("Failed to fetch users:", error.message);
        }
    };

    const promoteUserToSeller = async (userId) => {
        try {
            const response = await authenticatedFetch(`/api/admin/users/${userId}/promote`, {
                method: 'PUT'
            });

            if (response.ok) {
                setUsers(users.map(user =>
                    user.id === userId ? { ...user, role: 'ROLE_SELLER' } : user
                ));
                return true;
            }
            return false;
        } catch (error) {
            console.error("Failed to promote user:", error.message);
            return false;
        }
    };

    const value = {
        users, products, categories, currentUser, currentPage, selectedProductId,
        isLoading, cart, orders, addresses,
        login, register, logout, addProduct, updateProduct, deleteProduct, navigate,
        fetchUsers, promoteUserToSeller, addToCart, removeFromCart, updateCartItemQuantity,
        fetchAddresses, addAddress, fetchOrders, createOrder
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};