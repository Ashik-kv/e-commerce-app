// src/pages/ProductDetailPage.jsx
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function ProductDetailPage({ productId }) {
    const { products, addToCart, navigate } = useContext(AppContext);
    const product = products.find(p => p.id === productId);

    if (!product) {
        return <div className="text-center"><p>Product not found.</p><button onClick={() => navigate('home')} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">Go to Home</button></div>;
    }

    const imageUrl = product.images && product.images.length > 0
        ? `data:${product.images[0].imageType};base64,${product.images[0].imageFile}`
        : 'https://placehold.co/600x400/cccccc/ffffff?text=No+Image';

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden md:flex">
                <div className="md:w-1/2">
                    <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="md:w-1/2 p-6">
                    <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                    <p className="text-gray-600 text-lg mb-4">{product.brand}</p>
                    <p className="text-gray-800 mb-4">{product.description}</p>
                    <div className="flex items-center mb-4">
                        <p className="text-3xl font-bold text-blue-600">₹{product.discountedPrice.toFixed(2)}</p>
                        <p className="text-xl text-gray-500 line-through ml-4">₹{product.originalPrice.toFixed(2)}</p>
                    </div>
                    {product.category && (
                        <p className="text-sm text-gray-500 mb-4">Category: {product.category.categoryName}</p>
                    )}
                    <p className="text-sm text-gray-500 mb-4">Stock: {product.stockQuantity}</p>
                    <button
                        onClick={() => addToCart(product)}
                        className="w-full bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}