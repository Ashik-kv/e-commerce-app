import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import ProductFilter from '../components/ProductFilter';
import AdminDashboard from './AdminDashboard';
import SellerHomePage from './SellerHomePage';

export default function HomePage() {
    const { products, isLoading, currentUser } = useContext(AppContext);

    if (currentUser?.roles?.includes('ROLE_ADMIN')) {
        return <AdminDashboard />;
    }

    if (currentUser?.roles?.includes('ROLE_SELLER')) {
        return <SellerHomePage />;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-800">Featured Products</h1>
                <ProductFilter />
            </div>

            {isLoading ? (
                <div className="text-center p-16">
                    <p className="text-lg text-gray-500">Loading products...</p>
                </div>
            ) : products && products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center bg-gray-50 p-16 rounded-lg">
                    <p className="text-lg text-gray-500">No products found.</p>
                </div>
            )}
        </div>
    );
}