import React, { useState } from 'react';
import { Button } from '../common/Button';
import { DocumentArrowDownIcon, XMarkIcon } from '@heroicons/react/24/outline';

export function ExportSettingsDialog({ 
  isOpen, 
  onClose, 
  onExport, 
  defaultTitle = '',
  defaultContent = ''
}) {
  const [title, setTitle] = useState(defaultTitle);
  const [includeTimestamp, setIncludeTimestamp] = useState(true);
  
  if (!isOpen) return null;

  const handleExport = () => {
    onExport({
      title: title || 'Untitled Prompt',
      includeTimestamp
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-fade-in">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
        
        <div className="relative bg-white/95 backdrop-blur-md rounded-2xl max-w-md w-full p-6 shadow-soft-lg border border-white/20 animate-slide-up">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>

          {/* Icon */}
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl mb-4">
            <DocumentArrowDownIcon className="w-6 h-6 text-primary-600" />
          </div>

          {/* Content */}
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">Markdownファイルとして出力</h3>
          <p className="text-secondary-600 mb-6">エクスポートの設定を選択してください</p>
          
          <div className="space-y-6 mb-6">
            <div>
              <label htmlFor="export-title" className="block text-sm font-medium text-secondary-700 mb-2">
                ファイル名
              </label>
              <input
                id="export-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="プロンプトのタイトル"
                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-secondary-200 rounded-xl shadow-soft focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex items-center h-6">
                <input
                  id="include-timestamp"
                  type="checkbox"
                  checked={includeTimestamp}
                  onChange={(e) => setIncludeTimestamp(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded transition-colors"
                />
              </div>
              <div className="text-sm">
                <label htmlFor="include-timestamp" className="font-medium text-secondary-700 cursor-pointer">
                  タイムスタンプを含める
                </label>
                <p className="text-secondary-500 mt-1">
                  ファイル名に作成日時を追加します
                </p>
              </div>
            </div>
          </div>
          
          {/* Preview */}
          <div className="bg-secondary-50 rounded-xl p-4 mb-6">
            <p className="text-xs text-secondary-600 mb-1">プレビュー:</p>
            <p className="text-sm font-mono text-secondary-800">
              {(title || 'Untitled_Prompt')}
              {includeTimestamp && '_2024-01-01_12-00-00'}
              .md
            </p>
          </div>
          
          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={onClose}>
              キャンセル
            </Button>
            <Button 
              variant="primary" 
              onClick={handleExport}
              icon={DocumentArrowDownIcon}
            >
              エクスポート
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}