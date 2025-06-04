# 🌟 AI プロンプトエディタ (Eddie)

**美しく、直感的で、高機能なAIプロンプト管理ツール**

AIプロンプトの作成、編集、管理を行うモダンなWebアプリケーション。Progressive Web App (PWA) として動作し、オフライン利用も可能です。

![Eddie Screenshot](https://via.placeholder.com/800x400/3b82f6/ffffff?text=Eddie+AI+Prompt+Editor)

## ✨ 主要機能

### 🎨 モダンなデザイン
- **グラスモーフィズム**: 美しいガラス質の半透明エフェクト
- **グラデーション背景**: 目に優しいカラーパレット
- **マイクロインタラクション**: 滑らかなアニメーションとホバーエフェクト
- **レスポンシブデザイン**: モバイル・タブレット・デスクトップ対応

### 📝 強力なエディタ機能
- **プロンプト編集**: リアルタイム文字数カウンター付きテキストエディタ
- **ログ削除機能**: console.log、タイムスタンプ、スタックトレースなどの自動削除
- **NLP自動提案**: kuromoji.jsを使用した日本語名詞の[]囲み提案
- **インテリジェントフォーマット**: 美しいmonospaceフォントとシンタックスハイライト

### 🏆 プロンプト管理
- **5段階評価システム**: 星評価でプロンプトの品質を管理
- **高度な検索機能**: タイトル・内容での部分一致検索
- **スマートソート**: 更新日時順、評価順での並び替え
- **タグシステム**: 将来の拡張に対応

### 💾 データ管理
- **データ永続化**: IndexedDBによるブラウザローカル保存
- **エクスポート機能**: Markdownファイルとしてダウンロード
- **安全性**: ローカルストレージによるプライバシー保護
- **バックアップ**: 簡単なファイルエクスポート

### 📱 PWA対応
- **オフライン利用**: インターネット接続なしでも動作
- **ホーム画面への追加**: ネイティブアプリのような体験
- **高速読み込み**: Service Workerによるキャッシュ戦略
- **プッシュ通知**: 将来の機能拡張に対応

## 🛠 技術スタック

### フロントエンド
- **React 18** - モダンなUIライブラリ
- **Vite** - 高速ビルドツール
- **Tailwind CSS** - ユーティリティファーストCSS
- **Heroicons** - 美しいSVGアイコン

### 状態管理
- **React Hooks** - useState, useReducer
- **カスタムHooks** - 再利用可能なロジック

### データ層
- **IndexedDB** - ブラウザ内データベース
- **Dexie** - IndexedDBラッパー

### NLP・AI
- **kuromoji.js** - 日本語形態素解析
- **自然言語処理** - 名詞検出・提案システム

### PWA
- **VitePWA** - PWA構成
- **Workbox** - Service Worker管理

## 🚀 クイックスタート

```bash
# リポジトリをクローン
git clone <repository-url>
cd eddie-prompt-editor

# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev

# ブラウザで http://localhost:5173 を開く
```

## 📁 プロジェクト構造

```
src/
├── components/
│   ├── Editor/          # 🖊️ エディタ関連コンポーネント
│   │   ├── Editor.jsx
│   │   ├── TitleInput.jsx
│   │   ├── ActionButtonGroup.jsx
│   │   └── NlpSuggestion.jsx
│   ├── List/            # 📋 プロンプト一覧関連
│   │   ├── PromptList.jsx
│   │   ├── PromptListItem.jsx
│   │   ├── RatingStars.jsx
│   │   └── SearchBar.jsx
│   ├── Modal/           # 🗂️ モーダルダイアログ
│   │   ├── ConfirmDialog.jsx
│   │   ├── RatingDialog.jsx
│   │   └── ExportSettingsDialog.jsx
│   └── common/          # 🔧 共通コンポーネント
│       ├── Button.jsx
│       └── Toast.jsx
├── hooks/               # 🪝 カスタムHooks
│   ├── usePromptStorage.js
│   ├── useNlpSuggest.js
│   ├── useLogCleaner.js
│   └── usePwaInstaller.js
├── utils/               # 🛠️ ユーティリティ関数
│   ├── indexeddb.js
│   ├── logCleaner.js
│   ├── nlpProcessor.js
│   ├── clipboard.js
│   └── fileExport.js
└── App.jsx              # 🏠 メインアプリケーション
```

## 🎨 デザインシステム

### カラーパレット
- **Primary**: ブルー系グラデーション (#3b82f6 → #2563eb)
- **Secondary**: グレー系 (#64748b)
- **Accent**: パープル系 (#d946ef)
- **Success**: グリーン系 (#10b981)
- **Warning**: イエロー系 (#f59e0b)
- **Error**: レッド系 (#ef4444)

### タイポグラフィ
- **見出し**: Inter Font, 太字
- **本文**: Inter Font, レギュラー
- **コード**: JetBrains Mono

### スペーシング
- **xs**: 0.5rem (8px)
- **sm**: 1rem (16px)
- **md**: 1.5rem (24px)
- **lg**: 2rem (32px)
- **xl**: 3rem (48px)

## 📱 レスポンシブデザイン

### ブレークポイント
- **sm**: 640px以上 (タブレット縦)
- **md**: 768px以上 (タブレット横)
- **lg**: 1024px以上 (デスクトップ)
- **xl**: 1280px以上 (大画面)

### モバイル対応
- ハンバーガーメニュー
- タッチフレンドリーなボタンサイズ
- スワイプジェスチャー対応
- セーフエリア対応

## 🔧 開発・ビルド

```bash
# 開発環境
npm run dev          # 開発サーバー起動 (http://localhost:5173)

# プロダクション
npm run build        # プロダクションビルド
npm run preview      # ビルド結果をプレビュー

# コード品質
npm run lint         # ESLintによるコード検査
```

## 🌐 デプロイ

### Vercelへのデプロイ
```bash
# プロダクションビルド
npm run build

# Vercel CLIを使用
npm i -g vercel
vercel --prod
```

### 他のプラットフォーム
- **Netlify**: distフォルダをドラッグ&ドロップ
- **Firebase Hosting**: firebase deployコマンド
- **GitHub Pages**: GitHub Actionsでの自動デプロイ

## 🔐 セキュリティ・プライバシー

- **ローカルストレージ**: すべてのデータはブラウザに保存
- **プライバシー保護**: 外部サーバーへのデータ送信なし
- **HTTPS必須**: Service Worker利用のため
- **CSP対応**: Content Security Policy設定済み

## 🐛 トラブルシューティング

### よくある問題

**Q: アプリが起動しない**
A: Node.js 16以上がインストールされているか確認してください

**Q: NLP機能が動作しない**
A: kuromoji.jsの辞書ファイルの読み込みに時間がかかる場合があります

**Q: PWAがインストールできない**
A: HTTPSでアクセスしているか確認してください

**Q: データが消えた**
A: ブラウザのキャッシュクリア時にデータが削除される可能性があります

### パフォーマンス最適化

- **遅延読み込み**: 大きなライブラリは必要時にロード
- **メモ化**: React.memoとuseMemoの活用
- **バンドル分割**: 動的インポートによるコード分割
- **画像最適化**: WebP形式の使用

## 🤝 コントリビューション

1. Forkして個人リポジトリに複製
2. 新しいブランチを作成 (`git checkout -b feature/新機能`)
3. 変更をコミット (`git commit -am '新機能を追加'`)
4. ブランチをプッシュ (`git push origin feature/新機能`)
5. Pull Requestを作成

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照

## 👨‍💻 作者

**Eddie Development Team**
- AI Assistant: Claude (Anthropic)
- Human Collaborator: [Your Name]

---

**🌟 Eddieで、AIプロンプトの管理をもっと美しく、もっと効率的に。**