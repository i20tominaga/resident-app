'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { AlertCircle, Building2, UserPlus, CheckCircle2, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';

export default function SignupPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get('code');
    const { signup, isAuthenticated } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');
    const [isValidating, setIsValidating] = useState(!!code);
    const [building, setBuilding] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, router]);

    useEffect(() => {
        const validateCode = async () => {
            if (!code) return;
            try {
                const response = await fetch(`/api/invites?code=${code}`);
                if (!response.ok) throw new Error('Invalid code');
                const data = await response.json();
                setBuilding(data.building);
            } catch (err) {
                setError('無効または期限切れの招待コードです。');
            } finally {
                setIsValidating(false);
            }
        };

        validateCode();
    }, [code]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await signup(email, password, displayName);
            // Auth context will redirect or we can do it here
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || '登録に失敗しました。');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isValidating) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Building2 className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
                    <p className="text-gray-600">招待情報を確認中...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                    <div className="flex justify-center">
                        <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                            <Building2 className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Building Navigator</h1>
                    <p className="text-gray-500">住民アカウント作成</p>
                </div>

                {building && (
                    <Alert className="bg-blue-50 border-blue-200">
                        <CheckCircle2 className="h-5 w-5 text-blue-600" />
                        <AlertTitle className="text-blue-900 font-bold">{building.name} への招待</AlertTitle>
                        <AlertDescription className="text-blue-800">
                            この建物に自動的に登録されます。
                        </AlertDescription>
                    </Alert>
                )}

                {!code && !error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>招待コードが必要です</AlertTitle>
                        <AlertDescription>
                            住民登録には管理会社から発行された招待リンクが必要です。
                        </AlertDescription>
                    </Alert>
                )}

                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>エラー</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Card className="border-0 shadow-xl overflow-hidden">
                    <CardHeader className="bg-white border-b border-gray-50 pb-6 pt-8">
                        <CardTitle className="text-xl">アカウント詳細を入力</CardTitle>
                        <CardDescription>
                            全ての項目は必須です。
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">お名前</label>
                                <Input
                                    variant="premium"
                                    placeholder="田中 太郎"
                                    value={displayName}
                                    onChange={e => setDisplayName(e.target.value)}
                                    disabled={isSubmitting || (!building && !!code)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">メールアドレス</label>
                                <Input
                                    variant="premium"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    disabled={isSubmitting || (!building && !!code)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">パスワード</label>
                                <Input
                                    variant="premium"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    disabled={isSubmitting || (!building && !!code)}
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                                disabled={isSubmitting || (!building && !!code)}
                            >
                                {isSubmitting ? '登録中...' : '登録してログイン'}
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="bg-gray-50 flex justify-center py-4 text-sm">
                        <p className="text-gray-500">
                            すでにアカウントをお持ちですか？{' '}
                            <Link href="/login" className="text-blue-600 font-bold hover:underline">
                                ログイン
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
