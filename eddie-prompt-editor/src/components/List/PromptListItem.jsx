import React, { useState, useCallback, useRef } from 'react';
import { RatingStars } from './RatingStars';
import { RatingDialog } from '../Modal/RatingDialog';
import { 
  DocumentDuplicateIcon, 
  TrashIcon, 
  ClockIcon,
  SparklesIcon 
} from '@heroicons/react/24/outline';

export function PromptListItem({ 
  prompt, 
  onSelect, 
  onCopyAndEdit, 
  onDelete, 
  onRate,
  isSelected = false 
}) {
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const isActionClickedRef = useRef(false);


  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateContent = (content, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const handleCardClick = useCallback(() => {
    // モーダルが開いている場合、またはアクションボタンがクリックされた場合は無視
    if (isActionClickedRef.current || showRatingDialog) {
      return;
    }
    onSelect(prompt);
  }, [onSelect, prompt, showRatingDialog]);

  const handleCopyClick = useCallback((e) => {
    // カードクリック無効化
    isActionClickedRef.current = true;
    
    e.stopPropagation();
    e.preventDefault();
    onCopyAndEdit(prompt);
    
    // 100ms後にアクションフラグリセット
    setTimeout(() => {
      isActionClickedRef.current = false;
    }, 100);
  }, [onCopyAndEdit, prompt]);

  const handleDeleteClick = useCallback((e) => {
    // 確実なイベント阻止（最初に実行）
    e.stopPropagation();
    e.preventDefault();
    if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) {
      e.nativeEvent.stopImmediatePropagation();
    }
    
    // カードクリック無効化
    isActionClickedRef.current = true;
    
    // 親コンポーネントのonDeleteハンドラを呼び出す
    onDelete(prompt.id);
    
    // 100ms後にアクションフラグリセット
    setTimeout(() => {
      isActionClickedRef.current = false;
    }, 100);
  }, [onDelete, prompt.id]);

  const handleRate = (rating) => {
    onRate(prompt.id, rating);
  };


  return (
    <div
      className={`group relative p-5 rounded-xl cursor-pointer transition-all duration-200 animate-slide-up ${
        isSelected 
          ? 'bg-gradient-to-br from-primary-50 to-accent-50 border-2 border-primary-200 shadow-glow' 
          : 'bg-white/80 backdrop-blur-sm border border-secondary-200 hover:bg-white hover:shadow-soft-lg hover:-translate-y-1'
      }`}
      onClick={handleCardClick}
    >

      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0 mr-3">
          <h3 className={`font-semibold truncate text-lg ${
            isSelected ? 'text-primary-900' : 'text-secondary-900'
          }`}>
            {prompt.title}
          </h3>
          <div className="flex items-center space-x-2 mt-1">
            <ClockIcon className="w-3 h-3 text-secondary-400" />
            <span className="text-xs text-secondary-500">
              {formatDate(prompt.updatedAt)}
            </span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div 
          className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 relative z-10"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) {
              e.nativeEvent.stopImmediatePropagation();
            }
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <button
            onClick={handleCopyClick}
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            className="p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-150"
            title="コピーして編集"
          >
            <DocumentDuplicateIcon className="w-4 h-4" />
          </button>
          <button
            onClick={handleDeleteClick}
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            className="p-2 text-secondary-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
            title="削除"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Preview */}
      <div className="mb-4">
        <p className="text-sm text-secondary-600 leading-relaxed">
          {truncateContent(prompt.content)}
        </p>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center">
        <div 
          onClick={(e) => {
            e.stopPropagation();
            setShowRatingDialog(true);
          }}
          className="cursor-pointer"
        >
          <RatingStars rating={prompt.rating} readOnly={false} size="small" />
        </div>
        
        {isSelected && (
          <div className="flex items-center space-x-1 text-primary-600">
            <SparklesIcon className="w-4 h-4" />
            <span className="text-xs font-medium">編集中</span>
          </div>
        )}
      </div>

      {/* Gradient Overlay */}
      {isSelected && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-500/5 to-accent-500/5 pointer-events-none"></div>
      )}

      <RatingDialog
        isOpen={showRatingDialog}
        onClose={() => setShowRatingDialog(false)}
        onRate={handleRate}
        currentRating={prompt.rating}
      />
    </div>
  );
}