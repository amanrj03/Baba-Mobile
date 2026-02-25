import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Headphones, Apple, Play } from 'lucide-react';
import logo from '../assets/logo.png';

const Footer = () => (
  <footer className="bg-[#f8f9fb] pt-20">
    <div className="max-w-7xl mx-auto px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
        
        <div className="lg:col-span-4">
          <div className="flex items-center gap-2 mb-6">
            <img src={logo} alt="Baba Mobiles" className="h-8 w-auto" />
          </div>
          <p className="text-gray-500 mb-8 leading-relaxed max-w-sm">
            Your trusted destination for the latest smartphones and mobile accessories. Quality products, competitive prices, and exceptional service.
          </p>
          <div>
            <span className="text-sm text-gray-500 block mb-4">Follow us on</span>
            <div className="flex gap-4 text-gray-400">
              <a href="#" className="hover:text-gray-900"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="hover:text-gray-900"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="hover:text-gray-900"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="hover:text-gray-900"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h4 className="font-semibold text-gray-900 mb-6 text-lg">Shop</h4>
          <ul className="space-y-4 text-gray-500">
            <li><a href="/shop" className="hover:text-indigo-600">All Products</a></li>
            <li><a href="/shop" className="hover:text-indigo-600">Smartphones</a></li>
            <li><a href="/shop" className="hover:text-indigo-600">Accessories</a></li>
            <li><a href="/shop" className="hover:text-indigo-600">New Arrivals</a></li>
            <li><a href="/shop" className="hover:text-indigo-600">Best Sellers</a></li>
            <li>
              <a href="/shop" className="flex items-center gap-2 hover:text-indigo-600">
                Sale <span className="text-[10px] text-red-500 bg-red-50 px-2 py-0.5 rounded-full font-medium">Hot deals</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h4 className="font-semibold text-gray-900 mb-6 text-lg">Support</h4>
          <ul className="space-y-4 text-gray-500">
            <li><a href="#" className="hover:text-indigo-600">Contact Us</a></li>
            <li><a href="#" className="hover:text-indigo-600">FAQs</a></li>
            <li><a href="#" className="hover:text-indigo-600">Shipping Info</a></li>
            <li><a href="#" className="hover:text-indigo-600">Returns</a></li>
            <li><a href="#" className="hover:text-indigo-600">Track Order</a></li>
          </ul>
        </div>

        <div className="lg:col-span-4">
          <h4 className="font-semibold text-gray-900 mb-6 text-lg">Newsletter</h4>
          <p className="text-gray-500 mb-6">Subscribe for latest updates, offers and exclusive deals from Baba Mobiles</p>
          <div className="flex flex-col gap-3">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500"
            />
            <button className="w-full bg-[#9b51e0] hover:bg-purple-700 text-white font-medium py-3 rounded-lg transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-b border-gray-200 py-8 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-4 md:border-r border-gray-200 md:pr-12">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-gray-100 shadow-sm">
            <Headphones className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <span className="text-xs text-gray-500 block">Mon - Sat: 9:00 AM - 9:00 PM</span>
            <span className="font-semibold text-gray-900">+91 98765 43210</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="text-center sm:text-left">
            <span className="font-semibold text-gray-900 block">Download Now on</span>
            <span className="text-sm text-gray-500">Get exclusive app-only deals and offers</span>
          </div>
          <div className="flex gap-3">
            <button className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors">
              <Apple className="w-5 h-5 fill-white" />
              <div className="text-left">
                <span className="text-[10px] block leading-none mb-0.5">Download on the</span>
                <span className="text-sm font-semibold leading-none">App Store</span>
              </div>
            </button>
            <button className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors">
              <Play className="w-5 h-5 fill-white" />
              <div className="text-left">
                <span className="text-[10px] block leading-none mb-0.5">GET IT ON</span>
                <span className="text-sm font-semibold leading-none">Google Play</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
        <p>© Copyright 2025 - Baba Mobiles. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-gray-900">Refund Policy</a>
          <a href="#" className="hover:text-gray-900">Terms of Service</a>
          <a href="#" className="hover:text-gray-900">Privacy Policy</a>
        </div>
      </div>

    </div>
  </footer>
);

export default Footer;