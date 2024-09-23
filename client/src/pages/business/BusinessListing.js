import React from 'react';
import { FaStar } from 'react-icons/fa'; // For rating stars
import { Link } from 'react-router-dom'; // Import Link for navigation

const BusinessListing = ({ businesses }) => {
    return (
        <div className="container mx-auto p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {businesses.map((business, index) => (
                    <div key={index} className="card bg-white shadow-lg rounded-lg overflow-hidden">
                        {/* Business Logo and Name */}
                        <div className="flex items-center p-4">
                            <img
                                className="w-16 h-16 object-cover rounded-full"
                                src={business.logo}
                                alt={`${business.name} logo`}
                            />
                            <Link to={`/business/${business._id}`} className="text-xl font-semibold ml-4">
                                {business.name}
                            </Link>
                        </div>

                        {/* Image Carousel */}
                        {business.photos && business.photos.length > 0 && (
                            <div className="carousel w-full h-40 overflow-hidden">
                                <div className="flex">
                                    {business.photos.map((photo, i) => (
                                        <div key={i} className="w-full flex-shrink-0">
                                            <img
                                                className="w-full h-full object-cover"
                                                src={photo}
                                                alt={`Business Photo ${i + 1}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Rating and Address */}
                        <div className="flex justify-between items-center p-4">
                            <div className="flex items-center">
                                <FaStar className="text-yellow-500" />
                                <span className="ml-2 text-lg">{business.rating}</span>
                            </div>
                            <p className="text-sm text-gray-500">{business.address}</p>
                        </div>

                        {/* Short Description */}
                        <div className="p-4">
                            <p className="text-sm text-gray-700">{business.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BusinessListing;
