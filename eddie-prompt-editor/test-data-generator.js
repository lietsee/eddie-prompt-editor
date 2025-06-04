// テスト用のプロンプトデータを生成してIndexedDBに保存
async function generateTestData() {
  const { db, PromptDB } = await import('./src/utils/indexedDB.js');
  
  const testPrompts = [
    {
      title: "テストプロンプト1 - 長いタイトルでテストします",
      content: "これは最初のテストプロンプトです。スクロールバーのテストのために作成されました。長い内容を含んでいます。",
      rawContent: "これは最初のテストプロンプトです。スクロールバーのテストのために作成されました。長い内容を含んでいます。",
      rating: 5,
      createdAt: Date.now() - 1000000,
      updatedAt: Date.now() - 1000000
    },
    {
      title: "テストプロンプト2 - AI アシスタント",
      content: "あなたは親切で知識豊富なAIアシスタントです。ユーザーの質問に対して正確で有用な回答を提供してください。",
      rawContent: "あなたは親切で知識豊富なAIアシスタントです。ユーザーの質問に対して正確で有用な回答を提供してください。",
      rating: 4,
      createdAt: Date.now() - 800000,
      updatedAt: Date.now() - 800000
    },
    {
      title: "テストプロンプト3 - コーディング支援",
      content: "プログラミングの専門家として、ユーザーのコーディング問題を解決してください。明確で実践的なアドバイスを提供してください。",
      rawContent: "プログラミングの専門家として、ユーザーのコーディング問題を解決してください。明確で実践的なアドバイスを提供してください。",
      rating: 5,
      createdAt: Date.now() - 600000,
      updatedAt: Date.now() - 600000
    },
    {
      title: "テストプロンプト4 - 創作支援",
      content: "クリエイティブライターとして、ユーザーの創作活動をサポートしてください。想像力豊かなアイデアを提供してください。",
      rawContent: "クリエイティブライターとして、ユーザーの創作活動をサポートしてください。想像力豊かなアイデアを提供してください。",
      rating: 3,
      createdAt: Date.now() - 400000,
      updatedAt: Date.now() - 400000
    },
    {
      title: "テストプロンプト5 - 学習支援",
      content: "教育専門家として、ユーザーの学習をサポートしてください。わかりやすい説明と実例を提供してください。",
      rawContent: "教育専門家として、ユーザーの学習をサポートしてください。わかりやすい説明と実例を提供してください。",
      rating: 4,
      createdAt: Date.now() - 200000,
      updatedAt: Date.now() - 200000
    },
    {
      title: "テストプロンプト6 - ビジネス分析",
      content: "ビジネスアナリストとして、データの分析と洞察を提供してください。実用的な提案をしてください。",
      rawContent: "ビジネスアナリストとして、データの分析と洞察を提供してください。実用的な提案をしてください。",
      rating: 5,
      createdAt: Date.now() - 100000,
      updatedAt: Date.now() - 100000
    },
    {
      title: "テストプロンプト7 - 翻訳支援",
      content: "プロの翻訳者として、正確で自然な翻訳を提供してください。文化的なニュアンスも考慮してください。",
      rawContent: "プロの翻訳者として、正確で自然な翻訳を提供してください。文化的なニュアンスも考慮してください。",
      rating: 4,
      createdAt: Date.now() - 50000,
      updatedAt: Date.now() - 50000
    },
    {
      title: "テストプロンプト8 - デザイン相談",
      content: "UX/UIデザイナーとして、ユーザーエクスペリエンスの改善提案をしてください。具体的なソリューションを提供してください。",
      rawContent: "UX/UIデザイナーとして、ユーザーエクスペリエンスの改善提案をしてください。具体的なソリューションを提供してください。",
      rating: 5,
      createdAt: Date.now() - 10000,
      updatedAt: Date.now() - 10000
    }
  ];

  try {
    for (const prompt of testPrompts) {
      await PromptDB.save(prompt);
    }
    console.log('テストデータを8件作成しました');
  } catch (error) {
    console.error('テストデータの作成に失敗:', error);
  }
}

// ブラウザのコンソールで実行するためのスクリプト
console.log('テストデータを生成するには、以下をコンソールで実行してください:');
console.log('generateTestData()');

if (typeof window !== 'undefined') {
  window.generateTestData = generateTestData;
}