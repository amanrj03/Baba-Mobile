import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQ = () => {
  // We keep track of the currently open FAQ by its index. 
  // 'null' means none are open.
  const [openIndex, setOpenIndex] = useState(null);

  // Array of objects containing both the question and the answer
  const faqs = [
    {
      question: "How long does shipping take?",
      answer: "Standard shipping typically takes 3-5 business days. Expedited shipping options are available at checkout for 1-2 day delivery."
    },
    {
      question: "Do you offer worldwide shipping?",
      answer: "Yes! We ship to over 100 countries worldwide. International shipping times and costs vary depending on the destination."
    },
    {
      question: "Are your products covered by warranty?",
      answer: "All our products come with a standard 1-year manufacturer's warranty covering any defects in materials or workmanship."
    },
    {
      question: "Can I return or exchange a product?",
      answer: "We offer a 30-day hassle-free return and exchange policy. Items must be returned in their original packaging and condition."
    },
    {
      question: "Are payments secure?",
      answer: "Absolutely. Our checkout process uses industry-standard 256-bit encryption to ensure your payment details are completely secure."
    }
  ];

  const toggleFaq = (index) => {
    // If clicking the one that's already open, close it (set to null). Otherwise, open it.
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto px-8 py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently asked questions</h2>
        <p className="text-gray-500">Everything you need to know before placing your order.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div key={idx} className="border-b border-gray-100">
              {/* Clickable Header */}
              <div 
                onClick={() => toggleFaq(idx)}
                className="flex items-center justify-between py-5 cursor-pointer hover:text-indigo-600 group transition-colors"
              >
                <h3 className={`text-lg font-medium transition-colors ${isOpen ? 'text-indigo-600' : 'text-gray-900 group-hover:text-indigo-600'}`}>
                  {faq.question}
                </h3>
                <div className="flex-shrink-0 ml-4">
                  {isOpen ? (
                    <Minus className="w-5 h-5 text-indigo-600" />
                  ) : (
                    <Plus className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                  )}
                </div>
              </div>

              {/* Expandable Answer */}
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-40 opacity-100 pb-5' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-gray-500 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQ;