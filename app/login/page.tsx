'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Building2 } from 'lucide-react';
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
    setError('');

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError('ログインに失敗しました。メールアドレスとパスワードをご確認ください。');
    }
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

        {/* Demo Hint */}
        {showHint && (
          <Alert className="mt-6 bg-secondary border-border">
            <AlertCircle className="h-4 w-4 text-primary" />
            <AlertDescription className="text-foreground text-sm">
              <strong>デモアカウント</strong>
              <br />
              メール: resident@example.com
              <br />
              パスワード: password123
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
