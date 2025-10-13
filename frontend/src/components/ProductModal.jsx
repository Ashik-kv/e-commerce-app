// src/components/ProductModal.jsx
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

export default function ProductModal({ product, onSave, onClose }) {
    const { categories } = useAppContext();
    const [name, setName] = useState(product ? product.name : '');
    const [brand, setBrand] = useState(product ? product.brand : '');
    const [description, setDescription] = useState(product ? product.description : '');
    const [originalPrice, setOriginalPrice] = useState(product ? product.originalPrice : '');
    const [discountPercentage, setDiscountPercentage] = useState(product ? product.discountPercentage : 0);
    const [stockQuantity, setStockQuantity] = useState(product ? product.stockQuantity : 1);
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]); // For displaying thumbnails
    const [categoryId, setCategoryId] = useState(product && product.category ? product.category.id : '');

    // Effect to create and clean up object URLs for image previews
    useEffect(() => {
        const newImagePreviews = images.map(file => URL.createObjectURL(file));
        setImagePreviews(newImagePreviews);

        // Cleanup function to revoke object URLs
        return () => {
            newImagePreviews.forEach(url => URL.revokeObjectURL(url));
        };
    }, [images]);


    const handleSubmit = (e) => {
        e.preventDefault();
        const productDetails = {
            name, brand, description,
            originalPrice: parseFloat(originalPrice),
            discountPercentage: parseInt(discountPercentage, 10),
            stockQuantity: parseInt(stockQuantity, 10),
            available: true,
            mfgDate: new Date().toISOString().split('T')[0],
            categoryId: parseInt(categoryId, 10),
        };
        onSave(productDetails, images);
    };

    const handleImageChange = (e) => {
        setImages([...images, ...e.target.files]);
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex-shrink-0">
                    {product ? 'Edit Product' : 'Add New Product'}
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
                    {/* Scrollable form fields */}
                    <div className="flex-grow overflow-y-auto pr-4 space-y-5">
                        {/* Product Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Product Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition bg-white"
                            />
                        </div>

                        {/* Brand */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Brand <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={brand}
                                onChange={e => setBrand(e.target.value)}
                                required
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition bg-white"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description <span className="text-red-500">*</span></label>
                            <textarea
                                rows="3"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                required
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition bg-white"
                            ></textarea>
                        </div>

                        {/* Price & Discount */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Original Price (₹) <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={originalPrice}
                                    onChange={e => setOriginalPrice(e.target.value)}
                                    required
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Discount (%) <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={discountPercentage}
                                    onChange={e => setDiscountPercentage(e.target.value)}
                                    required
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition bg-white"
                                />
                            </div>
                        </div>

                        {/* Stock Quantity & Category Dropdown */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Stock Quantity <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    min="0"
                                    value={stockQuantity}
                                    onChange={e => setStockQuantity(e.target.value)}
                                    required
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category <span className="text-red-500">*</span></label>
                                <select
                                    value={categoryId}
                                    onChange={e => setCategoryId(e.target.value)}
                                    required
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition bg-white"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.categoryName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Product Images */}
                        {!product && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Product Images</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 cursor-pointer"
                                />
                                <div className="mt-2 grid grid-cols-4 gap-4 border p-2 rounded-md bg-white">
                                    {imagePreviews.length > 0 ? imagePreviews.map((previewUrl, index) => (
                                        <div key={index} className="relative">
                                            <img src={previewUrl} alt={`preview ${index}`} className="w-full h-24 object-cover rounded-md"/>
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                            >
                                                X
                                            </button>
                                        </div>
                                    )) : (
                                        <p className="col-span-4 text-xs text-gray-500 text-center">No files selected</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-4 pt-4 border-t mt-4 flex-shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition"
                        >
                            Save Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}