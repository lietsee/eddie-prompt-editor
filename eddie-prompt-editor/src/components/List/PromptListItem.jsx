import React, { useState } from 'react';
import { RatingStars } from './RatingStars';
import { RatingDialog } from '../Modal/RatingDialog';
import { ConfirmDialog } from '../Modal/ConfirmDialog';
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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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

  const handleRate = (rating) => {
    onRate(prompt.id, rating);
  };

  const handleDelete = () => {
    onDelete(prompt.id);
  };

  return (
    <div
      className={`group relative p-5 rounded-xl cursor-pointer transition-all duration-200 animate-slide-up ${
        isSelected 
          ? 'bg-gradient-to-br from-primary-50 to-accent-50 border-2 border-primary-200 shadow-glow' 
          : 'bg-white/80 backdrop-blur-sm border border-secondary-200 hover:bg-white hover:shadow-soft-lg hover:-translate-y-1'
      }`}
      onClick={() => onSelect(prompt)}
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
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCopyAndEdit(prompt);
            }}
            className="p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
            title="コピーして編集"
          >
            <DocumentDuplicateIcon className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteDialog(true);
            }}
            className="p-2 text-secondary-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
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

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="プロンプトを削除"
        message="このプロンプトを削除しますか？この操作は取り消せません。"
        confirmText="削除"
        cancelText="キャンセル"
      />
    </div>
  );
}