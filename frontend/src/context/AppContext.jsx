import React, { useState, useEffect, createContext, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

// This is the main context that will hold our state and functions
export const AppContext = createContext();

// The AppProvider component is where all our logic and state will live.
export const AppProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]); // ✨ NEW: Categories state
    const [currentUser, setCurrentUser] = useState(null);
    const [currentPage, setCurrentPage] = useState('home');
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);

    const API_BASE_URL = 'http://localhost:8080';

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                // Fetch products
                const productsResponse = await fetch(`${API_BASE_URL}/api/products`);
                if (productsResponse.ok) {
                    const productsData = await productsResponse.json();
                    setProducts(productsData);
                } else {
                    setProducts([]);
                }

                // ✨ NEW: Fetch categories
                const categoriesResponse = await fetch(`${API_BASE_URL}/api/categories`);
                if (categoriesResponse.ok) {
                    const categoriesData = await categoriesResponse.json();
                    setCategories(categoriesData);
                } else {
                    setCategories([]);
                }

                const token = localStorage.getItem('authToken');
                if (token) {
                    try {
                        const decodedToken = jwtDecode(token);
                        setCurrentUser({
                            email: decodedToken.sub,
                            roles: decodedToken.roles || [],
                        });
                    } catch (error) {
                        console.error("Invalid token:", error);
                        localStorage.removeItem('authToken'); // Clear invalid token
                    }
                }
            } catch (error) {
                console.error("Failed to fetch initial data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    // ✨ NEW: Function to fetch categories (can be called separately if needed)
    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/categories`);
            if (response.ok) {
                const categoriesData = await response.json();
                setCategories(categoriesData);
            }
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) return false;

            const data = await response.json();
            localStorage.setItem('authToken', data.token);

            const decodedToken = jwtDecode(data.token);
            console.log("Decoded JWT Token:", decodedToken); 
            setCurrentUser({
                email: decodedToken.sub,
                roles: decodedToken.roles || [],
            });

            navigate('home');
            return true;
        } catch (error) {
            console.error("Login failed:", error);
            return false;
        }
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

    const logout = async () => {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                await fetch(`${API_BASE_URL}/logout`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            } catch (error) {
                console.error("Logout failed on backend:", error);
            }
        }
        setCurrentUser(null);
        localStorage.removeItem('authToken');
        navigate('home');
    };

    const addProduct = async (productData, images) => {
        try {
            const token = localStorage.getItem('authToken');
            const formData = new FormData();
            formData.append('product', new Blob([JSON.stringify(productData)], { type: 'application/json' }));
            images.forEach(image => {
                formData.append('images', image);
            });

            const response = await fetch(`${API_BASE_URL}/api/seller/products`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                const newProduct = await response.json();
                setProducts(prev => [...prev, newProduct]);
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
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/api/seller/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(productDetails)
            });
            if (response.ok) {
                const returnedProduct = await response.json();
                setProducts(products.map(p => p.id === returnedProduct.id ? returnedProduct : p));
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
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/api/seller/products/${productId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setProducts(products.filter(p => p.id !== productId));
            }
        } catch (error) {
            console.error("Failed to delete product:", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const usersData = await response.json();
                setUsers(usersData);
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    };

    const promoteUserToSeller = async (userId) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/promote`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setUsers(users.map(user =>
                    user.id === userId ? { ...user, role: 'ROLE_SELLER' } : user
                ));
                return true;
            }
            return false;
        } catch (error) {
            console.error("Failed to promote user:", error);
            return false;
        }
    };

    const navigate = (page, productId = null) => {
        setCurrentPage(page);
        setSelectedProductId(productId);
    };

    const addToCart = (product) => {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            setCart(cart.map(item =>
                item.id === product.id 
                  ? {...item, quantity: item.quantity + 1}
                  : item
            ));
        } else {
            setCart([...cart, {...product, quantity: 1}]);
        }
        updateTotal();
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item.id !== productId));
        updateTotal();
    };

    const updateTotal = () => {
        const newTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotal(newTotal);
    };

    const fetchFilteredProducts = async (filters) => {
        const { keyword, category, brand, minPrice, maxPrice } = filters;
        const queryParams = new URLSearchParams();
        if (keyword) queryParams.append('keyword', keyword);
        if (category) queryParams.append('categoryId', category);
        if (brand) queryParams.append('brand', brand);
        if (minPrice) queryParams.append('minPrice', minPrice);
        if (maxPrice) queryParams.append('maxPrice', maxPrice);

        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/products?${queryParams.toString()}`);
            if (response.ok) {
                const productsData = await response.json();
                setProducts(productsData);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error("Failed to fetch filtered products:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const value = {
        users, products, categories, currentUser, currentPage, selectedProductId, isLoading, cart, total, // ✨ Added categories to context
        login, register, logout, addProduct, updateProduct, deleteProduct, navigate, fetchUsers,
        promoteUserToSeller, fetchCategories, addToCart, removeFromCart, fetchFilteredProducts, // ✨ Added fetchCategories to context
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};