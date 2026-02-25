import React, { useState } from 'react';
import { Star, ShieldCheck, User, MessageSquarePlus } from 'lucide-react';
import { productAPI } from '../services/api';

const ProductReviews = ({ reviews, hasPurchased, productId }) => {
  const [reviewText, setReviewText] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const hasReviews = reviews && reviews.length > 0;

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!userRating || !reviewText.trim()) {
      setError("Please provide both rating and review text");
      return;
    }

    setSubmitting(true);
    setError("");
    
    try {
      console.log('Submitting review:', { productId, rating: userRating, comment: reviewText.trim() });
      const response = await productAPI.submitReview(productId, {
        rating: userRating,
        comment: reviewText.trim()
      });
      console.log('Review submitted successfully:', response.data);
      
      setSuccess(true);
      setReviewText("");
      setUserRating(0);
      
      // Reload page after 2 seconds to show new review
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error submitting review:', error);
      console.error('Error response:', error.response);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.detail || 
                          error.response?.data?.message ||
                          (error.response?.data ? JSON.stringify(error.response.data) : null) ||
                          "Failed to submit review. Please try again.";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-12 border-t border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Review Submission Area */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-2xl p-6 sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4">
              {hasReviews ? "Write a Review" : "Be the first to review!"}
            </h3>
            
            {hasPurchased ? (
              // Case 1: User HAS purchased
              <form onSubmit={handleSubmitReview}>
                <p className="text-sm text-gray-500 mb-4">Your feedback helps other shoppers make better choices.</p>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
                    Review submitted successfully! Refreshing...
                  </div>
                )}
                
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                      disabled={submitting}
                    >
                      <Star 
                        className={`w-7 h-7 ${star <= userRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                      />
                    </button>
                  ))}
                </div>
                <textarea 
                  rows="4"
                  placeholder="What did you like or dislike? How was the quality?"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  disabled={submitting}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9b51e0] mb-4 resize-none bg-white disabled:bg-gray-100"
                ></textarea>
                <button 
                  type="submit"
                  disabled={!userRating || !reviewText.trim() || submitting}
                  className="w-full bg-[#9b51e0] hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-all shadow-sm"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              // Case 2: User HAS NOT purchased
              <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm">
                <ShieldCheck className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-900 font-semibold mb-1">Verified Purchases Only</p>
                <p className="text-sm text-gray-500">
                  To ensure quality, only customers who bought this product can leave a review.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Review List Area */}
        <div className="lg:col-span-2">
          {hasReviews ? (
            // Sub-case A: Reviews Exist
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      {review.avatar ? (
                        <img src={review.avatar} alt={review.user} className="w-12 h-12 rounded-full object-cover border border-gray-100" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{review.user}</h4>
                        <p className="text-gray-400 text-xs">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base italic">
                    "{review.comment}"
                  </p>
                </div>
              ))}
            </div>
          ) : (
            // Sub-case B: No Reviews Exist (Empty State)
            <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <MessageSquarePlus className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">No reviews yet</h4>
              <p className="text-gray-500 text-center max-w-sm px-4">
                There are no reviews for this product. Help other customers by sharing your experience if you've purchased this item!
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProductReviews;