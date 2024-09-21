import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const HomePage = () => {
  const settings = {
    dots: false, // Remove dots
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true, // Enable arrows
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />
  };

  const services = [
    {
      title: "Welcome to Lorley",
      description: "Your one-stop platform for discovering businesses.",
      button1Text: "Join Us",
      button2Text: "Explore Businesses",
      image: "https://via.placeholder.com/1920x1080?text=Welcome+to+Lorley"
    },
    {
      title: "Service 2",
      description: "Find local businesses easily.",
      image: "https://via.placeholder.com/1920x1080?text=Service+2"
    },
    {
      title: "Service 3",
      description: "Read and write reviews.",
      image: "https://via.placeholder.com/1920x1080?text=Service+3"
    }
  ];

  return (
    <div className="w-full h-screen overflow-hidden">
      <Slider {...settings} className="h-full">
        {services.map((service, index) => (
          <div key={index} className="relative h-screen">
            <img src={service.image} alt={service.title} className="object-cover w-full h-full" />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white p-4">
              <h3 className="text-4xl font-semibold">{service.title}</h3>
              <p className="text-xl mt-4">{service.description}</p>
              {service.button1Text && (
                <div className="mt-8 space-x-4">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
                    onClick={() => window.location.href='/register'}
                  >
                    {service.button1Text}
                  </button>
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
                    onClick={() => window.location.href='/business'}
                  >
                    {service.button2Text}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} slick-arrow slick-next`}
      style={{ ...style, display: 'block', right: '10px', zIndex: 1 }}
      onClick={onClick}
    />
  );
};

const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} slick-arrow slick-prev`}
      style={{ ...style, display: 'block', left: '10px', zIndex: 1 }}
      onClick={onClick}
    />
  );
};

export default HomePage;
