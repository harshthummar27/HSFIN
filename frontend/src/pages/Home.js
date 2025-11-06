import React, { useState, useEffect, useRef } from 'react';
import LoginModal from '../components/LoginModal';
import logo from '../assets/HSFIN.png';

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
        <div className="container mx-auto px-3 md:px-4 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-1.5 md:space-x-2">
            <img 
              src={logo} 
              alt="HSFIN Logo" 
              className="h-8 md:h-10 w-auto object-contain transition-transform duration-300 hover:scale-110 cursor-pointer"
              style={{ maxHeight: '40px' }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            />
            <div className="hidden md:block h-6 w-px bg-gray-300 mx-1"></div>
            <span className="hidden md:block text-base font-semibold" style={{ color: '#003049' }}>@Harsh.Patel</span>
          </div>
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="text-white px-3 md:px-4 py-1.5 rounded-lg transition-all hover:scale-105 shadow-md text-sm font-semibold relative overflow-hidden group"
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
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-16 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Main Content - Two Column Layout on Desktop */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {/* Badge */}
              <div className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: '#e0efff', color: '#669bbc' }}>
                ✨ All-in-One Finance Solution
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r" style={{ 
                backgroundImage: 'linear-gradient(to right, #003049, #669bbc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: '1.2'
              }}>
                Welcome To HSFIN!
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl mb-4 font-semibold" style={{ color: '#669bbc' }}>
                Your Personal Finance Management Tool
              </p>

              {/* Description */}
              <p className="text-sm md:text-base mb-6 text-gray-600 leading-relaxed">
                Take complete control of your finances with HSFIN. Track expenses, manage loans, monitor credit cards, 
                and analyze your financial health—all from one powerful dashboard.
              </p>

              {/* Key Features List */}
              <div className="mb-6 space-y-2">
                <div className="flex items-center text-sm text-gray-700">
                  <span className="mr-2" style={{ color: '#669bbc' }}>✓</span>
                  <span>Real-time expense tracking and categorization</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <span className="mr-2" style={{ color: '#669bbc' }}>✓</span>
                  <span>Loan management and payment scheduling</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <span className="mr-2" style={{ color: '#669bbc' }}>✓</span>
                  <span>Credit card balance and transaction monitoring</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <span className="mr-2" style={{ color: '#669bbc' }}>✓</span>
                  <span>Comprehensive financial analytics and reports</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="text-white px-6 py-2.5 rounded-lg text-sm md:text-base font-semibold transition-all hover:scale-105 relative overflow-hidden group"
                  style={{ backgroundColor: '#669bbc' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5588aa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#669bbc'}
                >
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <span>Get Started Free</span>
                    <span>→</span>
                  </span>
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                </button>
                <button
                  onClick={() => {
                    const element = document.querySelector('.features-section');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-2.5 rounded-lg text-sm md:text-base font-semibold transition-all hover:scale-105 border-2"
                  style={{ borderColor: '#669bbc', color: '#669bbc', backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0f7ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Learn More
                </button>
              </div>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-3 gap-4 pt-6 border-t" style={{ borderColor: '#e5e7eb' }}>
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold" style={{ color: '#003049' }}>100%</div>
                  <div className="text-xs text-gray-600 mt-1">Secure</div>
                </div>
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold" style={{ color: '#003049' }}>24/7</div>
                  <div className="text-xs text-gray-600 mt-1">Access</div>
                </div>
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold" style={{ color: '#003049' }}>Free</div>
                  <div className="text-xs text-gray-600 mt-1">Forever</div>
                </div>
              </div>
            </div>

            {/* Right Column - Visual Content */}
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="relative">
                {/* Feature Cards Preview */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 rounded-lg" style={{ backgroundColor: '#f0f7ff' }}>
                      <div className="text-2xl">📊</div>
                      <div>
                        <div className="text-sm font-semibold" style={{ color: '#003049' }}>Dashboard Overview</div>
                        <div className="text-xs text-gray-500">Real-time financial insights</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg" style={{ backgroundColor: '#f0f7ff' }}>
                      <div className="text-2xl">💳</div>
                      <div>
                        <div className="text-sm font-semibold" style={{ color: '#003049' }}>Expense Tracking</div>
                        <div className="text-xs text-gray-500">Manage all transactions</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg" style={{ backgroundColor: '#f0f7ff' }}>
                      <div className="text-2xl">📈</div>
                      <div>
                        <div className="text-sm font-semibold" style={{ color: '#003049' }}>Analytics & Reports</div>
                        <div className="text-xs text-gray-500">Comprehensive analysis</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg" style={{ backgroundColor: '#f0f7ff' }}>
                      <div className="text-2xl">💰</div>
                      <div>
                        <div className="text-sm font-semibold" style={{ color: '#003049' }}>Loan Management</div>
                        <div className="text-xs text-gray-500">Track payments & schedules</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-20" style={{ backgroundColor: '#669bbc' }}></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full opacity-15" style={{ backgroundColor: '#003049' }}></div>
              </div>
            </div>
          </div>

          {/* Feature Cards - Desktop Grid / Mobile Slider */}
          <div className={`features-section mt-10 md:mt-16 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
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
                    <div className="bg-white p-5 rounded-xl mx-2">
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

