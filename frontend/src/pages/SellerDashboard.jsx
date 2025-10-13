// src/pages/SellerDashboard.jsx
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import ProductModal from '../components/ProductModal';

export default function SellerDashboard() {
    const { products, currentUser, addProduct, updateProduct, deleteProduct, navigate, increaseStock, reduceStock } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [stockUpdate, setStockUpdate] = useState({});

    const sellerProducts = products.filter(p => p.seller && p.seller.email === currentUser?.email);

    if (!currentUser || !currentUser.roles?.includes('ROLE_SELLER')) {
        return <div className="text-center"><p className="text-red-500">Access Denied.</p><button onClick={() => navigate('home')} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">Go to Home</button></div>;
    }

    // MODIFICATION: This function now updates the local state for the quantity to be added or removed.
    const handleStockChange = (productId, value) => {
        const quantity = Math.max(1, parseInt(value, 10) || 1); // Ensure quantity is at least 1
        setStockUpdate({ ...stockUpdate, [productId]: quantity });
    };

    // MODIFICATION: This function is called when the 'Add' button is clicked.
    const handleIncreaseStock = (productId) => {
        const quantity = stockUpdate[productId] || 1;
        increaseStock(productId, quantity);
    };

    // MODIFICATION: This function is called when the 'Remove' button is clicked.
    const handleReduceStock = (productId) => {
        const quantity = stockUpdate[productId] || 1;
        reduceStock(productId, quantity);
    };

    const openAddModal = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleSaveProduct = (productDetails, images) => {
        if (editingProduct) {
            updateProduct(editingProduct.id, productDetails);
        } else {
            addProduct(productDetails, images);
        }
        setIsModalOpen(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-800">My Products</h1>
                <button onClick={openAddModal} className="bg-green-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-600 transition">Add New Product</button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                {sellerProducts.length > 0 ? (
                    <div className="space-y-4">
                        {sellerProducts.map(product => {
                            const imageUrl = product.images && product.images.length > 0
                                ? `data:${product.images[0].imageType};base64,${product.images[0].imageFile}`
                                : 'https://placehold.co/100x100/cccccc/ffffff?text=Img';

                            return (
                                <div key={product.id} className="p-4 border rounded-md md:flex md:items-center md:justify-between">
                                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
                                        <img src={imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded" />
                                        <div>
                                            <p className="font-bold">{product.name}</p>
                                            <p className="text-sm text-gray-500">₹{product.discountedPrice.toFixed(2)}</p>
                                            <p className="text-sm text-gray-600">Stock: {product.stockQuantity}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {/* MODIFICATION: The input field is now controlled and has a white background. */}
                                        <input
                                            type="number"
                                            min="1"
                                            value={stockUpdate[product.id] || 1}
                                            onChange={(e) => handleStockChange(product.id, e.target.value)}
                                            className="w-20 p-2 border rounded bg-white text-black"
                                        />
                                        {/* MODIFICATION: Buttons now have clearer labels and act as confirmation. */}
                                        <button onClick={() => handleIncreaseStock(product.id)} className="bg-green-500 text-white px-4 py-2 text-xs rounded hover:bg-green-600">Add</button>
                                        <button onClick={() => handleReduceStock(product.id)} className="bg-red-500 text-white px-4 py-2 text-xs rounded hover:bg-red-600">Remove</button>
                                        <button onClick={() => openEditModal(product)} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Edit</button>
                                        <button onClick={() => deleteProduct(product.id)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Delete</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">You haven't added any products yet.</p>
                )}
            </div>
            {isModalOpen && <ProductModal product={editingProduct} onSave={handleSaveProduct} onClose={() => setIsModalOpen(false)} />}
        </div>
    );
}