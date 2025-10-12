import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import ProductModal from '../components/ProductModal';

export default function SellerDashboard() {
    const { products, currentUser, addProduct, updateProduct, deleteProduct, navigate, increaseStock, reduceStock } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [stockUpdate, setStockUpdate] = useState({});

    const sellerProducts = products.filter(p => p.seller.email === currentUser?.email);

    if (!currentUser || !currentUser.roles?.includes('ROLE_SELLER')) {
        return <div className="text-center"><p className="text-red-500">Access Denied.</p><button onClick={() => navigate('home')} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">Go to Home</button></div>;
    }

    const handleStockChange = (productId, value) => {
        setStockUpdate({ ...stockUpdate, [productId]: parseInt(value, 10) || 1 });
    };

    const handleIncreaseStock = (productId) => {
        const quantity = stockUpdate[productId] || 1;
        increaseStock(productId, quantity);
    };

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
                                        <input
                                            type="number"
                                            min="1"
                                            defaultValue="1"
                                            onChange={(e) => handleStockChange(product.id, e.target.value)}
                                            className="w-16 p-1 border rounded"
                                        />
                                        <button onClick={() => handleIncreaseStock(product.id)} className="bg-green-500 text-white px-2 py-1 text-xs rounded hover:bg-green-600">+</button>
                                        <button onClick={() => handleReduceStock(product.id)} className="bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600">-</button>
                                        <button onClick={() => openEditModal(product)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Edit</button>
                                        <button onClick={() => deleteProduct(product.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
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