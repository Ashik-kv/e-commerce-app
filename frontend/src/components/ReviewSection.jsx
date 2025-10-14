// src/components/ReviewSection.jsx
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

export default function ReviewSection({ productId }) {
    const { reviews, fetchReviews, addReview, updateReview, currentUser, orders, averageRating, fetchAverageRating } = useAppContext();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hasPurchased, setHasPurchased] = useState(false);
    const [userReview, setUserReview] = useState(null);
    const [otherReviews, setOtherReviews] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editRating, setEditRating] = useState(0);
    const [editComment, setEditComment] = useState('');

    useEffect(() => {
        if (productId) {
            fetchReviews(productId);
            fetchAverageRating(productId);
        }
    }, [productId, currentUser]); // Re-fetch reviews if currentUser changes

    useEffect(() => {
        if (currentUser && orders.length > 0 && productId) {
            const purchased = orders.some(order =>
                order.orderItems.some(item => item.productId === parseInt(productId))
            );
            setHasPurchased(purchased);
        } else {
            setHasPurchased(false);
        }
    }, [currentUser, orders, productId]);

    useEffect(() => {
        if (reviews.length > 0 && currentUser) {
            const userOwnedReview = reviews.find(review => review.ownedByUser);
            if (userOwnedReview) {
                setUserReview(userOwnedReview);
                setEditRating(userOwnedReview.rating);
                setEditComment(userOwnedReview.comment);
                setOtherReviews(reviews.filter(review => !review.ownedByUser));
            } else {
                setUserReview(null);
                setOtherReviews(reviews);
            }
        } else {
            setUserReview(null);
            setOtherReviews(reviews);
        }
    }, [reviews, currentUser]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await addReview(productId, { rating: parseInt(rating), comment });
        if (result.success) {
            setRating(0);
            setComment('');
        } else {
            alert(result.error); // Display error message from backend
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (userReview) {
            const result = await updateReview(userReview.id, { rating: parseInt(editRating), comment: editComment });
            if (result.success) {
                setIsEditing(false);
            } else {
                alert(result.error);
            }
        }
    };

    const renderStars = (ratingValue) => {
        return [...Array(5)].map((_, i) => (
            <span key={i} className={i < ratingValue ? 'text-yellow-500' : 'text-gray-300'}>★</span>
        ));
    };

    const canWriteReview = currentUser && hasPurchased && !userReview;
    const isLoggedIn = currentUser !== null;

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Ratings & Reviews</h2>

            {/* Average Rating Section */}
            {averageRating !== null && (
                <div className="mb-6 flex items-center bg-white p-6 rounded-lg shadow-md">
                    <p className="text-4xl font-bold text-gray-800 mr-4">
                        {averageRating.toFixed(1)} <span className="text-yellow-500">★</span>
                    </p>
                    <p className="text-gray-600">Average Rating</p>
                </div>
            )}

            {/* Write/Edit Review Section */}
            {canWriteReview && (
                <form onSubmit={handleSubmit} className="mb-6 bg-white shadow-md rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Write a review</h3>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Rating</label>
                        <select
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition bg-white"
                            required
                        >
                            <option value="">Select a rating</option>
                            <option value="1">1 - Poor</option>
                            <option value="2">2 - Fair</option>
                            <option value="3">3 - Good</option>
                            <option value="4">4 - Very Good</option>
                            <option value="5">5 - Excellent</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Comment</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your thoughts about the product..."
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition bg-white"
                            rows="4"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition duration-300">Submit Review</button>
                </form>
            )}

            {!isLoggedIn && (
                <p className="text-center text-gray-500 mb-6">
                    Please log in to write a review.
                </p>
            )}

            {isLoggedIn && !hasPurchased && (
                <p className="text-center text-gray-500 mb-6">
                    You must purchase this product to write a review.
                </p>
            )}

            {/* User's Review (on top, with edit option) */}
            {userReview && (
                <div className="bg-blue-50 border-blue-200 border-2 p-6 rounded-lg shadow-md mb-6">
                    <h3 className="text-xl font-semibold mb-3 text-blue-800">Your Review</h3>
                    {isEditing ? (
                        <form onSubmit={handleEditSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Rating</label>
                                <select
                                    value={editRating}
                                    onChange={(e) => setEditRating(e.target.value)}
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition bg-white"
                                    required
                                >
                                    <option value="1">1 - Poor</option>
                                    <option value="2">2 - Fair</option>
                                    <option value="3">3 - Good</option>
                                    <option value="4">4 - Very Good</option>
                                    <option value="5">5 - Excellent</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Comment</label>
                                <textarea
                                    value={editComment}
                                    onChange={(e) => setEditComment(e.target.value)}
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition bg-white"
                                    rows="4"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={() => setIsEditing(false)} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    Cancel
                                </button>
                                <button type="submit" className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition duration-300">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div>
                            <div className="flex items-center mb-2">
                                <div className="text-yellow-500 mr-2">
                                    {renderStars(userReview.rating)}
                                </div>
                                <p className="text-sm font-semibold text-gray-700">{userReview.user.firstName}</p>
                            </div>
                            <p className="text-gray-800">{userReview.comment}</p>
                            <p className="text-xs text-gray-400 mt-2">{new Date(userReview.createdAt).toLocaleDateString()}</p>
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-md shadow-md transition duration-300"
                                >
                                    Edit
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}


            {/* Other Reviews */}
            <div className="space-y-6">
                {otherReviews.length > 0 ? (
                    otherReviews.map(review => (
                        <div key={review.id} className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex items-center mb-2">
                                <div className="text-yellow-500 mr-2">
                                    {renderStars(review.rating)}
                                </div>
                                <p className="text-sm font-semibold text-gray-700">{review.user.firstName}</p>
                            </div>
                            <p className="text-gray-800">{review.comment}</p>
                            <p className="text-xs text-gray-400 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                    ))
                ) : (
                    !userReview && <p className="text-center text-gray-500">No reviews yet. Be the first to review this product!</p>
                )}
            </div>
        </div>
    );
}