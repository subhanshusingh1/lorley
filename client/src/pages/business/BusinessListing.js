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
        <div className="container mx-auto p-4 md:p-6">
            <h2 className="text-2xl font-bold text-center mb-4">Discover Nearby Businesses</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
                {(filteredBusinesses.length > 0 ? filteredBusinesses : Array.from({ length: placeholderCount })).map((business, index) => (
                    <div key={index} className="bg-white border border-gray-300 rounded-lg overflow-hidden transition-transform transform hover:scale-105 p-4">
                        {/* Business Logo and Name */}
                        <div className="flex items-center mb-2">
                            {business ? (
                                <>
                                    <img
                                        className="w-12 h-12 object-cover rounded-full"
                                        src={business.logo}
                                        alt={`${business.name} logo`}
                                    />
                                    <Link to={`/business/${business._id}`} className="text-lg font-semibold ml-2 hover:text-blue-600 transition-colors duration-200">
                                        {business.name}
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                    <div className="w-3/4 h-6 bg-gray-200 ml-2 rounded"></div>
                                </>
                            )}
                        </div>

                        {/* Image Carousel */}
                        {business && business.photos && business.photos.length > 0 ? (
                            <div className="w-full h-32 overflow-hidden mb-2">
                                <img
                                    className="w-full h-full object-cover"
                                    src={business.photos[0]} // Display the first photo for simplicity
                                    alt={`Business Photo`}
                                />
                            </div>
                        ) : (
                            <div className="w-full h-32 bg-gray-200 mb-2"></div>
                        )}

                        {/* Rating and Address */}
                        <div className="flex justify-between items-center mb-2">
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
                                        <div className="w-16 h-5 bg-gray-200"></div>
                                    </div>
                                    <div className="w-32 h-5 bg-gray-200"></div>
                                </>
                            )}
                        </div>

                        {/* Short Description */}
                        <div className="p-2">
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
