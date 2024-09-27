import React, { useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';
import BusinessListing from '../pages/business/BusinessListing';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const HomePage = () => {
  const navigate = useNavigate();
  const businessListingRef = useRef(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };

  const services = [
    {
      title: "Welcome to Lorley",
      description: "Your one-stop platform for discovering businesses.",
      button1Text: "Join Us",
      button2Text: "Explore Businesses",
      image: "https://via.placeholder.com/1920x700?text=Welcome+to+Lorley"
    },
    {
      title: "Service 2",
      description: "Find local businesses easily.",
      image: "https://via.placeholder.com/1920x700?text=Service+2"
    },
    {
      title: "Service 3",
      description: "Read and write reviews.",
      image: "https://via.placeholder.com/1920x700?text=Service+3"
    }
  ];

  const handleExploreClick = () => {
    if (businessListingRef.current) {
      businessListingRef.current.scrollIntoView({ behavior: 'smooth' }); // Smoothly scroll to Business Listing
    }
  };

  return (
    <div className="w-full overflow-hidden">
      {/* Carousel Section */}
      <Slider {...settings} className="h-[700px]">
        {services.map((service, index) => (
          <div key={index} className="relative h-full">
            <img src={service.image} alt={service.title} className="object-cover w-full h-full shadow-lg" />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white p-4">
              <h3 className="text-4xl font-extrabold mb-4 text-center">{service.title}</h3>
              <p className="text-lg mb-6 text-center">{service.description}</p>
              {service.button1Text && (
                <div className="mt-8 space-x-4">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded shadow transition duration-200 ease-in-out transform hover:scale-105"
                    onClick={() => navigate('/business/register')}
                  >
                    {service.button1Text}
                  </button>
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded shadow transition duration-200 ease-in-out transform hover:scale-105"
                    onClick={handleExploreClick} // Update to call handleExploreClick
                  >
                    {service.button2Text}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </Slider>

      {/* Business Listing Section */}
      <div className="py-5 mb-10" ref={businessListingRef}> 
        <h2 className="text-4xl text-center font-semibold mb-8">Discover Nearby Businesses</h2>
        <BusinessListing /> {/* Render the Business Listing component here */}
      </div>
    </div>
  );
};

// Custom Previous Arrow Component
const CustomPrevArrow = (props) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-transparent p-2"
      style={{ display: 'flex', alignItems: 'center' }} // Center the arrow vertically
    >
      <FontAwesomeIcon icon={faChevronLeft} className="text-white text-3xl" />
    </button>
  );
};

// Custom Next Arrow Component
const CustomNextArrow = (props) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-transparent p-2"
      style={{ display: 'flex', alignItems: 'center' }} // Center the arrow vertically
    >
      <FontAwesomeIcon icon={faChevronRight} className="text-white text-3xl" />
    </button>
  );
};

export default HomePage;
