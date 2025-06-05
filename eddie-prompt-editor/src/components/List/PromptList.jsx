import React, { useState } from 'react';
import { SearchBar } from './SearchBar';
import { PromptListItem } from './PromptListItem';
import { ConfirmDialog } from '../Modal/ConfirmDialog';
import { DocumentTextIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

export function PromptList({ 
  prompts, 
  loading, 
  error,
  onSelectPrompt,
  onCopyAndEdit,
  onDeletePrompt,
  onRatePrompt,
  onSearch,
  selectedPromptId = null
}) {
  const [deletePromptId, setDeletePromptId] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteClick = (promptId) => {
    setDeletePromptId(promptId);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (deletePromptId) {
      onDeletePrompt(deletePromptId);
      setDeletePromptId(null);
      setShowDeleteDialog(false);
    }
  };

  const handleCancelDelete = () => {
    setDeletePromptId(null);
    setShowDeleteDialog(false);
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 p-4 sm:p-6">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary-600">プロンプトを読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 bg-red-50 border border-red-200 rounded-xl animate-slide-up">
        <div className="flex items-center space-x-3">
          <ExclamationCircleIcon className="w-6 h-6 text-red-600" />
          <div>
            <h3 className="text-red-800 font-medium">エラーが発生しました</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`h-full flex flex-col animate-fade-in ${showDeleteDialog ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="flex-shrink-0 p-4 sm:p-6 pb-0">
          <SearchBar onSearch={onSearch} />
        </div>
        
        <div className="flex-1 scrollbar-always-visible min-h-0 p-4 sm:p-6 pt-4" style={{ maxHeight: 'calc(100vh - 280px)' }}>
            {prompts.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gradient-to-br from-primary-100 to-accent-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-soft">
                  <DocumentTextIcon className="w-12 h-12 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                  プロンプトがまだありません
                </h3>
                <p className="text-secondary-600 max-w-sm mx-auto leading-relaxed">
                  右のエディタでAIプロンプトを作成してみましょう！
                  <br />
                  作成したプロンプトはここに表示されます。
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {prompts.map((prompt, index) => (
                    <div
                      key={prompt.id}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <PromptListItem
                        prompt={prompt}
                        onSelect={onSelectPrompt}
                        onCopyAndEdit={onCopyAndEdit}
                        onDelete={handleDeleteClick}
                        onRate={onRatePrompt}
                        isSelected={prompt.id === selectedPromptId}
                      />
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-secondary-200">
                  <p className="text-xs text-secondary-500 text-center">
                    {prompts.length} 件のプロンプトが保存されています
                  </p>
                </div>
              </>
            )}
        </div>
      </div>
      
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="プロンプトを削除"
        message="このプロンプトを削除しますか？この操作は取り消せません。"
        confirmText="削除"
        cancelText="キャンセル"
      />
    </>
  );
}