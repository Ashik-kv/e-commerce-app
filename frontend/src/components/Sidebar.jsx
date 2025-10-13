import React from 'react';
import { useAppContext } from '../context/AppContext';

export default function Sidebar({ isOpen, onClose }) {
    const { navigate } = useAppContext();

    const handleNavigation = (page) => {
        navigate(page);
        onClose();
    };

    return (
        <div className={`fixed top-16 bottom-0 left-0 w-64 bg-white shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-40`}>
            <div className="p-4 relative h-full">
                <ul>
                    <li className="mb-2 mt-8">
                        {/* Modified button style for better visibility */}
                        <button onClick={() => handleNavigation('manage-orders')} className="w-full text-left p-2 rounded text-gray-700 bg-transparent hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">Manage Orders</button>
                    </li>
                </ul>
            </div>
        </div>
    );
}