import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import ProductFilter from '../components/ProductFilter';

export default function HomePage() {
    const { products, isLoading } = useContext(AppContext);
    return (
        <div>
            <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Featured Products</h1>
            <ProductFilter />
            {isLoading ? (
                <p>Loading...</p>
            ) : products && products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <p>No products found.</p>
            )}
        </div>
    );
}