import React from 'react';
import HeroSection from '../components/HeroSection';
import BrandSlider from '../components/BrandSlider';
import ProductSection from '../components/ProductSection';
import Banner from '../components/Banner';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';

const Home = () => {
  return (
    <main>
      <HeroSection />
      <BrandSlider />
      <ProductSection />
      <Banner />
      <Features />
      <Testimonials />
      <FAQ />
    </main>
  );
};

export default Home;