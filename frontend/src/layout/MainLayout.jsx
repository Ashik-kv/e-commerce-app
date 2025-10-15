// src/layout/MainLayout.jsx
import React from 'react';
import { useAppContext } from '../context/AppContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HomePage from '../pages/HomePage';
import ProductDetailPage from '../pages/ProductDetailPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import SellerDashboard from '../pages/SellerDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import AddressPage from '../pages/AddressPage';
import OrderHistoryPage from '../pages/OrderHistoryPage';
import OrderDetailPage from '../pages/OrderDetailPage';
import ManageOrdersPage from '../pages/ManageOrdersPage';
import ProfilePage from '../pages/ProfilePage';
import SellerRequestsPage from '../pages/admin/SellerRequestsPage';
import UserManagementPage from '../pages/admin/UserManagementPage';
import './mainlayout.css'

function PageContent() {
    const { currentPage, selectedProductId, isLoading } = useAppContext();
    if (isLoading) return <div className="text-center text-xl mt-12">Loading...</div>;
    switch (currentPage) {
        case 'home': return <HomePage />;
        case 'product': return <ProductDetailPage productId={selectedProductId} />;
        case 'login': return <LoginPage />;
        case 'register': return <RegisterPage />;
        case 'seller': return <SellerDashboard />;
        case 'admin': return <AdminDashboard />;
        case 'cart': return <CartPage />;
        case 'checkout': return <CheckoutPage />;
        case 'addresses': return <AddressPage />;
        case 'order-history': return <OrderHistoryPage />;
        case 'order-detail': return <OrderDetailPage orderId={selectedProductId} />;
        case 'manage-orders': return <ManageOrdersPage />;
        case 'profile': return <ProfilePage />;
        case 'admin/seller-requests': return <SellerRequestsPage />;
        case 'admin/user-management': return <UserManagementPage />;
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