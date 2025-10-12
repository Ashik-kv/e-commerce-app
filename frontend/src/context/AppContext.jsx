import React, { useState, useEffect, createContext, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [currentPage, setCurrentPage] = useState('home');
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [cart, setCart] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const API_BASE_URL = 'http://localhost:8080';

    const getAuthHeaders = () => {
        const token = localStorage.getItem('authToken');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    };

    const fetchAllProducts = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/products`);
            if (response.ok) setProducts(await response.json());
        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/categories`);
            if (response.ok) setCategories(await response.json());
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    };

    const fetchCart = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/cart`, { headers: getAuthHeaders() });
            if (response.ok) setCart(await response.json());
            else setCart({ cartItems: [] });
        } catch (error) {
            console.error("Failed to fetch cart:", error);
        }
    };

    const fetchAddresses = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/addresses`, { headers: getAuthHeaders() });
            if (response.ok) setAddresses(await response.json());
        } catch (error) {
            console.error("Failed to fetch addresses:", error);
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/orders`, { headers: getAuthHeaders() });
            if (response.ok) setOrders(await response.json());
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        }
    };


    useEffect(() => {
        const initialize = async () => {
            setIsLoading(true);
            await fetchAllProducts();
            await fetchCategories();
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    setCurrentUser({ email: decoded.sub, roles: decoded.roles || [] });
                    await fetchCart();
                    await fetchOrders();
                    await fetchAddresses();
                } catch (e) {
                    console.error("Invalid token:", e);
                    localStorage.removeItem('authToken');
                }
            }
            setIsLoading(false);
        };
        initialize();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            if (!response.ok) return false;

            const { token } = await response.json();
            localStorage.setItem('authToken', token);
            const decoded = jwtDecode(token);
            setCurrentUser({ email: decoded.sub, roles: decoded.roles || [] });

            await fetchCart();
            await fetchOrders();
            await fetchAddresses();

            navigate('home');
            return true;
        } catch (error) {
            console.error("Login failed:", error);
            return false;
        }
    };

    const logout = async () => {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                await fetch(`${API_BASE_URL}/logout`, {
                    method: 'POST',
                    headers: getAuthHeaders()
                });
            } catch (error) {
                console.error("Logout failed on backend:", error);
            }
        }
        localStorage.removeItem('authToken');
        setCurrentUser(null);
        setCart(null);
        setOrders([]);
        setAddresses([]);
        navigate('login');
    };

    const register = async (userData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            if (!response.ok) {
                const errorBody = await response.json();
                return { success: false, error: errorBody.message || "Registration failed." };
            }
            navigate('login');
            return { success: true };
        } catch (error) {
            console.error("Registration failed:", error);
            return { success: false, error: "An unexpected error occurred." };
        }
    };

    const addProduct = async (productData, images) => {
        const formData = new FormData();
        formData.append('product', new Blob([JSON.stringify(productData)], { type: 'application/json' }));
        images.forEach(image => formData.append('images', image));

        try {
            const response = await fetch(`${API_BASE_URL}/api/seller/products`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: formData
            });
            if (response.ok) {
                await fetchAllProducts();
                return true;
            }
            return false;
        } catch (error) {
            console.error("Failed to add product:", error);
            return false;
        }
    };

    const updateProduct = async (productId, productDetails) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/seller/products/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                body: JSON.stringify(productDetails)
            });
            if (response.ok) {
                await fetchAllProducts();
                return true;
            }
            return false;
        } catch (error) {
            console.error("Failed to update product:", error);
            return false;
        }
    };

    const deleteProduct = async (productId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/seller/products/${productId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (response.ok) {
                setProducts(products.filter(p => p.id !== productId));
            }
        } catch (error) {
            console.error("Failed to delete product:", error);
        }
    };

    const increaseStock = async (productId, quantity) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/seller/products/${productId}/stock/increase?quantity=${quantity}`, {
                method: 'PUT',
                headers: getAuthHeaders()
            });
            if (response.ok) await fetchAllProducts();
        } catch (error) {
            console.error("Failed to increase stock", error);
        }
    };

    const reduceStock = async (productId, quantity) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/seller/products/${productId}/stock/reduce?quantity=${quantity}`, {
                method: 'PUT',
                headers: getAuthHeaders()
            });
            if (response.ok) await fetchAllProducts();
        } catch (error) {
            console.error("Failed to reduce stock", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/users`, { headers: getAuthHeaders() });
            if (response.ok) setUsers(await response.json());
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    };

    const promoteUserToSeller = async (userId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/promote`, {
                method: 'PUT',
                headers: getAuthHeaders()
            });
            if (response.ok) {
                setUsers(users.map(user => user.id === userId ? { ...user, role: 'ROLE_SELLER' } : user));
                return true;
            }
            return false;
        } catch (error) {
            console.error("Failed to promote user:", error);
            return false;
        }
    };

    const addToCart = async (productId, quantity = 1) => {
        if (!currentUser) return navigate('login');
        try {
            const response = await fetch(`${API_BASE_URL}/api/cart`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                body: JSON.stringify({ productId, quantity })
            });
            if (response.ok) setCart(await response.json());
        } catch (error) {
            console.error("Failed to add to cart:", error);
        }
    };

    const removeFromCart = async (cartItemId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/cart/${cartItemId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (response.ok) await fetchCart();
        } catch (error) {
            console.error("Failed to remove from cart:", error);
        }
    };

    const updateCartItemQuantity = async (cartItemId, quantity) => {
        if (quantity < 1) return removeFromCart(cartItemId);
        try {
            const response = await fetch(`${API_BASE_URL}/api/cart/${cartItemId}?quantity=${quantity}`, {
                method: 'PUT',
                headers: getAuthHeaders()
            });
            if (response.ok) setCart(await response.json());
        } catch (error) {
            console.error("Failed to update cart quantity:", error);
        }
    };

    const addAddress = async (addressData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/addresses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                body: JSON.stringify(addressData)
            });
            if (response.ok) {
                await fetchAddresses();
                return true;
            }
            return false;
        } catch (error) {
            console.error("Failed to add address:", error);
            return false;
        }
    };

    const createOrder = async (shippingAddressId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                body: JSON.stringify({ shippingAddressId })
            });
            if (response.ok) {
                setCart({ cartItems: [] });
                await fetchOrders();
                return true;
            }
            return false;
        } catch (error) {
            console.error("Failed to create order:", error);
            return false;
        }
    };

    const cancelOrder = async (orderId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/cancel`, {
                method: 'PUT',
                headers: getAuthHeaders()
            });
            if (response.ok) {
                await fetchOrders();
                return true;
            }
            const errorData = await response.json();
            alert(errorData.message || "Failed to cancel order.");
            return false;
        } catch (error) {
            console.error("Failed to cancel order", error);
            return false;
        }
    };

    const searchProducts = async (term) => {
        setSearchTerm(term);
        if (!term) return fetchAllProducts();
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/products?keyword=${term}`);
            setProducts(response.ok ? await response.json() : []);
        } catch (error) {
            console.error("Failed to search products:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchFilteredProducts = async (filters) => {
        const queryParams = new URLSearchParams();
        if (filters.keyword) queryParams.append('keyword', filters.keyword);
        if (filters.category) queryParams.append('categoryId', filters.category);
        if (filters.brand) queryParams.append('brand', filters.brand);
        if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
        if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);

        if (queryParams.toString() === "") {
            return fetchAllProducts();
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/products?${queryParams.toString()}`);
            setProducts(response.ok ? await response.json() : []);
        } catch (error) {
            console.error("Failed to fetch filtered products:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const navigate = (page, id = null) => {
        setCurrentPage(page);
        setSelectedProductId(id);
    };

    const value = {
        users, products, categories, currentUser, currentPage, selectedProductId, isLoading, cart, addresses, orders, searchTerm,
        login, register, logout, addProduct, updateProduct, deleteProduct, navigate, fetchUsers, promoteUserToSeller,
        fetchCategories, addToCart, removeFromCart, updateCartItemQuantity, fetchFilteredProducts, addAddress,
        fetchAddresses, createOrder, fetchOrders, cancelOrder, increaseStock, reduceStock, searchProducts
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};