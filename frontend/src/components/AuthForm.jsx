import React, { useState } from 'react';

export default function AuthForm({ title, onSubmit, fields, buttonText, error, footerText, footerLinkText, onFooterLinkClick }) {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">{title}</h2>
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">{error}</p>}
            <form onSubmit={onSubmit} className="space-y-6">
                {fields.map((field, index) => (
                    <div key={index}>
                        <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                        <input
                            type={field.type === 'password' && showPassword ? 'text' : field.type}
                            required
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={field.value}
                            onChange={field.onChange}
                        />
                         {field.type === 'password' &&
                            <div className="mt-2">
                                <input type="checkbox" onChange={() => setShowPassword(!showPassword)} />
                                <label className="ml-2 text-sm text-gray-600">Show Password</label>
                            </div>
                        }
                    </div>
                ))}
                <button type="submit" className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition duration-300">{buttonText}</button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-6">
                {footerText} <span onClick={onFooterLinkClick} className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">{footerLinkText}</span>
            </p>
        </div>
    );
}