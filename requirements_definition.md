AI向けプロンプトエディタ 詳細要件定義
1. アプリケーション概要
AIに対するプロンプトの作成、編集、管理を行うWebアプリケーション。ログ自動削除機能、名詞の[]囲み自動提案機能、プロンプト評価機能、保存機能、コピー機能、Markdownファイル出力機能、およびオフラインアクセス機能を備える。Vercelへデプロイされ、クライアントサイドのみで完結するPWA (Progressive Web App) として動作する。

2. 技術スタック
フロントエンドフレームワーク: React (Hooks API使用)
状態管理: ReactのuseStateおよびuseReducer
CSSフレームワーク: Tailwind CSS
データ永続化: IndexedDB
オフライン/PWA: Service Worker (Workboxライブラリを使用)
NLP（名詞検出）: kuromoji.js (クライアントサイド形態素解析ライブラリ)
ファイル出力: FileSaver.js または標準のBlob API
3. アプリケーション構造
/src
  /components           // UIコンポーネント群
    /Editor
      Editor.jsx        // プロンプトエディタのメインコンポーネント
      TitleInput.jsx    // タイトル入力欄
      ActionButtonGroup.jsx // 各種アクションボタン群
      NlpSuggestion.jsx   // NLP提案の表示ロジック
    /List
      PromptList.jsx      // プロンプト一覧のメインコンポーネント
      PromptListItem.jsx  // 個々のプロンプトアイテム
      RatingStars.jsx     // 評価用の星表示と操作
      SearchBar.jsx       // 検索バー
    /Modal
      ConfirmDialog.jsx   // 確認ダイアログ（削除など）
      RatingDialog.jsx    // 評価モーダル
      ExportSettingsDialog.jsx // MDファイル出力設定ダイアログ
    /common
      Button.jsx          // 共通ボタンコンポーネント
      Toast.jsx           // トースト通知コンポーネント
  /hooks                // カスタムHooks群
    usePromptStorage.js   // IndexedDBとのデータ連携ロジック
    useNlpSuggest.js      // NLP処理ロジックと提案管理
    useLogCleaner.js      // ログ削除ロジックの適用
    usePwaInstaller.js    // PWAインストールプロンプト管理
  /utils                // ユーティリティ関数群
    indexeddb.js          // IndexedDB操作ヘルパー
    logCleaner.js         // ログ削除ロジック本体
    nlpProcessor.js       // kuromoji.jsを使ったNLP処理本体
    fileExport.js         // MDファイル出力ヘルパー
    clipboard.js          // クリップボード操作ヘルパー
  /assets               // 静的アセット (アイコン、画像など)
  App.jsx               // メインアプリケーションルートコンポーネント
  index.js              // アプリケーションエントリポイント
  index.css             // グローバルCSS (Tailwind CSSのインポートなど)
  service-worker.js     // Service Workerスクリプト
  manifest.json         // PWA Web App Manifest
4. データモデル
IndexedDBのストア名: prompts

Prompt オブジェクトの構造:

JavaScript

{
  id: string,                 // ユニークなID (UUIDv4形式を推奨)
  title: string,              // プロンプトタイトル (ユーザー入力。未入力時は自動生成)
  content: string,            // プロンプト本文 (ログ削除済み、[]囲み保持)
  rawContent: string,         // プロンプト本文 (ログ削除前、コピー機能用。保存時はcontentと同じ値でも可)
  createdAt: number,          // 作成日時 (Unixタイムスタンプ)
  updatedAt: number,          // 更新日時 (Unixタイムスタンプ)
  rating: number | null,      // 評価 (1-5の整数。未評価はnull)
  tags: string[],             // 将来的な拡張用 (現時点では空配列)
}
IndexedDBインデックス: updatedAt, title, rating (検索・ソート用)

5. 機能詳細要件
5.1. アプリケーション起動と初期ロード
エントリポイント: index.jsがReactアプリケーションのルートコンポーネント (App.jsx) をレンダリングする。
IndexedDB初期化: App.jsx または usePromptStorage Hook内で、アプリケーション起動時にIndexedDB（データベースとpromptsストア）を初期化する。
PWAインストールプロンプト:
ブラウザのbeforeinstallpromptイベントを捕捉し、ユーザーがPWAをインストールするためのプロンプトを表示する。
ユーザーがインストールを許可した場合にprompt()メソッドを呼び出す。
一度インストールを拒否された場合は、別のタイミングやユーザー操作によって再提案するロジック（例: インストールボタンの表示）を検討する。
5.2. プロンプトエディタ (右ペイン)
テキストエリア:
HTMLの<textarea>要素を使用し、プロンプト文を自由に入力可能にする。
リアルタイムで文字数カウンターを表示する。
Undo/Redo機能はブラウザ標準のテキストエリア機能に依存する。
名詞の[]囲み自動提案機能 (useNlpSuggest.js / nlpProcessor.js):
検出ロジック:
kuromoji.jsをクライアントサイドでロードし、ユーザーがテキストを入力するたびに形態素解析を行う。
形態素解析結果から品詞が「名詞」と判定された単語を抽出する。
入力停止後、0.5秒程度のデバウンス処理を挟んでNLP処理を実行し、パフォーマンスへの影響を最小限に抑える。
提案UI:
検出された名詞の直後または下部に、ユーザーがその名詞を[]で囲むことを視覚的に提案するUI要素（例: 小さなアイコン、ハイライト、ツールチップ）を表示する。
ユーザーが提案UIをクリックまたはタップすると、該当の名詞がエディタ内で自動的に[と]で囲まれる。
ユーザー設定: アプリケーション設定画面（将来的に実装）で、この機能の有効/無効を切り替えられるようにする。デフォルトは有効。
アクションボタン群 (ActionButtonGroup.jsx):
「保存」ボタン:
クリック時、エディタの現在の内容をuseLogCleaner.jsで定義されたログ削除ロジックに通し、cleanContentを生成する。
タイトル入力欄が空の場合、"新規プロンプト_" + 現在日時 (YYYYMMDD_HHmmss)をデフォルトタイトルとし、ユーザーには変更を促す。
usePromptStorage.jsのsavePrompt関数を呼び出し、Promptオブジェクト（id、title、content=cleanContent、createdAt、updatedAt、rating=null、tags=[]）をIndexedDBに保存または更新する。
保存成功後、ユーザーに「プロンプトを保存しました！」のようなトースト通知を表示する。
「コピー」ボタン:
クリック時、エディタの現在の全内容（ログや[]囲みを含む）をclipboard.jsユーティリティを使用してクリップボードにコピーする。
コピー成功後、ユーザーに「クリップボードにコピーしました」のようなトースト通知を表示する。
「MDファイルで出力」ボタン:
クリック時、現在のエディタ内容（ログ削除済み、[]囲み保持）をMarkdown形式のファイルとして生成し、ダウンロードダイアログを表示する。
ファイル名は、プロンプトタイトル（サニタイズ済み）を基に、デフォルトで{タイトル}_YYYYMMDD_HHmmss.mdとする。
fileExport.jsユーティリティを使用し、Blobオブジェクトを生成してダウンロードトリガーを実行する。
「新規作成」ボタン:
クリック時、エディタのテキストエリアとタイトル入力欄をクリアする。
左ペインのプロンプトリストで現在選択されているアイテムのハイライトを解除し、新規プロンプト作成モードにする。
5.3. 保存済みプロンプト一覧/管理 (左ペイン)
プロンプト一覧 (PromptList.jsx):
usePromptStorage.jsを通じてIndexedDBから全てのプロンプトを読み込み、updatedAtの降順でソートして表示する。
各プロンプトアイテム (PromptListItem.jsx) は以下の情報を持つ:
プロンプトタイトル
更新日時
プロンプト内容のプレビュー（contentの先頭100文字程度を省略表示）
評価用の星アイコン (RatingStars.jsx)
削除ボタン
コピーして編集ボタン
プロンプトアイテムをクリックすると、そのプロンプトのcontentとtitleが右ペインのエディタにロードされ、編集可能な状態になる。
検索バー (SearchBar.jsx):
上部に検索入力欄を配置し、プロンプトのタイトルまたはcontentで部分一致検索をリアルタイムで実行し、リストに反映する。
プロンプト評価機能 (RatingStars.jsx / RatingDialog.jsx):
リストの各プロンプトアイテムに、現在の評価に応じた5つの星アイコン（例: ★★★☆☆）を表示する。
星アイコンをクリックすると、プロンプトIDと共に評価ダイアログ (RatingDialog.jsx) を表示する。
ダイアログ内でユーザーが1〜5の星を選択し、「評価を送信」ボタンをクリックすると、対象プロンプトのratingフィールドが更新され、リストに反映される。
削除ボタン:
各プロンプトアイテムにゴミ箱アイコンのボタンを配置。
クリック時、ConfirmDialog.jsxを介してユーザーに「このプロンプトを削除しますか？」という確認ダイアログを表示する。
ユーザーが削除を確定した場合、usePromptStorage.jsのdeletePrompt関数を呼び出してIndexedDBから対象プロンプトを削除し、リストを更新する。
コピーして編集ボタン:
各プロンプトアイテムにコピー＆編集アイコンのボタンを配置。
クリック時、選択されたプロンプトのcontentとtitleを右ペインのエディタにロードする。この際、新しいプロンプト作成モードとして扱い、右ペインの「保存」ボタンを押した際には新規IDで保存されるようにする。元のプロンプトは変更しない。
5.4. ログ削除ロジック (logCleaner.js)
logCleaner.jsは、与えられた文字列から以下のパターンを削除する関数を提供する。

コンソールログ:
console.log(...), console.error(...), console.warn(...), console.info(...), console.debug(...) の行を削除。
例: console.log('Hello'); → 削除
一般的なログレベル表記:
行頭または行中に[INFO], [DEBUG], [ERROR], [WARN], [FATAL], LOG:, INFO:, DEBUG:, ERROR: などの大文字ログレベル表記を含む行を削除。
例: [ERROR] An unexpected error occurred. → 削除
タイムスタンプ付きログ:
YYYY-MM-DD HH:MM:SS または YYYY/MM/DD HH:MM:SS などのタイムスタンプで始まる行を削除。
例: 2023-10-26 14:30:00 [INFO] User logged in. → 削除
スタックトレース:
Java/JavaScriptなどの典型的なスタックトレース行（例: at <function> (<file>:<line>:<column>)、Caused by:、java.lang.Exception: など）を削除。
特定の区切り線:
--- START LOG ---, --- END LOG ---, === LOG === のような明確なログブロックを示す区切り線に囲まれた内容を削除。これら区切り線自体も削除対象とする。
5.5. NLPによる名詞検出 (nlpProcessor.js)
nlpProcessor.jsは、kuromoji.jsを使用してテキストを形態素解析し、名詞を抽出する関数を提供する。

入力: プロンプトテキスト文字列
出力: 抽出された名詞の配列（各要素は { text: string, startIndex: number, endIndex: number } のオブジェクト）
設定: kuromoji.jsのデフォルト辞書を使用する。
6. PWA (Progressive Web App) 対応
Service Worker (service-worker.js):
Workboxライブラリ（workbox-webpack-pluginなど）を使用して実装する。
キャッシュ戦略: アプリの主要なHTML、CSS、JavaScriptファイル、および必要なアセット（アイコンなど）は、Cache FirstまたはStale-While-Revalidate戦略でキャッシュする。これにより、オフライン時でもアプリが起動・利用可能となる。
IndexedDBとの連携は、Service Workerからは直接行わず、クライアントサイドJS経由で行う。
Web App Manifest (manifest.json):
アプリの名前、ショートネーム、説明、テーマカラー、背景色、起動URL、表示モード（standalone）、アイコンなどを定義する。
ユーザーがホーム画面に追加できるようにする。
7. エラーハンドリングとユーザーエクスペリエンス
IndexedDB操作のエラー: 保存、読み込み、削除時のエラーは適切に捕捉し、ユーザーに分かりやすいトースト通知で伝える。
NLP処理のエラー: kuromoji.jsのロード失敗や処理エラーが発生した場合も、適切にハンドリングし、ユーザーにその旨を通知する。機能が一時的に無効になる場合があることを示す。
空の状態: プロンプトが一つも保存されていない場合、左ペインのリスト領域に「プロンプトがまだありません。右のエディタで作成しましょう！」のようなメッセージを表示する。
ローディング状態: IndexedDBからのデータ読み込みなど、時間がかかる処理がある場合は、適切なローディングインジケーター（スピナーなど）を表示する。
通知: 主要な操作（保存完了、コピー完了など）には、短時間のトースト通知を使用し、ユーザーにフィードバックを提供する。
データ喪失への警告: アプリケーションのフッターやヘルプページなどで、データがブラウザのローカルストレージ（IndexedDB）に保存されること、ブラウザのキャッシュクリアなどでデータが失われる可能性があることをユーザーに明確に告知する。定期的なMDファイルエクスポートを推奨する。
8. テスト戦略
AIは以下のテストコードを生成し、実装に含めるべきである。

単体テスト:
logCleaner.js: 各ログパターンに対する削除の正確性をテストする。
nlpProcessor.js: kuromoji.jsを使用した名詞検出の正確性、出力フォーマットをテストする。
indexeddb.js: IndexedDBのCRUD (Create, Read, Update, Delete) 操作の正確性をテストする。
各カスタムHook: それぞれのロジックが正しく動作するかをテストする。
結合テスト:
「保存」ボタンクリック時のログ削除とIndexedDBへの保存フロー。
プロンプトアイテムクリック時のエディタへのロードフロー。
「コピーして編集」機能の動作。
PWAテスト:
Service Workerが正しく登録され、主要なアセットがキャッシュされるか。
オフライン時にアプリが正しく起動し、機能が利用できるか。
Web App Manifestが正しく機能し、ホーム画面への追加が可能か。
エッジケーステスト:
空のプロンプト、非常に長いプロンプト、特殊文字を含むプロンプト。
ログパターンが非常に複雑なケース。
IndexedDBが空の状態やエラー状態。
NLPが名詞を検出しない場合。
ネットワーク接続がない状態での各種機能の挙動。
9. 開発環境とデプロイメント
開発環境: Reactアプリケーションの標準的な開発環境（例: Vite, Create React Appなど）を使用し、ホットリロード機能などを活用する。
ビルド: プロジェクトはVercelへデプロイ可能な形式にビルドされる（例: npm run build）。
デプロイ: Gitリポジトリ（GitHubなど）とVercelを連携させ、コードのプッシュをトリガーとした自動デプロイを設定する。