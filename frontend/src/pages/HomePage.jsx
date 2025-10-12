import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import ProductFilter from '../components/ProductFilter';

export default function HomePage() {
    const { products, isLoading } = useContext(AppContext);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-800">Featured Products</h1>
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="bg-blue-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-600 transition"
                >
                    {isFilterOpen ? 'Close Filters' : 'Show Filters'}
                </button>
            </div>

            {isFilterOpen && <ProductFilter />}

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