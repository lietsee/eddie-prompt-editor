import React from 'react';
import { Button } from '../common/Button';
import { 
  BookmarkIcon,
  ClipboardDocumentIcon,
  DocumentArrowDownIcon,
  PlusIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

export function ActionButtonGroup({ 
  onSave, 
  onCopy, 
  onExport, 
  onNew,
  isSaving = false 
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <Button 
        onClick={onSave} 
        variant="primary"
        loading={isSaving}
        icon={isSaving ? ArrowPathIcon : BookmarkIcon}
      >
        {isSaving ? '保存中...' : '保存'}
      </Button>
      
      <Button 
        onClick={onCopy} 
        variant="secondary"
        icon={ClipboardDocumentIcon}
      >
        コピー
      </Button>
      
      <Button 
        onClick={onExport} 
        variant="secondary"
        icon={DocumentArrowDownIcon}
      >
        MDファイルで出力
      </Button>
      
      <Button 
        onClick={onNew} 
        variant="ghost"
        icon={PlusIcon}
      >
        新規作成
      </Button>
    </div>
  );
}