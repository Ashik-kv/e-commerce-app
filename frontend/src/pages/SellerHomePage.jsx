import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';

export default function SellerHomePage() {
    const { products, currentUser, addProduct } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const sellerProducts = products.filter(p => p.seller && p.seller.email === currentUser?.email);

    const openAddModal = () => {
        setIsModalOpen(true);
    };

    const handleSaveProduct = (productDetails, images) => {
        addProduct(productDetails, images);
        setIsModalOpen(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-800">My Products</h1>
                <button onClick={openAddModal} className="bg-green-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-600 transition">Add New Product</button>
            </div>
            {sellerProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {sellerProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <p>You haven't added any products yet.</p>
            )}
            {isModalOpen && <ProductModal onSave={handleSaveProduct} onClose={() => setIsModalOpen(false)} />}
        </div>
    );
}