import { User, AuthFormData, UserPreferences } from '../types';

// ローカルストレージのキー
const AUTH_TOKEN_KEY = 'golf_advisor_auth_token';
const USER_DATA_KEY = 'golf_advisor_user_data';

// 簡易的な認証サービス（実際のプロダクションではFirebase AuthやAuth0などを使用）
export class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;

  private constructor() {
    this.loadUserFromStorage();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // ユーザー登録
  async register(formData: AuthFormData): Promise<User> {
    // 簡易的なバリデーション
    if (!formData.email || !formData.password || !formData.name) {
      throw new Error('すべての項目を入力してください。');
    }

    if (formData.password.length < 6) {
      throw new Error('パスワードは6文字以上で入力してください。');
    }

    // 既存ユーザーのチェック
    const existingUsers = this.getStoredUsers();
    if (existingUsers.find(user => user.email === formData.email)) {
      throw new Error('このメールアドレスは既に登録されています。');
    }

    // 新しいユーザーを作成
    const newUser: User = {
      id: this.generateUserId(),
      email: formData.email,
      name: formData.name!,
      createdAt: new Date(),
      preferences: {}
    };

    // ユーザーを保存
    existingUsers.push(newUser);
    this.saveUsersToStorage(existingUsers);

    // ログイン状態にする
    this.currentUser = newUser;
    this.saveUserToStorage(newUser);

    return newUser;
  }

  // ユーザーログイン
  async login(formData: AuthFormData): Promise<User> {
    if (!formData.email || !formData.password) {
      throw new Error('メールアドレスとパスワードを入力してください。');
    }

    const users = this.getStoredUsers();
    const user = users.find(u => u.email === formData.email);

    if (!user) {
      throw new Error('メールアドレスまたはパスワードが正しくありません。');
    }

    // 簡易的なパスワードチェック（実際のプロダクションではハッシュ化されたパスワードを使用）
    // ここでは簡易的にメールアドレスとパスワードの組み合わせをチェック
    const passwordHash = this.simpleHash(formData.password);
    const expectedHash = this.simpleHash(formData.email + formData.password);

    if (passwordHash !== expectedHash) {
      throw new Error('メールアドレスまたはパスワードが正しくありません。');
    }

    this.currentUser = user;
    this.saveUserToStorage(user);

    return user;
  }

  // ログアウト
  logout(): void {
    this.currentUser = null;
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
  }

  // 現在のユーザーを取得
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // 認証状態をチェック
  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  // ユーザー設定を更新
  updatePreferences(preferences: Partial<UserPreferences>): void {
    if (!this.currentUser) {
      throw new Error('ログインが必要です。');
    }

    this.currentUser.preferences = {
      ...this.currentUser.preferences,
      ...preferences
    };

    this.saveUserToStorage(this.currentUser);
    this.updateStoredUser(this.currentUser);
  }

  // プライベートメソッド
  private generateUserId(): string {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  }

  private getStoredUsers(): User[] {
    try {
      const usersJson = localStorage.getItem('golf_advisor_users');
      return usersJson ? JSON.parse(usersJson) : [];
    } catch {
      return [];
    }
  }

  private saveUsersToStorage(users: User[]): void {
    localStorage.setItem('golf_advisor_users', JSON.stringify(users));
  }

  private updateStoredUser(updatedUser: User): void {
    const users = this.getStoredUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      this.saveUsersToStorage(users);
    }
  }

  private saveUserToStorage(user: User): void {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    localStorage.setItem(AUTH_TOKEN_KEY, 'dummy_token_' + user.id);
  }

  private loadUserFromStorage(): void {
    try {
      const userJson = localStorage.getItem(USER_DATA_KEY);
      if (userJson) {
        this.currentUser = JSON.parse(userJson);
      }
    } catch {
      this.currentUser = null;
    }
  }
}

export const authService = AuthService.getInstance(); 