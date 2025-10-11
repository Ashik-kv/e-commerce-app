// src/layout/MainLayout.jsx
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HomePage from '../pages/HomePage';
import ProductDetailPage from '../pages/ProductDetailPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import SellerDashboard from '../pages/SellerDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import CartPage from '../pages/CartPage'; // Import CartPage
import CheckoutPage from '../pages/CheckoutPage'; // Import CheckoutPage
import './mainlayout.css'

function PageContent() {
    const { currentPage, selectedProductId, isLoading } = useContext(AppContext);
    if (isLoading) return <div className="text-center text-xl mt-12">Loading...</div>;
    switch (currentPage) {
        case 'home': return <HomePage />;
        case 'product': return <ProductDetailPage productId={selectedProductId} />;
        case 'login': return <LoginPage />;
        case 'register': return <RegisterPage />;
        case 'seller': return <SellerDashboard />;
        case 'admin': return <AdminDashboard />;
        case 'cart': return <CartPage />; // Add case for cart
        case 'checkout': return <CheckoutPage />; // Add case for checkout
        default: return <HomePage />;
    }
}

export default function MainLayout() {
    return (
        <div className="layout">
            <Navbar />
            <main className="p-4 md:p-8">
                <PageContent />
            </main>
            <Footer />
        </div>
    );
}