import React, { useState, useEffect, useRef } from 'react';
import LoginModal from '../components/LoginModal';

const Home = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: '📊',
      title: 'Dashboard',
      description: 'Real-time financial overview and insights'
    },
    {
      icon: '💳',
      title: 'Track Expenses',
      description: 'Manage all your financial transactions'
    },
    {
      icon: '📈',
      title: 'Analytics',
      description: 'Comprehensive financial reports'
    }
  ];

  const handleDotClick = (index) => {
    setCurrentSlide(index);
    if (sliderRef.current) {
      sliderRef.current.scrollTo({
        left: index * sliderRef.current.offsetWidth,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (sliderRef.current) {
      const scrollLeft = sliderRef.current.scrollLeft;
      const slideWidth = sliderRef.current.offsetWidth;
      const newSlide = Math.round(scrollLeft / slideWidth);
      setCurrentSlide(newSlide);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #f0f7ff 0%, #e0efff 100%)' }}>
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-20 animate-pulse" style={{ backgroundColor: '#669bbc', animation: 'float 6s ease-in-out infinite' }}></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-15 animate-pulse" style={{ backgroundColor: '#003049', animation: 'float 8s ease-in-out infinite' }}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full opacity-10 animate-pulse" style={{ backgroundColor: '#669bbc', animation: 'float 7s ease-in-out infinite' }}></div>
      </div>

      {/* Navbar */}
      <nav className="bg-white shadow-lg relative z-10 backdrop-blur-sm bg-opacity-95">
        <div className="container mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 md:space-x-3">
            <img 
              src="/HSFIN.png" 
              alt="HSFIN Logo" 
              className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 hover:scale-110 cursor-pointer"
              style={{ maxHeight: '48px' }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            />
            <div className="hidden md:block h-8 w-px bg-gray-300 mx-2"></div>
            <span className="hidden md:block text-lg font-semibold" style={{ color: '#003049' }}>HSfin</span>
          </div>
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="text-white px-4 md:px-6 py-2 md:py-2.5 rounded-lg transition-all hover:scale-105 shadow-md text-sm md:text-base font-semibold relative overflow-hidden group"
            style={{ backgroundColor: '#669bbc' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5588aa'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#669bbc'}
          >
            <span className="relative z-10">Login</span>
            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-20 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Heading with Animation */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-6 bg-gradient-to-r" style={{ 
              backgroundImage: 'linear-gradient(to right, #003049, #669bbc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Welcome to HSfin
            </h1>
          </div>

          {/* Subtitle with Animation */}
          <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-lg md:text-2xl lg:text-3xl mb-3 md:mb-6 font-semibold" style={{ color: '#669bbc' }}>
              Your Personal Finance Management Tool
            </p>
          </div>

          {/* Description with Animation */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-sm md:text-base lg:text-lg mb-6 md:mb-12 text-gray-600 max-w-2xl mx-auto leading-relaxed px-2">
              Manage your daily expenses, loans, credit cards, and more all in one place.
              Track your financial journey with ease and precision.
            </p>
          </div>

          {/* CTA Button with Animation */}
          <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="text-white px-6 md:px-10 py-2.5 md:py-4 rounded-xl text-base md:text-lg font-semibold transition-all hover:scale-110 shadow-2xl relative overflow-hidden group"
              style={{ backgroundColor: '#669bbc' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5588aa'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#669bbc'}
            >
              <span className="relative z-10 flex items-center space-x-2">
                <span>Get Started</span>
                <span className="text-lg md:text-xl">→</span>
              </span>
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
            </button>
          </div>

          {/* Feature Cards - Desktop Grid / Mobile Slider */}
          <div className={`mt-10 md:mt-20 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Desktop: Grid View */}
            <div className="hidden md:grid md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#003049' }}>{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Mobile: Slider View */}
            <div className="md:hidden">
              <div 
                ref={sliderRef}
                className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                onScroll={handleScroll}
              >
                {features.map((feature, index) => (
                  <div 
                    key={index} 
                    className="min-w-full snap-center px-2"
                  >
                    <div className="bg-white p-5 rounded-xl shadow-lg mx-2">
                      <div className="text-3xl mb-3 text-center">{feature.icon}</div>
                      <h3 className="text-lg font-bold mb-2 text-center" style={{ color: '#003049' }}>{feature.title}</h3>
                      <p className="text-sm text-gray-600 text-center">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Bottom Dots Navigation */}
              <div className="flex justify-center mt-4 space-x-2">
                {features.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentSlide === index 
                        ? 'w-6 bg-669bbc' 
                        : 'bg-gray-300'
                    }`}
                    style={{ 
                      backgroundColor: currentSlide === index ? '#669bbc' : '#d1d5db',
                      width: currentSlide === index ? '24px' : '8px'
                    }}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS Animation */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};

export default Home;

