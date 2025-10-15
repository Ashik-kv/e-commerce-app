// src/pages/AddressPage.jsx
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import AddressForm from '../components/AddressForm';

export default function AddressPage() {
    // MODIFICATION: Getting the new state and functions from the context.
    const { addresses, fetchAddresses, isAddressSelectionMode, selectAddressAndReturn, deleteAddress } = useAppContext();
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

    const handleDeleteAddress = async (addressId) => {
        if (window.confirm("Are you sure you want to delete this address?")) {
            await deleteAddress(addressId);
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
                    {isAddingAddress ? 'Cancel' : (
                        <div className="flex items-center">
                            <span className="text-2xl mr-2">+</span> Add New Address
                        </div>
                    )}
                </button>
            </div>

            {isAddingAddress && <AddressForm onClose={() => setIsAddingAddress(false)} />}

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map(address => (
                    // MODIFICATION: The address card is now clickable if in selection mode.
                    <div
                        key={address.id}
                        className={`bg-white p-6 rounded-lg shadow-md ${isAddressSelectionMode ? 'cursor-pointer hover:shadow-xl hover:border-blue-500 border-2 border-transparent transition' : ''}`}
                    >
                        <div onClick={() => handleSelectAddress(address.id)} >
                            <p className="font-semibold">{address.name}</p>
                            <p>{address.addressLine1}</p>
                            {address.landmark && <p>{address.landmark}</p>}
                            <p>{address.city}, {address.state} - {address.pinCode}</p>
                            <p>Phone: {address.phoneNumber}</p>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => handleDeleteAddress(address.id)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}