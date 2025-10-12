import React from 'react';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
    const { products } = useAppContext();
    return (
        <div>
            <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Featured Products</h1>
            {products && products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <p>No products available at the moment.</p>
            )}
        </div>
    );
}