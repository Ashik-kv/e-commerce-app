import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

export default function ProductFilter() {
    const { categories, filters, updateFilters, fetchCategories } = useAppContext();
    const [localFilters, setLocalFilters] = useState(filters);

    // Keep local component state in sync with the global context state
    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    useEffect(() => {
        if (categories.length === 0) {
            fetchCategories();
        }
    }, []);

    const handleChange = (e) => {
        setLocalFilters({ ...localFilters, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateFilters(localFilters); // Update global filters on submit
    };

    const handleReset = () => {
        const initialFilters = {
            keyword: '',
            category: '',
            brand: '',
            minPrice: '',
            maxPrice: ''
        };
        updateFilters(initialFilters); // Reset global filters, which also clears the search term
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md mb-8 space-y-4 md:space-y-0 md:flex md:items-end md:space-x-4">
            <select
                name="category"
                value={localFilters.category}
                onChange={handleChange}
                className="w-full md:w-auto p-2 border rounded bg-white text-black"
            >
                <option value="">All Categories</option>
                {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
                ))}
            </select>
            <input
                type="text"
                name="brand"
                placeholder="Brand"
                value={localFilters.brand}
                onChange={handleChange}
                className="w-full md:w-auto flex-grow p-2 border rounded bg-white text-black"
            />
            <input
                type="number"
                name="minPrice"
                placeholder="Min Price"
                value={localFilters.minPrice}
                onChange={handleChange}
                className="w-full md:w-24 p-2 border rounded bg-white text-black"
            />
            <input
                type="number"
                name="maxPrice"
                placeholder="Max Price"
                value={localFilters.maxPrice}
                onChange={handleChange}
                className="w-full md:w-24 p-2 border rounded bg-white text-black"
            />
            <div className="flex space-x-2">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Filter</button>
                <button type="button" onClick={handleReset} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Reset</button>
            </div>
        </form>
    );
}