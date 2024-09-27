import React, { useEffect } from 'react';
import { FaStar } from 'react-icons/fa'; 
import { Link, useLocation } from 'react-router-dom'; 
import { useDispatch, useSelector } from 'react-redux'; 
import { fetchAllBusinesses } from '../../actions/businessAction'; 

const BusinessListing = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { businesses = [], loading, error } = useSelector((state) => state.business); // Default businesses to empty array

    // Extract search query from URL
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search') || '';

    useEffect(() => {
        dispatch(fetchAllBusinesses());
    }, [dispatch]);

    if (loading) {
        return <div className="text-center text-gray-500">Loading businesses...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    // Filter businesses based on search query
    const filteredBusinesses = businesses.filter(business =>
        business.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Define how many placeholder cards you want to display
    const placeholderCount = 4;

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold text-center mb-6">Discover Nearby Businesses</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-6">
                {(filteredBusinesses.length > 0 ? filteredBusinesses : Array.from({ length: placeholderCount })).map((business, index) => (
                    <div key={index} className="bg-white border border-gray-300 rounded-lg overflow-hidden transition-transform transform hover:scale-105">
                        {/* Business Logo and Name */}
                        <div className="flex items-center p-4">
                            {business ? (
                                <>
                                    <img
                                        className="w-16 h-16 object-cover rounded-full"
                                        src={business.logo}
                                        alt={`${business.name} logo`}
                                    />
                                    <Link to={`/business/${business._id}`} className="text-xl font-semibold ml-4 hover:text-blue-600 transition-colors duration-200">
                                        {business.name}
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                                    <div className="w-3/4 h-6 bg-gray-200 ml-4 rounded"></div>
                                </>
                            )}
                        </div>

                        {/* Image Carousel */}
                        {business && business.photos && business.photos.length > 0 ? (
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
                        ) : (
                            <div className="w-full h-40 bg-gray-200"></div>
                        )}

                        {/* Rating and Address */}
                        <div className="flex justify-between items-center p-4">
                            {business ? (
                                <>
                                    <div className="flex items-center">
                                        {Array.from({ length: 5 }, (_, idx) => (
                                            <FaStar key={idx} className={idx < business.rating ? "text-yellow-500" : "text-gray-300"} />
                                        ))}
                                        <span className="ml-2 text-lg">{business.rating}</span>
                                    </div>
                                    <p className="text-sm text-gray-500">{business.address}</p>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center">
                                        <div className="w-24 h-5 bg-gray-200"></div>
                                    </div>
                                    <div className="w-32 h-5 bg-gray-200"></div>
                                </>
                            )}
                        </div>

                        {/* Short Description */}
                        <div className="p-4">
                            {business ? (
                                <p className="text-sm text-gray-700">{business.description}</p>
                            ) : (
                                <div className="w-full h-5 bg-gray-200"></div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BusinessListing;
