// src/components/AddressForm.jsx
import React, { useState } from 'react';
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
    // MODIFICATION: State to hold validation errors.
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear the error for a field when the user starts typing in it again.
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await addAddress(formData);
        if (result.success) {
            onClose();
        } else {
            // MODIFICATION: Set the errors state with the validation messages from the backend.
            setErrors(result.errors);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-bold mb-4">Add a New Address</h2>
            {/* MODIFICATION: Display general error messages. */}
            {errors.general && <p className="text-red-500 text-sm mb-4">{errors.general}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required className="w-full p-2 border rounded bg-white" />
                </div>
                <div>
                    <input type="text" name="addressLine1" placeholder="Address Line 1" onChange={handleChange} required className="w-full p-2 border rounded bg-white" />
                </div>
                <div>
                    <input type="text" name="landmark" placeholder="Landmark (Optional)" onChange={handleChange} className="w-full p-2 border rounded bg-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <input type="text" name="city" placeholder="City" onChange={handleChange} required className="w-full p-2 border rounded bg-white" />
                    </div>
                    <div>
                        <input type="text" name="state" placeholder="State" onChange={handleChange} required className="w-full p-2 border rounded bg-white" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <input type="text" name="pinCode" placeholder="Pincode" onChange={handleChange} required className="w-full p-2 border rounded bg-white" />
                        {/* MODIFICATION: Display pincode validation errors. */}
                        {errors.pinCode && <p className="text-red-500 text-xs mt-1">{errors.pinCode}</p>}
                    </div>
                    <div>
                        <input type="text" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required className="w-full p-2 border rounded bg-white" />
                        {/* MODIFICATION: Display phone number validation errors. */}
                        {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                    </div>
                </div>
                <div className="flex justify-end space-x-4">
                    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Save Address</button>
                </div>
            </form>
        </div>
    );
}