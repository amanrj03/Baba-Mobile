import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Importing logos from assets
import appleLogo from '../assets/applelogo.png';
import samsungLogo from '../assets/samsunglogo.png';
import xiaomiLogo from '../assets/xiomilogo.png';
import vivoLogo from '../assets/vivologo.jpg';
import nokiaLogo from '../assets/nokialogo.png';
import oneplusLogo from '../assets/onepluslogo.png';
import realmeLogo from '../assets/realmelogo.png';
import motorolaLogo from '../assets/motorolalogo.png';
import iqooLogo from '../assets/iqoologo.png';
import nothingLogo from '../assets/nothinglogo.png';

const BrandSlider = () => {
  const scrollRef = useRef(null);

  const brands = [
    { name: 'Apple', logo: appleLogo },
    { name: 'Samsung', logo: samsungLogo },
    { name: 'Xiaomi', logo: xiaomiLogo },
    { name: 'Vivo', logo: vivoLogo },
    { name: 'OnePlus', logo: oneplusLogo },
    { name: 'Realme', logo: realmeLogo },
    { name: 'Motorola', logo: motorolaLogo },
    { name: 'Nokia', logo: nokiaLogo },
    { name: 'iQOO', logo: iqooLogo },
    { name: 'Nothing', logo: nothingLogo },
  ];

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (direction === 'left') {
      current.scrollBy({ left: -300, behavior: 'smooth' });
    } else {
      current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 px-4 md:px-12 bg-white overflow-hidden">
      {/* Left-aligned Heading */}
      <div className="max-w-7xl mx-auto mb-12 text-left">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
          Explore Top Mobile Brands
        </h2>
        <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">
          Discover the leading manufacturers shaping the future of mobile technology. 
          Swipe to explore the giants of innovation.
        </p>
      </div>

      <div className="relative max-w-7xl mx-auto group">
        {/* Navigation Arrows */}
        <button 
          onClick={() => scroll('left')}
          className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
        >
          <ChevronLeft size={24} className="text-gray-600" />
        </button>

        <div 
          ref={scrollRef}
          className="flex items-center gap-12 md:gap-20 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {brands.map((brand, index) => (
            <div 
              key={index}
              className="flex-shrink-0 snap-center transition-transform duration-300 hover:scale-110 flex items-center justify-center w-[120px] md:w-[150px]"
            >
              {/* Fixed Height and Object Contain to normalize sizes */}
              <img 
                src={brand.logo} 
                alt={brand.name} 
                className="h-8 md:h-12 w-full object-contain pointer-events-none  transition-all duration-300"
              />
            </div>
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
        >
          <ChevronRight size={24} className="text-gray-600" />
        </button>
      </div>
    </section>
  );
};

export default BrandSlider;