'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Building2, ShieldCheck, UserCog, User } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('resident@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [showHint, setShowHint] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await performLogin(email, password);
  };

  const performLogin = async (loginEmail: string, loginPassword: string) => {
    setError('');
    try {
      await login(loginEmail, loginPassword);
      router.push('/dashboard');
    } catch (err) {
      setError('ログインに失敗しました。メールアドレスとパスワードをご確認ください。');
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    await performLogin(demoEmail, demoPassword);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground text-center">Building Navigator</h1>
          <p className="text-muted-foreground text-center mt-1">工事・点検情報の見える化</p>
        </div>

        {/* Login Card */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">ログインする</CardTitle>
            <CardDescription>
              メールアドレスとパスワードを入力してください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  メールアドレス
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="resident@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  パスワード
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? 'ログイン中...' : 'ログインする'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        {showHint && (
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground ml-1">
              <span className="w-1 h-4 bg-primary rounded-full"></span>
              <span>デモアカウントでクイックログイン</span>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <Button
                variant="outline"
                className="justify-start h-auto py-3 px-4 border-dashed border-2 hover:border-primary/50 hover:bg-primary/5 group transition-all"
                onClick={() => handleDemoLogin('admin@example.com', 'adminpass123')}
                disabled={isLoading}
              >
                <div className="bg-primary/10 p-2 rounded-lg mr-3 group-hover:bg-primary/20 transition-colors">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-foreground">管理者としてログイン</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">admin@example.com / 全機能アクセス可能</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="justify-start h-auto py-3 px-4 border-dashed border-2 hover:border-primary/50 hover:bg-primary/5 group transition-all"
                onClick={() => handleDemoLogin('staff@example.com', 'staffpass123')}
                disabled={isLoading}
              >
                <div className="bg-primary/10 p-2 rounded-lg mr-3 group-hover:bg-primary/20 transition-colors">
                  <UserCog className="w-4 h-4 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-foreground">管理スタッフとしてログイン</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">staff@example.com / 建物・施設管理</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="justify-start h-auto py-3 px-4 border-dashed border-2 hover:border-primary/50 hover:bg-primary/5 group transition-all"
                onClick={() => handleDemoLogin('resident@example.com', 'password123')}
                disabled={isLoading}
              >
                <div className="bg-primary/10 p-2 rounded-lg mr-3 group-hover:bg-primary/20 transition-colors">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-foreground">住民としてログイン</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">resident@example.com / マイページ利用</div>
                </div>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
