import React, { useState } from 'react';
import { Button } from '../common/Button';
import { StarIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

export function RatingDialog({ isOpen, onClose, onRate, currentRating = null }) {
  const [rating, setRating] = useState(currentRating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);

  if (!isOpen) return null;

  const handleRate = () => {
    if (rating > 0) {
      onRate(rating);
      onClose();
    }
  };

  const displayRating = hoveredRating || rating;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-fade-in">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
        
        <div className="relative bg-white/95 backdrop-blur-md rounded-2xl max-w-sm w-full p-6 shadow-soft-lg border border-white/20 animate-slide-up">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>

          {/* Icon */}
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl mb-4">
            <StarIconSolid className="w-6 h-6 text-yellow-600" />
          </div>

          {/* Content */}
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">プロンプトを評価</h3>
          <p className="text-secondary-600 mb-6">このプロンプトの品質を5段階で評価してください</p>
          
          {/* Rating Stars */}
          <div className="flex justify-center mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className="p-2 focus:outline-none transition-transform hover:scale-110"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
              >
                {star <= displayRating ? (
                  <StarIconSolid className="w-8 h-8 text-yellow-400" />
                ) : (
                  <StarIcon className="w-8 h-8 text-secondary-300" />
                )}
              </button>
            ))}
          </div>

          {/* Rating Description */}
          {displayRating > 0 && (
            <div className="text-center mb-6">
              <p className="text-sm text-secondary-600">
                {displayRating === 1 && "改善が必要"}
                {displayRating === 2 && "あまり良くない"}
                {displayRating === 3 && "普通"}
                {displayRating === 4 && "良い"}
                {displayRating === 5 && "とても良い"}
              </p>
            </div>
          )}
          
          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={onClose}>
              キャンセル
            </Button>
            <Button 
              variant="primary" 
              onClick={handleRate}
              disabled={rating === 0}
            >
              評価を送信
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}