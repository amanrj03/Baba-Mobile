import React from 'react';
import girlImage from "../assets/girl.png";
import iphone from "../assets/iphone-landing.png";
import tablet from "../assets/tablet-landing.png";
import style from "../assets/style.png";

const HeroSection = () => (
  <div className="p-8 grid grid-cols-1 lg:grid-cols-7 gap-4 max-w-7xl mx-auto">
    <div className="lg:col-span-3 relative bg-gray-100 rounded-2xl overflow-hidden min-h-[550px]">
      <img src={girlImage} alt="VR Experience" className="absolute inset-0 w-full h-full object-cover object-top" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-8 text-white">
        <span className="bg-white text-gray-900 text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">Just Launched</span>
        <h2 className="text-3xl font-bold mb-2">Immersive VR Experience</h2>
        <p className="text-gray-200 text-sm mb-6 max-w-sm">Feel every detail with smooth motion, clear visuals, and total comfort.</p>
        <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">Discover Collection</button>
      </div>
    </div>

    <div className="lg:col-span-2 flex flex-col gap-4">
      <div className="flex-1 bg-[#efeeff] rounded-2xl p-4 flex flex-col items-center text-center">
        <span className="bg-white text-gray-800 text-xs font-medium px-3 py-1 rounded-full mb-5">Just Launched</span>
        <h3 className="text-gray-800 font-medium mb-4">Style That Moves With You</h3>
        <img src={style} alt="Smartwatch" className="w-[30rem] object-contain mix-blend-multiply" />
      </div>
      <div className="flex-1 bg-[#e6f6fe] rounded-2xl p-6 flex flex-col items-center text-center">
        <span className="bg-white text-gray-800 text-xs font-medium px-3 py-1 rounded-full mb-3">Tablet</span>
        <h3 className="text-gray-800 font-medium mb-4">A Bigger Screen for Bigger Ideas</h3>
        <img src={tablet} alt="Tablet" className="w-full max-w-[500px] object-contain mix-blend-multiply" />
      </div>
    </div>

    <div className="lg:col-span-2 bg-[#e9f2ff] rounded-2xl p-6 flex flex-col items-center text-center">
      <span className="bg-white text-gray-800 text-xs font-medium px-3 py-1 rounded-full mb-3 mt-4">Smartphone</span>
      <h3 className="text-gray-800 font-medium mb-8">Power and Performance Designed for Everyday Use</h3>
      <img src={iphone} alt="Smartphone" className="w-96 object-contain mix-blend-multiply" />
    </div>
  </div>
);

export default HeroSection;