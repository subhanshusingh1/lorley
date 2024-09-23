import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';
import ReviewComponent from '../ReviewPage'; // Import your ReviewComponent
import { FaTrash, FaEdit } from 'react-icons/fa';

const BusinessProfile = ({ businessId, userId }) => { // Add userId prop to identify the logged-in user
    const [business, setBusiness] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [userReview, setUserReview] = useState(null); // To store the user's own review

    useEffect(() => {
        const fetchBusinessDetails = async () => {
            try {
                const response = await axios.get(`/api/business/${businessId}`);
                setBusiness(response.data);
                fetchReviews(); // Fetch reviews when business details are fetched
            } catch (error) {
                console.error('Error fetching business details:', error);
            }
        };

        const fetchReviews = async () => {
            try {
                const response = await axios.get(`/api/businesses/${businessId}/review`);
                setReviews(response.data.reviews);

                // Find the user's review if it exists
                const userReview = response.data.reviews.find(review => review.user._id === userId);
                setUserReview(userReview);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        fetchBusinessDetails();
    }, [businessId, userId]);

    const handleDeleteReview = async (reviewId) => {
        try {
            await axios.delete(`/api/reviews/${reviewId}`);
            setReviews(reviews.filter(review => review._id !== reviewId)); // Update the state to remove the deleted review
            if (userReview && userReview._id === reviewId) {
                setUserReview(null); // Clear user review if deleted
            }
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    if (!business) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="flex flex-col items-center space-y-4">
                    <FaSpinner className="animate-spin text-6xl text-blue-500" />
                    <p className="text-lg text-gray-600">Loading business details, please wait...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="business-profile container mx-auto p-6">
            {/* Banner - Carousel */}
            {business.photos && business.photos.length > 0 && (
                <div className="banner w-full h-64 relative">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="carousel w-full h-full flex">
                            {business.photos.map((photo, index) => (
                                <div key={index} className="w-full flex-shrink-0">
                                    <img
                                        className="w-full h-full object-cover"
                                        src={photo}
                                        alt={`Business Photo ${index + 1}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row mt-6">
                {/* Left Section: Business Logo, Name & Description */}
                <div className="lg:w-2/3 p-4">
                    {/* Business Logo */}
                    <div className="flex items-center space-x-4">
                        <img
                            className="w-32 h-32 object-cover rounded-full"
                            src={business.logo}
                            alt={`${business.name} logo`}
                        />
                        <h1 className="text-4xl font-bold">{business.name}</h1>
                    </div>

                    {/* Description */}
                    <div className="mt-4">
                        <p className="text-lg text-gray-700">{business.description}</p>
                    </div>
                </div>

                {/* Right Section: Contact, Address, and Opening Hours */}
                <div className="lg:w-1/3 p-4 border-l border-gray-200">
                    <div className="contact-details bg-gray-100 p-4 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                        <p className="mb-2"><strong>Phone:</strong> {business.contactNumber}</p>
                        <p className="mb-4"><strong>Address:</strong> {business.address}</p>
                        {business.openingHours && (
                            <div>
                                <h3 className="text-lg font-semibold">Opening Hours</h3>
                                <ul className="mt-2 space-y-2">
                                    {Object.entries(business.openingHours).map(([day, hours]) => (
                                        <li key={day} className="flex justify-between">
                                            <span>{day}:</span>{' '}
                                            <span>{hours.open} - {hours.close}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Review Section */}
            <div className="mt-10">
                <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
                <ReviewComponent businessId={businessId} userName="Your User Name" /> {/* Pass the user name prop */}
                {reviews.length > 0 ? (
                    <ul className="mt-4 space-y-4">
                        {reviews.map((review) => (
                            <li key={review._id} className="border p-4 rounded-lg shadow">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">{review.user.name}</span>
                                    <span className="text-yellow-500">{review.rating} ★</span>
                                </div>
                                <p className="mt-2">{review.comment}</p>
                                {userReview && userReview._id === review._id && ( // Show edit/delete options for user's own review
                                    <div className="flex space-x-2 mt-4">
                                        <button
                                            onClick={() => handleDeleteReview(review._id)}
                                            className="text-red-500 hover:underline flex items-center"
                                        >
                                            <FaTrash className="mr-1" /> Delete
                                        </button>
                                        <button
                                            // Add your edit logic here, e.g., open a modal with ReviewComponent prefilled
                                            className="text-blue-500 hover:underline flex items-center"
                                        >
                                            <FaEdit className="mr-1" /> Edit
                                        </button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="mt-4 text-gray-600">No reviews yet.</p>
                )}
            </div>
        </div>
    );
};

export default BusinessProfile;
