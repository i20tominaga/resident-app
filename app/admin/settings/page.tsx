'use client';

import { useAuth } from '@/app/auth-context';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, Building2, Users, FileText, Bell } from 'lucide-react';

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleSave = async () => {
    setSaveStatus('saving');
    await new Promise(resolve => setTimeout(resolve, 500));
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">設定</h1>
        <p className="text-gray-600 mt-2">システム設定と管理者情報</p>
      </div>

      {/* Save Status */}
      {saveStatus === 'saved' && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            設定を保存しました
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Admin Profile */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                管理者情報
              </CardTitle>
              <CardDescription>あなたのプロフィール情報</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  メールアドレス
                </label>
                <Input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  お名前
                </label>
                <Input
                  value={user?.displayName || ''}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  ロール
                </label>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-100 text-blue-800">
                    スタッフ / 管理者
                  </Badge>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-xs text-gray-500">
                  個人情報の変更はサポートにお問い合わせください
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Building Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                建物設定
              </CardTitle>
              <CardDescription>
                管理している建物の情報
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>建物名</strong>
                </p>
                <p className="text-gray-900">シティタワー東京</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>住所</strong>
                </p>
                <p className="text-gray-900">東京都渋谷区</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>管理会社</strong>
                </p>
                <p className="text-gray-900">三菱地所リアルティ</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <strong>階数</strong>
                  </p>
                  <p className="text-gray-900">35階建て</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <strong>戸数</strong>
                  </p>
                  <p className="text-gray-900">280戸</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                システム情報
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>アプリケーション</strong>
                </p>
                <p className="text-gray-900">Building Navigator v1.0</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>ステータス</strong>
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full" />
                  <p className="text-gray-900">稼働中</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>最終更新</strong>
                </p>
                <p className="text-gray-900">2025年2月18日</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">ダッシュボード</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">工事・点検</p>
                <p className="text-2xl font-bold text-blue-600">12</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">進行中</p>
                <p className="text-2xl font-bold text-red-600">2</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">住民</p>
                <p className="text-2xl font-bold text-gray-900">280</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="w-5 h-5" />
                通知設定
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">メール通知</span>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">イベント更新</span>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">住民問い合わせ</span>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>

              <Button
                onClick={handleSave}
                className="w-full bg-blue-600 hover:bg-blue-700 mt-4"
                disabled={saveStatus === 'saving'}
              >
                {saveStatus === 'saving' ? '保存中...' : '保存する'}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900 text-lg">ヘルプ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-800 mb-4">
                ご質問やサポートが必要な場合は、管理者にお問い合わせください。
              </p>
              <a
                href="mailto:support@buildingnavigator.com"
                className="text-blue-600 hover:text-blue-700 font-medium underline text-sm"
              >
                サポートに連絡 →
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
