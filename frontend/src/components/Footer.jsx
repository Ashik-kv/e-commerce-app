import React from 'react';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="bg-white mt-12 py-6 border-t">
            <div className="container mx-auto text-center text-gray-600">
                <p>&copy; {currentYear} SpringCart. All Rights Reserved.</p>
            </div>
        </footer>
    );
}