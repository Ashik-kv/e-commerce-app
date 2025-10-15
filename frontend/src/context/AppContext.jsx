// src/context/AppContext.jsx
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
    const [allOrders, setAllOrders] = useState([]); // New state for all orders (for seller/admin)
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(null); // New state for average rating
    // MODIFICATION: Added state to manage the address selection flow for checkout.
    const [isAddressSelectionMode, setIsAddressSelectionMode] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState('');


    // Centralized filters state for both search and filtering
    const [filters, setFilters] = useState({
        keyword: '',
        category: '',
        brand: '',
        minPrice: '',
        maxPrice: ''
    });

    const API_BASE_URL = 'http://localhost:8080';

    const getAuthHeaders = () => {
        const token = localStorage.getItem('authToken');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    };

    // ✨ HOOK TO SYNC WITH BROWSER HISTORY (FOR GESTURES)
    useEffect(() => {
        // This function handles the browser's back/forward events
        const handlePopState = (event) => {
            if (event.state) {
                const { page, id } = event.state;
                setCurrentPage(page || 'home');
                setSelectedProductId(id || null);
            }
        };

        // Listen for popstate events
        window.addEventListener('popstate', handlePopState);

        // Replace the initial empty state with our home page state
        window.history.replaceState({ page: 'home', id: null }, '', window.location.pathname);

        // Cleanup listener on component unmount
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []); // Empty array ensures this runs only once on mount

    // This useEffect hook now handles all product fetching whenever filters change
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                let url;
                const trimmedKeyword = filters.keyword?.trim();

                if (trimmedKeyword) {
                    // Use the dedicated search endpoint when a keyword is provided
                    url = `${API_BASE_URL}/api/products/search/${encodeURIComponent(trimmedKeyword)}`;
                } else {
                    // Otherwise, use the general endpoint with other filters
                    const queryParams = new URLSearchParams();
                    if (filters.category) queryParams.append('categoryId', filters.category);
                    if (filters.brand?.trim()) queryParams.append('brand', filters.brand.trim());
                    if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
                    if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);

                    const queryString = queryParams.toString();
                    url = `${API_BASE_URL}/api/products${queryString ? `?${queryString}` : ''}`;
                }

                const response = await fetch(url);
                const data = response.ok ? await response.json() : [];
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch products:", error);
                setProducts([]);
            } finally {
                setIsLoading(false);
            }
        };

        // Debounce the fetch call to avoid excessive API requests while typing
        const debounceFetch = setTimeout(() => {
            fetchProducts();
        }, 500); // Wait 500ms after the last filter change before fetching

        return () => clearTimeout(debounceFetch); // Cleanup timeout on re-render
    }, [filters]);


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
            if (response.ok) {
                const text = await response.text();
                // Attempt to parse the text as JSON
                try {
                    const data = JSON.parse(text);
                    setCart(data);
                } catch (e) {
                    console.error("Failed to parse cart JSON:", text);
                    setCart({ cartItems: [] });
                }
            } else {
                setCart({ cartItems: [] });
            }
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

    // New function to fetch all orders for seller/admin
    const fetchAllOrders = async () => {
        try {
            let url = `${API_BASE_URL}/api/seller/orders`;
            if (currentUser?.roles?.includes('ROLE_ADMIN')) {
                url = `${API_BASE_URL}/api/admin/orders`;
            }
            const response = await fetch(url, { headers: getAuthHeaders() });
            if (!response.ok) {
                // Throw an error to be caught by the calling function
                throw new Error(`Failed to fetch all orders. Status: ${response.status}`);
            }
            if (response.ok) setAllOrders(await response.json());
        } catch (error) {
            console.error("Failed to fetch all orders:", error);
            // Optionally, update state to indicate an error
            setAllOrders([]);
        }
    };


    useEffect(() => {
        const initialize = async () => {
            setIsLoading(true);
            // Initial product fetch is now handled by the filter effect
            await fetchCategories();
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    setCurrentUser({ email: decoded.sub, roles: decoded.roles || [], id: decoded.id });
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
            setCurrentUser({ email: decoded.sub, roles: decoded.roles || [], id: decoded.id });

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

    // Function to update filters from any component
    const updateFilters = (newFilters) => {
        // If there's a new keyword that is different from the old one, and we are not on the home page, navigate to home.
        if (newFilters.keyword !== undefined && newFilters.keyword !== filters.keyword && currentPage !== 'home') {
            navigate('home');
        }
        setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
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
                setFilters({}); // refresh products
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
                setFilters({}); // refresh products
                return true;
            }
            return false;
        } catch (error) {
            console.error("Failed to update product:", error);
            return false;
        }
    };

    // New function to update order status
    const updateOrderStatus = async (orderId, status) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/seller/orders/${orderId}/status?status=${status}`, {
                method: 'PUT',
                headers: getAuthHeaders()
            });
            if (response.ok) {
                fetchAllOrders(); // refresh orders
                return true;
            }
            return false;
        } catch (error) {
            console.error("Failed to update order status:", error);
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
            if (response.ok) setFilters({}); // refresh products
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
            if (response.ok) setFilters({}); // refresh products
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
                headers: getAuthHeaders(),
            });
            if (response.ok) {
                setUsers(users.map(user => user.id === userId ? { ...user, role: 'ROLE_SELLER' } : user));
                return { success: true };
            }
            // If the response is not OK, try to parse an error message
            const errorData = await response.json().catch(() => ({ message: "An unknown error occurred." }));
            return { success: false, error: errorData.message };
        } catch (error) {
            console.error("Failed to promote user:", error);
            return { success: false, error: error.message };
        }
    };

    const demoteSeller = async (userId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/demote`, {
                method: 'PUT',
                headers: getAuthHeaders(),
            });

            if (response.ok) {
                await fetchUsers(); // Re-fetch users to update the list
                return { success: true };
            }

            const errorData = await response.json().catch(() => ({ message: "An unknown error occurred." }));
            return { success: false, error: errorData.message };
        } catch (error) {
            console.error("Failed to demote seller:", error);
            return { success: false, error: error.message };
        }
    };

    const deleteUser = async (userId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });

            if (response.ok) {
                await fetchUsers(); // Re-fetch users to update the list
                return { success: true };
            }

            const errorData = await response.json().catch(() => ({ message: "An unknown error occurred." }));
            return { success: false, error: errorData.message };
        } catch (error) {
            console.error("Failed to delete user:", error);
            return { success: false, error: error.message };
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
            // *** CHANGE IS HERE ***
            // Added a check to ensure the response is ok before trying to parse it.
            if (response.ok) {
                setCart(await response.json());
            } else {
                console.error("Failed to update cart quantity, server responded with:", await response.text());
            }
        } catch (error) {
            console.error("Failed to update cart quantity:", error);
        }
    };

    // MODIFICATION: The 'addAddress' function now handles detailed validation errors from the backend.
    const addAddress = async (addressData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/addresses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                body: JSON.stringify(addressData)
            });
            if (response.ok) {
                await fetchAddresses();
                return { success: true };
            }
            // If the server returns a validation error, it will be in the response body.
            const errorData = await response.json();
            return { success: false, errors: errorData.errors || { general: "Failed to add address." } };

        } catch (error) {
            console.error("Failed to add address:", error);
            return { success: false, errors: { general: "An unexpected error occurred." } };
        }
    };


    const createOrder = async (shippingAddressId) => {
        try {
            // MODIFICATION: The items in the cart before placing the order are stored.
            const cartItemsBeforeOrder = [...cart.cartItems];
            const response = await fetch(`${API_BASE_URL}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                body: JSON.stringify({ shippingAddressId })
            });
            if (response.ok) {
                setCart({ cartItems: [] });
                await fetchOrders();
                // MODIFICATION: After a successful order, the stock of the ordered products is updated in the local state.
                setProducts(prevProducts =>
                    prevProducts.map(p => {
                        const orderedItem = cartItemsBeforeOrder.find(item => item.productId === p.id);
                        if (orderedItem) {
                            return { ...p, stockQuantity: p.stockQuantity - orderedItem.quantity };
                        }
                        return p;
                    })
                );
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

    const fetchReviews = async (productId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/reviews/product/${productId}`, { headers: getAuthHeaders() });
            if (response.ok) {
                setReviews(await response.json());
            } else {
                setReviews([]);
            }
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
            setReviews([]);
        }
    };

    const fetchAverageRating = async (productId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/reviews/product/${productId}/average-rating`);
            if (response.ok) {
                const data = await response.json();
                setAverageRating(data);
            } else {
                setAverageRating(null);
            }
        } catch (error) {
            console.error("Failed to fetch average rating:", error);
            setAverageRating(null);
        }
    };

    const addReview = async (productId, reviewData) => {
        if (!currentUser) {
            navigate('login');
            return { success: false, error: "Please log in to submit a review." };
        }
        try {
            const response = await fetch(`${API_BASE_URL}/api/reviews/product/${productId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                body: JSON.stringify(reviewData)
            });
            const responseData = await response.json();
            if (response.ok) {
                fetchReviews(productId); // refresh reviews
                fetchAverageRating(productId); // refresh average rating
                return { success: true, review: responseData };
            }
            return { success: false, error: responseData.message || "Failed to submit review." };
        } catch (error) {
            console.error("Failed to add review:", error);
            return { success: false, error: "An unexpected error occurred." };
        }
    };

    const updateReview = async (reviewId, reviewData) => {
        if (!currentUser) {
            navigate('login');
            return { success: false, error: "Please log in to update a review." };
        }
        try {
            const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                body: JSON.stringify(reviewData)
            });
            const responseData = await response.json();
            if (response.ok) {
                fetchReviews(selectedProductId); // refresh reviews for the current product
                fetchAverageRating(selectedProductId); // refresh average rating
                return { success: true, review: responseData };
            }
            return { success: false, error: responseData.message || "Failed to update review." };
        } catch (error) {
            console.error("Failed to update review:", error);
            return { success: false, error: "An unexpected error occurred." };
        }
    };

    // ✨ MODIFIED navigate FUNCTION TO UPDATE BROWSER HISTORY
    const navigate = (page, id = null) => {
        const state = { page, id };
        let path = `/${page}`;
        if (page === 'product' && id) {
            path += `/${id}`;
        } else if (page === 'home') {
            path = '/';
        }

        // This pushes a new state to the browser's history stack
        window.history.pushState(state, '', path);

        // This updates the app's internal state
        setCurrentPage(page);
        setSelectedProductId(id);
    };

    // MODIFICATION: New function to handle the start of the address selection process.
    const startAddressSelection = () => {
        setIsAddressSelectionMode(true);
        navigate('addresses');
    };

    // MODIFICATION: New function to handle the selection of an address and return to checkout.
    const selectAddressAndReturn = (addressId) => {
        setSelectedAddressId(addressId);
        setIsAddressSelectionMode(false);
        navigate('checkout');
    };

    const getCurrentUser = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/profile`, { headers: getAuthHeaders() });
            return response.ok ? await response.json() : null;
        } catch (error) {
            console.error("Failed to fetch current user:", error);
            return null;
        }
    };

    const updateUser = async (userData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                body: JSON.stringify(userData)
            });
            return { success: response.ok };
        } catch (error) {
            console.error("Failed to update user:", error);
            return { success: false, error: "An unexpected error occurred." };
        }
    };

    const updatePassword = async (passwordData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/profile/password`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                body: JSON.stringify(passwordData)
            });
            if (response.ok) {
                return { success: true };
            }
            const errorText = await response.text();
            return { success: false, error: errorText };
        } catch (error) {
            console.error("Failed to update password:", error);
            return { success: false, error: "An unexpected error occurred." };
        }
    };

    const becomeSeller = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/seller-requests`, {
                method: 'POST',
                headers: getAuthHeaders()
            });
            const responseText = await response.text();
            alert(responseText);
        } catch (error) {
            console.error("Failed to become a seller:", error);
            alert("An unexpected error occurred while trying to become a seller.");
        }
    };

    const getSellerRequests = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/seller-requests`, { headers: getAuthHeaders() });
            return response.ok ? await response.json() : [];
        } catch (error) {
            console.error("Failed to fetch seller requests:", error);
            return [];
        }
    };

    const approveSellerRequest = async (requestId) => {
        try {
            await fetch(`${API_BASE_URL}/api/admin/seller-requests/${requestId}/approve`, {
                method: 'POST',
                headers: getAuthHeaders()
            });
        } catch (error) {
            console.error("Failed to approve seller request:", error);
        }
    };

    const rejectSellerRequest = async (requestId) => {
        try {
            await fetch(`${API_BASE_URL}/api/admin/seller-requests/${requestId}/reject`, {
                method: 'POST',
                headers: getAuthHeaders()
            });
        } catch (error) {
            console.error("Failed to reject seller request:", error);
        }
    };

    const deleteAddress = async (addressId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/addresses/${addressId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (response.ok) {
                await fetchAddresses(); // Refresh addresses after deletion
                return { success: true };
            }

            const errorData = await response.json();
            return { success: false, error: errorData.error || "Failed to delete address." };
        } catch (error) {
            console.error("Failed to delete address:", error);
            return { success: false, error: "An unexpected error occurred." };
        }
    };


    const value = {
        users, products, categories, currentUser, currentPage, selectedProductId, isLoading, cart, addresses, orders, filters, allOrders, reviews, averageRating,
        isAddressSelectionMode, selectedAddressId, setSelectedAddressId,
        login, register, logout, addProduct, updateProduct, deleteProduct, navigate, fetchUsers, promoteUserToSeller, demoteSeller, deleteUser,
        fetchCategories, addToCart, removeFromCart, updateCartItemQuantity, updateFilters, addAddress, deleteAddress,
        fetchAddresses, createOrder, fetchOrders, cancelOrder, increaseStock, reduceStock,
        startAddressSelection, selectAddressAndReturn, fetchAllOrders, updateOrderStatus,
        fetchReviews, fetchAverageRating, addReview, updateReview,
        getCurrentUser, updateUser, updatePassword, becomeSeller, getSellerRequests, approveSellerRequest, rejectSellerRequest
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};