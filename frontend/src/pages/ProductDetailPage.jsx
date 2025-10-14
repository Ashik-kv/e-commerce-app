// src/pages/ProductDetailPage.jsx
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import ProductModal from '../components/ProductModal';
import ReviewSection from '../components/ReviewSection';

export default function ProductDetailPage({ productId }) {
    const { products, addToCart, navigate, currentUser, updateProduct } = useAppContext();
    const product = products.find(p => p.id === productId);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isEditing, setIsEditing] = useState(false);

    if (!product) {
        return <div className="text-center"><p>Product not found.</p><button onClick={() => navigate('home')} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">Go to Home</button></div>;
    }

    const isSeller = currentUser && product.seller && currentUser.email === product.seller.email;

    const handleSave = (productDetails) => {
        updateProduct(product.id, productDetails);
        setIsEditing(false);
    };

    const hasImages = product.images && product.images.length > 0;

    // Functions to navigate to the next and previous images.
    const goToNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
    };

    const goToPreviousImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length);
    };

    const mainImageUrl = hasImages
        ? `data:${product.images[currentImageIndex].imageType};base64,${product.images[currentImageIndex].imageFile}`
        : 'https://placehold.co/600x400/cccccc/ffffff?text=No+Image';

    const isOutOfStock = product.stockQuantity <= 0;

    return (
        <div className="container mx-auto p-4 md:p-8">
            {isEditing && <ProductModal product={product} onSave={handleSave} onClose={() => setIsEditing(false)} />}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden md:flex">
                <div className="md:w-1/2 p-4">
                    {/* Main Image Display with Navigation Arrows */}
                    <div className="relative mb-4">
                        <img
                            src={mainImageUrl}
                            alt={`${product.name} - image ${currentImageIndex + 1}`}
                            className="w-full h-auto object-contain rounded-lg"
                            style={{ aspectRatio: '1 / 1' }} // Enforces a square aspect ratio
                        />
                        {hasImages && product.images.length > 1 && (
                            <>
                                <button
                                    onClick={goToPreviousImage}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
                                >
                                    &#10094;
                                </button>
                                <button
                                    onClick={goToNextImage}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
                                >
                                    &#10095;
                                </button>
                            </>
                        )}
                    </div>
                    {/* Thumbnails */}
                    {hasImages && product.images.length > 1 && (
                        <div className="flex space-x-2 overflow-x-auto">
                            {product.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={`data:${image.imageType};base64,${image.imageFile}`}
                                    alt={`${product.name} thumbnail ${index + 1}`}
                                    className={`w-20 h-20 object-contain rounded-md cursor-pointer border-2 ${currentImageIndex === index ? 'border-blue-500' : 'border-transparent'}`}
                                    style={{ aspectRatio: '1 / 1' }} // Enforces a square aspect ratio for thumbnails
                                    onClick={() => setCurrentImageIndex(index)}
                                />
                            ))}
                        </div>
                    )}
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
                    <p className={`text-sm font-semibold mb-4 ${isOutOfStock ? 'text-red-500' : 'text-gray-500'}`}>
                        Stock: {isOutOfStock ? 'Out of Stock' : product.stockQuantity}
                    </p>
                    {isSeller ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="w-full px-6 py-3 rounded-lg font-semibold transition bg-yellow-500 text-white hover:bg-yellow-600"
                        >
                            Edit Product
                        </button>
                    ) : (
                        <button
                            onClick={() => !isOutOfStock && addToCart(product.id)}
                            disabled={isOutOfStock}
                            className={`w-full px-6 py-3 rounded-lg font-semibold transition ${isOutOfStock
                                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                : 'bg-green-500 text-white hover:bg-green-600'
                            }`}
                        >
                            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                    )}
                </div>
            </div>
            <ReviewSection productId={productId} />
        </div>
    );
}