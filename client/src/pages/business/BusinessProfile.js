import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBusinessById } from '../../actions/businessAction'; // Adjust the path as needed
import { FaStar, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const BusinessProfile = ({ businessId }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Initialize navigate
    const { business } = useSelector((state) => state.business.businessDetails); // Ensure you access the correct state slice

    useEffect(() => {
        dispatch(fetchBusinessById(businessId));
    }, [dispatch, businessId]);

    // Determine if business data is available
    const isBusinessAvailable = !!business;

    // Function to handle review button click
    const handleAddReviewClick = () => {
        navigate(`/business/review`); // Change to your review page route
    };

    return (
        <div className="container mx-auto flex justify-center mb-8">
            <div className="w-full lg:w-10/12">
                {/* Carousel */}
                <div className="carousel w-full h-72 sm:h-96 relative"> {/* Adjusted height for smaller screens */}
                    {isBusinessAvailable && business.photos && business.photos.length > 0 ? (
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
                    <div className="lg:w-2/3 w-full p-4 sm:p-6"> {/* Added responsive padding */}
                        <div className="flex items-center justify-center lg:justify-start">
                            {isBusinessAvailable && business.logo && (
                                <img
                                    src={business.logo} // Assuming business.logo contains the URL for the logo
                                    alt={`${business.name} Logo`}
                                    className="w-12 h-12 mr-3 object-cover rounded-full" // Adjust size and styling as needed
                                />
                            )}
                            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800"> {/* Adjusted font size for smaller screens */}
                                {isBusinessAvailable ? business.name : "Business Name Not Available"}
                            </h1>
                        </div>

                        <div className="flex justify-center lg:justify-start items-center mt-4 space-x-2">
                            <div className="flex items-center">
                                {isBusinessAvailable ? (
                                    Array.from({ length: 5 }, (_, index) => (
                                        <FaStar key={index} className={`h-5 w-5 ${index < business.averageRating ? 'text-yellow-500' : 'text-gray-300'}`} />
                                    ))
                                ) : (
                                    Array.from({ length: 5 }, (_, index) => (
                                        <FaStar key={index} className="h-5 w-5 text-gray-300" />
                                    ))
                                )}
                            </div>
                            <span className="ml-2 text-gray-500 text-sm">
                                {isBusinessAvailable ? `(${business.totalReviews} reviews)` : "(0 reviews)"}
                            </span>
                        </div>

                        <div className="mt-6 text-base text-gray-700 text-center lg:text-left leading-relaxed">
                            <p>Category: <span className="font-medium">{isBusinessAvailable ? business.category : "N/A"}</span></p>
                            <div className="mt-6 flex justify-center lg:justify-start space-x-3">
                                <button 
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-md hover:from-blue-600 hover:to-blue-700 transition-all duration-300 text-sm"
                                    onClick={handleAddReviewClick} // Add onClick handler
                                >
                                    Add Review
                                </button>
                            </div>
                        </div>

                        {/* Opening Hours Section */}
                        <div className="mt-8 bg-gray-100 p-4 rounded-md shadow">
                            <h2 className="text-lg font-medium mb-2">Opening Hours</h2>
                            <div className="flex flex-col">
                                {isBusinessAvailable && business.openingHours ? (
                                    Object.entries(business.openingHours).map(([day, { open, close }]) => (
                                        <div key={day} className="flex justify-between py-1 border-b last:border-b-0">
                                            <span className="text-gray-700">{day.charAt(0).toUpperCase() + day.slice(1)}</span>
                                            <span className="text-gray-500">{open} - {close}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-600">Opening hours not available</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="lg:w-1/3 w-full p-4 sm:p-6"> {/* Added responsive padding */}
                        <div className="text-center lg:text-left">
                            <h2 className="text-lg font-medium mb-4">Contact Information</h2>
                            <p className="mb-4 flex justify-center lg:justify-start items-center text-md">
                                <FaEnvelope className="mr-2" /> {isBusinessAvailable ? business.email : "Email not available"}
                            </p>
                            <p className="mb-4 flex justify-center lg:justify-start items-center text-md">
                                <FaPhoneAlt className="mr-2" /> {isBusinessAvailable ? business.mobile : "Mobile not available"}
                            </p>
                            <p className="flex justify-center lg:justify-start items-center text-md">
                                <FaMapMarkerAlt className="mr-2" /> {isBusinessAvailable ? business.address : "Address not available"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Review Section */}
                <div className="w-full mt-12 bg-white p-6" style={{ minHeight: '200px' }}>
                    <h2 className="text-xl font-semibold mb-4">Reviews ({isBusinessAvailable ? business.totalReviews : 0})</h2>
                    <div className="p-4">
                        {isBusinessAvailable && business.totalReviews > 0 ? (
                            <div>
                                {/* Reviews will be displayed here */}
                            </div>
                        ) : (
                            <p className="text-gray-600 text-center">No reviews yet. Be the first to add one!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessProfile;
