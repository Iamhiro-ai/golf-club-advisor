# ゴルフクラブアドバイザー - デプロイガイド

このアプリケーションは複数のプラットフォームでデプロイできます。

## 🚀 デプロイ方法

### 1. Netlify（推奨）

1. **GitHubリポジトリを準備**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/golf-club-advisor.git
   git push -u origin main
   ```

2. **Netlifyでデプロイ**
   - [Netlify](https://netlify.com)にアクセス
   - "New site from Git"をクリック
   - GitHubリポジトリを選択
   - ビルド設定：
     - Build command: `npm run build`
     - Publish directory: `dist`
   - 環境変数を設定：
     - `GEMINI_API_KEY`: あなたのGemini APIキー

### 2. Vercel

1. **Vercel CLIをインストール**
   ```bash
   npm i -g vercel
   ```

2. **デプロイ**
   ```bash
   vercel
   ```

3. **環境変数を設定**
   - Vercelダッシュボードで`GEMINI_API_KEY`を設定

### 3. GitHub Pages

1. **リポジトリ設定**
   - Settings > Pages
   - Source: "GitHub Actions"

2. **シークレットを設定**
   - Settings > Secrets and variables > Actions
   - `GEMINI_API_KEY`を追加

3. **プッシュで自動デプロイ**
   ```bash
   git push origin main
   ```

### 4. Firebase Hosting

1. **Firebase CLIをインストール**
   ```bash
   npm install -g firebase-tools
   ```

2. **初期化**
   ```bash
   firebase login
   firebase init hosting
   ```

3. **デプロイ**
   ```bash
   npm run build
   firebase deploy
   ```

## 🔧 環境変数

以下の環境変数を設定してください：

- `GEMINI_API_KEY`: Google Gemini APIキー

## 📦 ビルド

ローカルでビルドをテスト：

```bash
npm run build
npm run preview
```

## 🌐 カスタムドメイン

各プラットフォームでカスタムドメインを設定できます：

- **Netlify**: Domain management > Add custom domain
- **Vercel**: Settings > Domains
- **GitHub Pages**: Settings > Pages > Custom domain
- **Firebase**: Hosting > Custom domains

## 🔒 セキュリティ

- APIキーは環境変数として設定
- 本番環境ではHTTPSを強制
- 適切なCORS設定

## 📊 パフォーマンス

- 画像の最適化
- コード分割
- キャッシュ戦略
- CDNの活用

## 🐛 トラブルシューティング

### よくある問題

1. **APIキーが設定されていない**
   - 環境変数を確認
   - プラットフォームの設定を確認

2. **ビルドエラー**
   - Node.jsバージョンを確認（18以上推奨）
   - 依存関係を再インストール

3. **ルーティングエラー**
   - SPA設定を確認
   - リダイレクト設定を確認

## 📞 サポート

問題が発生した場合は、以下を確認してください：

1. ブラウザのコンソールエラー
2. ビルドログ
3. ネットワークタブでのAPI呼び出し 

## 解決方法

### 1. もう一度「main」ブランチにプッシュ

Vercelは「main」ブランチへのプッシュをトリガーに自動デプロイします。  
**何も変更していなくても、下記コマンドで再プッシュしてください：**

```bash
git commit --allow-empty -m "Trigger Vercel deploy"
git push origin main
```

---

### 2. プッシュ後の流れ

- プッシュが完了すると、Vercelの「Deployments」タブに新しいデプロイが表示されます。
- 数分待つと「Production」デプロイが完了し、`golf-club-advisor.vercel.app` でアクセスできるようになります。

---

**上記コマンドを実行したら、Vercelの「Deployments」タブを確認してください！**  
もしエラーや進展があれば、その内容を教えてください。 