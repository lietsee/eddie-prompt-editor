import React, { useState, useRef, useEffect } from 'react';
import { TitleInput } from './TitleInput';
import { ActionButtonGroup } from './ActionButtonGroup';
import { NlpSuggestion } from './NlpSuggestion';
import { useNlpSuggest } from '../../hooks/useNlpSuggest';
import { useLogCleaner } from '../../hooks/useLogCleaner';
import { useToast } from '../common/Toast';
import { copyToClipboard } from '../../utils/clipboard';
import { exportToMarkdown } from '../../utils/fileExport';
import { ExportSettingsDialog } from '../Modal/ExportSettingsDialog';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

export function Editor({ 
  initialTitle = '',
  initialContent = '',
  promptId = null,
  onSave,
  onNew,
  nlpEnabled = true
}) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [currentPromptId, setCurrentPromptId] = useState(promptId);
  const [isSaving, setIsSaving] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  
  const textareaRef = useRef(null);
  const { addToast } = useToast();
  const { clean } = useLogCleaner();
  const { suggestions, loading: nlpLoading } = useNlpSuggest(content, nlpEnabled);

  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
    setCurrentPromptId(promptId);
  }, [initialTitle, initialContent, promptId]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const cleanedContent = clean(content);
      const defaultTitle = title || `新規プロンプト_${new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)}`;
      
      const promptData = {
        title: defaultTitle,
        content: cleanedContent,
        rawContent: content,
      };

      // 編集モードの場合のみIDを追加
      if (currentPromptId) {
        promptData.id = currentPromptId;
      }
      
      const savedPrompt = await onSave(promptData);
      
      // 新規作成の場合、保存後にIDを設定して編集モードに切り替え
      if (!currentPromptId && savedPrompt?.id) {
        setCurrentPromptId(savedPrompt.id);
      }
      
      addToast('プロンプトを保存しました！', 'success');
    } catch (error) {
      addToast('保存に失敗しました', 'error');
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = async () => {
    try {
      await copyToClipboard(content);
      addToast('クリップボードにコピーしました', 'success');
    } catch (error) {
      addToast('コピーに失敗しました', 'error');
      console.error('Copy error:', error);
    }
  };

  const handleExport = (settings) => {
    const cleanedContent = clean(content);
    exportToMarkdown(settings.title || title, cleanedContent);
    addToast('ファイルをダウンロードしました', 'success');
  };

  const handleNew = () => {
    setTitle('');
    setContent('');
    setCurrentPromptId(null); // 新規作成時はIDをクリア
    onNew();
  };

  const handleApplySuggestion = (newText, suggestion) => {
    setContent(newText);
    if (textareaRef.current) {
      // Set cursor position after the applied bracket
      const newPosition = suggestion.endIndex + 2; // +2 for the brackets
      textareaRef.current.setSelectionRange(newPosition, newPosition);
      textareaRef.current.focus();
    }
  };

  const charCount = content.length;
  const isEditingExisting = !!currentPromptId;

  return (
    <div className="flex flex-col h-full space-y-6 animate-fade-in">
      {/* Title Input */}
      <div className="space-y-2">
        <label className="flex items-center space-x-2 text-sm font-medium text-secondary-700">
          <DocumentTextIcon className="w-4 h-4" />
          <span>タイトル</span>
          {isEditingExisting && (
            <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-md">
              編集中
            </span>
          )}
        </label>
        <TitleInput value={title} onChange={setTitle} />
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-secondary-700">アクション</label>
        <ActionButtonGroup
          onSave={handleSave}
          onCopy={handleCopy}
          onExport={() => setShowExportDialog(true)}
          onNew={handleNew}
          isSaving={isSaving}
        />
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-secondary-700">プロンプト内容</label>
          <div className="flex items-center space-x-4 text-xs text-secondary-500">
            {nlpEnabled && nlpLoading && (
              <span className="flex items-center space-x-1">
                <div className="w-3 h-3 border border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                <span>NLP処理中...</span>
              </span>
            )}
            <span className="bg-secondary-100 px-2 py-1 rounded-lg">
              {charCount.toLocaleString()} 文字
            </span>
          </div>
        </div>
        
        <div className="relative flex-1 min-h-0" style={{ height: 'calc(100vh - 400px)' }}>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="ここにプロンプトを入力してください...

例:
あなたは親切で知識豊富なAIアシスタントです。
ユーザーの質問に対して、正確で有用な回答を提供してください。"
            className="w-full h-full p-6 bg-white/80 backdrop-blur-sm border border-secondary-200 rounded-xl shadow-soft resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 placeholder-secondary-400 font-mono text-sm leading-relaxed"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-500/2 to-accent-500/2 pointer-events-none"></div>
          
          {/* NLP Suggestions */}
          {nlpEnabled && !nlpLoading && (
            <NlpSuggestion
              text={content}
              suggestions={suggestions}
              onApplySuggestion={handleApplySuggestion}
              textareaRef={textareaRef}
            />
          )}
        </div>
      </div>

      {/* Export Dialog */}
      <ExportSettingsDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        onExport={handleExport}
        defaultTitle={title}
      />
    </div>
  );
}