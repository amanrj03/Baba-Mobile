import React from 'react';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const reviews = [
    {
      name: "Jaylon Vaccaro",
      text: "The product quality exceeded my expectations. The design feels premium and works flawlessly.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    {
      name: "Jaydon Saris",
      text: "Fast delivery and excellent packaging. Everything arrived perfectly and on time.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    {
      name: "Chance George",
      text: "Clean design, smooth performance, and very easy to use. I'll definitely order again.",
      avatar: "https://images.unsplash.com/photo-1530268729831-4b0b9e170218?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    {
      name: "Jaydon Franci",
      text: "Customer support was super helpful and responsive. Shopping here feels safe and reliable.",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    {
      name: "Roger Siphron",
      text: "Great value for money. The gadget looks stylish and performs better than expected",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    {
      name: "Carter Lipshutz",
      text: "Secure checkout, quick shipping, and high-quality products. Highly recommended.",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-8 py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
        <p className="text-gray-500">Real reviews from customers who trust our quality, design, and style.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review, idx) => (
          <div key={idx} className="bg-gray-50/80 rounded-2xl p-8 flex flex-col justify-between h-full">
            <div>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-8 leading-relaxed">{review.text}</p>
            </div>
            <div className="flex items-center gap-3">
              <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-full object-cover" />
              <span className="font-medium text-gray-900">{review.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;