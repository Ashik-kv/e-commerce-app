// src/components/AddressForm.jsx
import React, { useState } from 'react'; // Added useState import
import { useAppContext } from '../context/AppContext';

export default function AddressForm({ onClose }) {
    const { addAddress } = useAppContext();
    const [formData, setFormData] = useState({
        name: '',
        addressLine1: '',
        city: '',
        phoneNumber: '',
        pinCode: '',
        state: '',
        landmark: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await addAddress(formData);
        if (success) {
            onClose();
        } else {
            alert("Failed to add address.");
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-bold mb-4">Add a New Address</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required className="w-full p-2 border rounded" />
                <input type="text" name="addressLine1" placeholder="Address Line 1" onChange={handleChange} required className="w-full p-2 border rounded" />
                <input type="text" name="landmark" placeholder="Landmark (Optional)" onChange={handleChange} className="w-full p-2 border rounded" />
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="city" placeholder="City" onChange={handleChange} required className="w-full p-2 border rounded" />
                    <input type="text" name="state" placeholder="State" onChange={handleChange} required className="w-full p-2 border rounded" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="pinCode" placeholder="Pincode" onChange={handleChange} required className="w-full p-2 border rounded" />
                    <input type="text" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required className="w-full p-2 border rounded" />
                </div>
                <div className="flex justify-end space-x-4">
                    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Save Address</button>
                </div>
            </form>
        </div>
    );
}