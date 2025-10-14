import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

// Eye icon SVGs for better user experience
const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.03 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
    </svg>
);

const EyeSlashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A10.025 10.025 0 00.458 10c1.274 4.057 5.03 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
    </svg>
);


export default function ProfilePage() {
    const { currentUser, getCurrentUser, updateUser, updatePassword } = useAppContext();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ firstName: '', lastName: '' });
    const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '' });
    const [error, setError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [success, setSuccess] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    // State to manage password visibility
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);


    useEffect(() => {
        const fetchUser = async () => {
            const userData = await getCurrentUser();
            if (userData) {
                setUser(userData);
                setFormData({ firstName: userData.firstName, lastName: userData.lastName });
            }
        };
        fetchUser();
    }, [currentUser]);

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        const result = await updateUser(formData);
        if (result.success) {
            setSuccess('Profile updated successfully!');
            setIsEditing(false);
            const updatedUserData = await getCurrentUser();
            setUser(updatedUserData);
        } else {
            setError(result.error || 'Failed to update profile.');
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');
        const result = await updatePassword(passwordData);
        if (result.success) {
            setPasswordSuccess('Password updated successfully!');
            setPasswordData({ oldPassword: '', newPassword: '' });
        } else {
            setPasswordError(result.error || 'Failed to update password.');
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6">My Profile</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {success && <p className="text-green-500 mb-4">{success}</p>}
                {isEditing ? (
                    <form onSubmit={handleUpdateProfile}>
                        <div className="mb-4">
                            <label className="block text-gray-700">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleFormChange}
                                className="w-full p-2 border rounded bg-white"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleFormChange}
                                className="w-full p-2 border rounded bg-white"
                            />
                        </div>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
                        <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-4 py-2 rounded ml-2">Cancel</button>
                    </form>
                ) : (
                    <div>
                        <p><strong>First Name:</strong> {user.firstName}</p>
                        <p><strong>Last Name:</strong> {user.lastName}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">Edit Profile</button>
                    </div>
                )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                <h2 className="text-2xl font-bold mb-4">Update Password</h2>
                {passwordError && <p className="text-red-500 mb-4">{passwordError}</p>}
                {passwordSuccess && <p className="text-green-500 mb-4">{passwordSuccess}</p>}
                <form onSubmit={handleUpdatePassword}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Old Password</label>
                        <div className="relative">
                            <input
                                type={showOldPassword ? 'text' : 'password'}
                                name="oldPassword"
                                value={passwordData.oldPassword}
                                onChange={handlePasswordChange}
                                className="w-full p-2 border rounded bg-white"
                            />
                            <button
                                type="button"
                                onClick={() => setShowOldPassword(!showOldPassword)}
                                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600"
                            >
                                {showOldPassword ? <EyeSlashIcon /> : <EyeIcon />}
                            </button>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">New Password</label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                className="w-full p-2 border rounded bg-white"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600"
                            >
                                {showNewPassword ? <EyeSlashIcon /> : <EyeIcon />}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Update Password</button>
                </form>
            </div>
        </div>
    );
}