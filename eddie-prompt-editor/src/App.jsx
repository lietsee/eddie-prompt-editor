import React, { useState, useEffect } from 'react';
import { Editor } from './components/Editor/Editor';
import { PromptList } from './components/List/PromptList';
import { ToastProvider } from './components/common/Toast';
import { usePromptStorage } from './hooks/usePromptStorage';
import { usePwaInstaller } from './hooks/usePwaInstaller';
import { Button } from './components/common/Button';
import { 
  SparklesIcon, 
  ArrowDownTrayIcon, 
  Squares2X2Icon,
  DocumentTextIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

function App() {
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [editorKey, setEditorKey] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const {
    prompts,
    loading,
    error,
    savePrompt,
    deletePrompt,
    updateRating,
    searchPrompts,
    reload
  } = usePromptStorage();

  const { isInstallable, isInstalled, install } = usePwaInstaller();

  const handleSelectPrompt = (prompt) => {
    setSelectedPrompt(prompt);
    setEditorKey(prev => prev + 1);
    setIsMobileMenuOpen(false); // Close mobile menu when selecting
  };

  const handleCopyAndEdit = (prompt) => {
    setSelectedPrompt({
      ...prompt,
      id: null, // Clear ID to create new prompt
      title: `${prompt.title} (コピー)`,
    });
    setEditorKey(prev => prev + 1);
    setIsMobileMenuOpen(false);
  };

  const handleSavePrompt = async (promptData) => {
    const savedPrompt = await savePrompt(promptData);
    
    if (promptData.id) {
      // 既存プロンプトの編集の場合
      const updated = prompts.find(p => p.id === promptData.id);
      if (updated) {
        setSelectedPrompt(updated);
      }
    } else {
      // 新規プロンプトの場合、保存後は新規作成モードのまま
      // 保存されたプロンプトを返す（Editorで使用）
    }
    
    return savedPrompt;
  };

  const handleNewPrompt = () => {
    setSelectedPrompt(null);
    setEditorKey(prev => prev + 1);
  };

  const handleDeletePrompt = async (promptId) => {
    await deletePrompt(promptId);
    if (selectedPrompt?.id === promptId) {
      setSelectedPrompt(null);
      setEditorKey(prev => prev + 1);
    }
  };

  const handleRatePrompt = async (promptId, rating) => {
    await updateRating(promptId, rating);
    if (selectedPrompt?.id === promptId) {
      setSelectedPrompt(prev => prev ? { ...prev, rating } : null);
    }
  };

  const handleInstallPwa = async () => {
    const success = await install();
    if (success) {
      console.log('PWA installed successfully');
    }
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-primary-50 to-accent-50">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDYwIDAgTCAwIDAgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="relative h-screen flex flex-col">
          {/* Header */}
          <header className="bg-white/80 backdrop-blur-md shadow-soft border-b border-white/20 safe-area-inset">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center shadow-lg">
                    <SparklesIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="hidden sm:block">
                    <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                      AI プロンプトエディタ
                    </h1>
                    <p className="text-sm text-secondary-600 hidden md:block">Eddie - Your AI Prompt Assistant</p>
                  </div>
                  <div className="block sm:hidden">
                    <h1 className="text-lg font-bold gradient-text">Eddie</h1>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 sm:space-x-4">
                  {/* Mobile Menu Button */}
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="lg:hidden p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    {isMobileMenuOpen ? (
                      <XMarkIcon className="w-5 h-5" />
                    ) : (
                      <Bars3Icon className="w-5 h-5" />
                    )}
                  </button>

                  {isInstallable && !isInstalled && (
                    <Button 
                      onClick={handleInstallPwa}
                      variant="secondary"
                      size="small"
                      icon={ArrowDownTrayIcon}
                      className="hidden sm:flex"
                    >
                      <span className="hidden md:inline">アプリをインストール</span>
                      <span className="md:hidden">インストール</span>
                    </Button>
                  )}
                  <div className="flex items-center space-x-2 px-2 sm:px-3 py-2 bg-primary-50 rounded-xl border border-primary-100">
                    <Squares2X2Icon className="w-4 h-4 text-primary-600" />
                    <span className="text-sm font-medium text-primary-700">
                      {prompts.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 flex overflow-hidden max-w-7xl mx-auto w-full">
            {/* Left Panel - Prompt List */}
            <div className={`${
              isMobileMenuOpen ? 'block' : 'hidden'
            } lg:block fixed lg:relative inset-0 lg:inset-auto z-40 lg:z-auto w-full lg:w-1/3 lg:min-w-[400px] bg-white/95 lg:bg-white/60 backdrop-blur-sm border-r border-white/20 flex flex-col h-full`}>
              <div className="flex-shrink-0 p-4 sm:p-6 border-b border-white/20 bg-white/40">
                <div className="flex items-center justify-between lg:justify-start space-x-2 mb-1">
                  <DocumentTextIcon className="w-5 h-5 text-secondary-600" />
                  <h2 className="text-lg font-semibold text-secondary-900">
                    保存済みプロンプト
                  </h2>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="lg:hidden p-2 text-secondary-400 hover:text-secondary-600 rounded-lg"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-secondary-600">
                  作成したプロンプトを管理・編集できます
                </p>
              </div>
              <div className="flex-1 min-h-0">
                <PromptList
                  prompts={prompts}
                  loading={loading}
                  error={error}
                  onSelectPrompt={handleSelectPrompt}
                  onCopyAndEdit={handleCopyAndEdit}
                  onDeletePrompt={handleDeletePrompt}
                  onRatePrompt={handleRatePrompt}
                  onSearch={searchPrompts}
                  selectedPromptId={selectedPrompt?.id}
                />
              </div>
            </div>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
              <div 
                className="lg:hidden fixed inset-0 bg-black/50 z-30"
                onClick={() => setIsMobileMenuOpen(false)}
              />
            )}

            {/* Right Panel - Editor */}
            <div className="flex-1 bg-white/60 backdrop-blur-sm flex flex-col">
              <div className="p-4 sm:p-6 border-b border-white/20 bg-white/40">
                <div className="flex items-center space-x-2 mb-1">
                  <SparklesIcon className="w-5 h-5 text-primary-600" />
                  <h2 className="text-lg font-semibold text-secondary-900">
                    プロンプト編集
                  </h2>
                </div>
                <p className="text-sm text-secondary-600">
                  AIプロンプトを作成・編集してください
                </p>
              </div>
              <div className="flex-1 p-4 sm:p-6 overflow-hidden">
                <Editor
                  key={editorKey}
                  initialTitle={selectedPrompt?.title || ''}
                  initialContent={selectedPrompt?.rawContent || selectedPrompt?.content || ''}
                  promptId={selectedPrompt?.id}
                  onSave={handleSavePrompt}
                  onNew={handleNewPrompt}
                  nlpEnabled={true}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="bg-white/80 backdrop-blur-md border-t border-white/20 safe-area-inset">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
              <div className="text-center">
                <p className="text-xs text-secondary-500">
                  <span className="inline-flex items-center space-x-1 flex-wrap justify-center">
                    <span>🔒 データはブラウザのローカルストレージに安全に保存されます</span>
                    <span className="mx-2 hidden sm:inline">•</span>
                    <span>💾 定期的なMDエクスポートでバックアップを推奨</span>
                  </span>
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </ToastProvider>
  );
}

export default App;