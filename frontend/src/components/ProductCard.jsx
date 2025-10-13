// src/components/ProductCard.jsx
import React from 'react';
import { useAppContext } from '../context/AppContext';

export default function ProductCard({ product }) {
    const { navigate } = useAppContext();
    // MODIFICATION: Switched from using the 'images' array to the direct 'mainImage' object.
    const imageUrl = product.mainImage
        ? `data:${product.mainImage.imageType};base64,${product.mainImage.imageFile}`
        : 'https://placehold.co/600x400/cccccc/ffffff?text=No+Image';

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer" onClick={() => navigate('product', product.id)}>
            <img src={imageUrl} alt={product.name} className="w-full h-48 object-cover" />
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
                <p className="text-gray-500 mt-1">{product.brand}</p>
                <p className="text-blue-600 font-bold mt-2">₹{product.discountedPrice ? product.discountedPrice.toFixed(2) : '0.00'}</p>
                {product.category && (
                    <p className="text-xs text-gray-400 mt-1">{product.category.categoryName}</p>
                )}
            </div>
        </div>
    );
}