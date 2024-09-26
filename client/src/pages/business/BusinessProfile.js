import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBusinessById } from '../../actions/businessAction'; // Adjust the path as needed
import { FaStar, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import Spinner from '../../components/Spinner'; // Create a spinner component or use an existing one

const BusinessProfile = ({ businessId }) => {
    const dispatch = useDispatch();
    const { business, loading } = useSelector((state) => state.business.businessDetails); // Ensure you access the correct state slice

    useEffect(() => {
        dispatch(fetchBusinessById(businessId));
    }, [dispatch, businessId]);

    if (loading) {
        return <Spinner />; // Show spinner while loading
    }

    // Check if business is undefined or does not contain photos
    if (!business || !business.photos) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-500 text-xl font-semibold">Business not found.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto flex justify-center mb-8">
            <div className="w-full lg:w-10/12">
                {/* Carousel */}
                <div className="carousel w-full h-96 relative">
                    {business.photos.length > 0 ? (
                        <div className="flex w-full h-full">
                            {business.photos.map((photo, index) => (
                                <div key={index} className="w-1/4 flex-shrink-0">
                                    <img className="w-full h-full object-cover" src={photo} alt={`Business Photo ${index + 1}`} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full h-full flex justify-center items-center bg-gray-200">
                            <p className="text-gray-500">No images available</p>
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <div className="flex flex-col lg:flex-row mt-6 justify-center items-stretch space-y-4 lg:space-y-0 lg:space-x-6">
                    {/* Left Section */}
                    <div className="lg:w-2/3 w-full p-6">
                        <div className="flex items-center justify-center lg:justify-start">
                            {business.logo && (
                                <img
                                    src={business.logo} // Assuming business.logo contains the URL for the logo
                                    alt={`${business.name} Logo`}
                                    className="w-12 h-12 mr-3 object-cover rounded-full" // Adjust size and styling as needed
                                />
                            )}
                            <h1 className="text-3xl font-semibold text-gray-800">{business.name}</h1>
                        </div>
                        
                        <div className="flex justify-center lg:justify-start items-center mt-4 space-x-2">
                            <div className="flex items-center">
                                {Array.from({ length: 5 }, (_, index) => (
                                    <FaStar key={index} className={`h-5 w-5 ${index < business.averageRating ? 'text-yellow-500' : 'text-gray-300'}`} />
                                ))}
                            </div>
                            <span className="ml-2 text-gray-500 text-sm">({business.totalReviews} reviews)</span>
                        </div>

                        <div className="mt-6 text-base text-gray-700 text-center lg:text-left leading-relaxed">
                            <p>Category: <span className="font-medium">{business.category}</span></p>
                            <div className="mt-6 flex justify-center lg:justify-start space-x-3">
                                <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-md hover:from-blue-600 hover:to-blue-700 transition-all duration-300 text-sm">
                                    Add Review
                                </button>
                                <button className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-md hover:from-gray-600 hover:to-gray-700 transition-all duration-300 text-sm">
                                    Share
                                </button>
                            </div>
                        </div>

                        {/* Opening Hours Section */}
                        <div className="mt-8 bg-gray-100 p-4 rounded-md shadow">
                            <h2 className="text-lg font-medium mb-2">Opening Hours</h2>
                            <div className="flex flex-col">
                                {Object.entries(business.openingHours).map(([day, { open, close }]) => (
                                    <div key={day} className="flex justify-between py-1 border-b last:border-b-0">
                                        <span className="text-gray-700">{day.charAt(0).toUpperCase() + day.slice(1)}</span>
                                        <span className="text-gray-500">{open} - {close}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="lg:w-1/3 w-full p-6">
                        <div className="text-center lg:text-left">
                            <h2 className="text-lg font-medium mb-4">Contact Information</h2>
                            <p className="mb-4 flex justify-center lg:justify-start items-center text-md">
                                <FaEnvelope className="mr-2" /> {business.email}
                            </p>
                            <p className="mb-4 flex justify-center lg:justify-start items-center text-md">
                                <FaPhoneAlt className="mr-2" /> {business.mobile} {/* Updated to use mobile */}
                            </p>
                            <p className="flex justify-center lg:justify-start items-center text-md">
                                <FaMapMarkerAlt className="mr-2" /> {business.address}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Review Section */}
                <div className="w-full mt-12 bg-white p-6" style={{ minHeight: '200px' }}>
                    <h2 className="text-xl font-semibold mb-4">Reviews ({business.totalReviews})</h2>
                    <div className="p-4">
                        {business.totalReviews === 0 ? (
                            <p className="text-gray-600 text-center">No reviews yet. Be the first to add one!</p>
                        ) : (
                            <div>
                                {/* Reviews will be displayed here */}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessProfile;
