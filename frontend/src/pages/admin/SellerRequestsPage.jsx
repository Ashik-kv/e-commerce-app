import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';

export default function SellerRequestsPage() {
    const { currentUser, navigate, getSellerRequests, approveSellerRequest, rejectSellerRequest } = useAppContext();
    const [sellerRequests, setSellerRequests] = useState([]);

    useEffect(() => {
        if (currentUser?.roles?.includes('ROLE_ADMIN')) {
            const fetchRequests = async () => {
                const requests = await getSellerRequests();
                setSellerRequests(requests);
            };
            fetchRequests();
        }
    }, [currentUser]);

    if (!currentUser || !currentUser.roles?.includes('ROLE_ADMIN')) {
        return <div className="text-center"><p className="text-red-500">Access Denied.</p><button onClick={() => navigate('home')} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">Go to Home</button></div>;
    }

    const handleApprove = async (requestId) => {
        await approveSellerRequest(requestId);
        const requests = await getSellerRequests();
        setSellerRequests(requests);
    };

    const handleReject = async (requestId) => {
        await rejectSellerRequest(requestId);
        const requests = await getSellerRequests();
        setSellerRequests(requests);
    };

    return (
        <div>
            <h1 className="text-4xl font-extrabold text-gray-800">Seller Requests</h1>
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="p-3">User Email</th>
                            <th className="p-3">Request Date</th>
                            <th className="p-3">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {sellerRequests.map(request => (
                            <tr key={request.id} className="border-b">
                                <td className="p-3">{request.user.email}</td>
                                <td className="p-3">{new Date(request.createdAt).toLocaleDateString()}</td>
                                <td className="p-3">
                                    <button onClick={() => handleApprove(request.id)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-xs font-semibold mr-2">Approve</button>
                                    <button onClick={() => handleReject(request.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs font-semibold">Reject</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}