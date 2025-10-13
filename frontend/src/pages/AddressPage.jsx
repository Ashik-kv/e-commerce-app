// src/pages/AddressPage.jsx
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import AddressForm from '../components/AddressForm';

export default function AddressPage() {
    // MODIFICATION: Getting the new state and functions from the context.
    const { addresses, fetchAddresses, isAddressSelectionMode, selectAddressAndReturn } = useAppContext();
    const [isAddingAddress, setIsAddingAddress] = useState(false);

    useEffect(() => {
        fetchAddresses();
    }, []);

    // MODIFICATION: This function handles selecting an address and returning to checkout.
    const handleSelectAddress = (addressId) => {
        if (isAddressSelectionMode) {
            selectAddressAndReturn(addressId);
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Your Addresses</h1>
                <button
                    onClick={() => setIsAddingAddress(!isAddingAddress)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    {isAddingAddress ? 'Cancel' : 'Add New Address'}
                </button>
            </div>

            {isAddingAddress && <AddressForm onClose={() => setIsAddingAddress(false)} />}

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map(address => (
                    // MODIFICATION: The address card is now clickable if in selection mode.
                    <div
                        key={address.id}
                        onClick={() => handleSelectAddress(address.id)}
                        className={`bg-white p-6 rounded-lg shadow-md ${isAddressSelectionMode ? 'cursor-pointer hover:shadow-xl hover:border-blue-500 border-2 border-transparent transition' : ''}`}
                    >
                        <p className="font-semibold">{address.name}</p>
                        <p>{address.addressLine1}</p>
                        {address.landmark && <p>{address.landmark}</p>}
                        <p>{address.city}, {address.state} - {address.pinCode}</p>
                        <p>Phone: {address.phoneNumber}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}