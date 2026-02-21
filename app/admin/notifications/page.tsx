'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, Send, Users, Filter } from 'lucide-react';

export default function NotificationsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'event_update',
    targetAudience: 'all',
    targetFloor: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Notification sent:', formData);
      setSubmitStatus('success');

      // Reset form
      setFormData({
        title: '',
        message: '',
        type: 'event_update',
        targetAudience: 'all',
        targetFloor: '',
      });

      setTimeout(() => setSubmitStatus('idle'), 3000);
    } catch (err) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const estimatedRecipients =
    formData.targetAudience === 'all'
      ? 280
      : formData.targetAudience === 'floor'
      ? 8
      : 0;

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">お知らせ配信</h1>
        <p className="text-gray-600 mt-2">住民にお知らせを配信できます</p>
      </div>

      {/* Status Messages */}
      {submitStatus === 'success' && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            お知らせを配信しました。住民のブラウザに通知が表示されます。
          </AlertDescription>
        </Alert>
      )}

      {submitStatus === 'error' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>お知らせの配信に失敗しました。もう一度お試しください。</AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>新しいお知らせ</CardTitle>
          <CardDescription>住民に配信するお知らせを作成してください</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                タイトル <span className="text-red-600">*</span>
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="例：駐車場工事が完了しました"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                メッセージ <span className="text-red-600">*</span>
              </label>
              <Textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="住民に伝える内容を入力してください..."
                rows={6}
                required
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500">
                {formData.message.length} / 500文字
              </p>
            </div>

            {/* Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                通知タイプ
              </label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="event_update">工事情報更新</SelectItem>
                  <SelectItem value="new_event">新しい工事</SelectItem>
                  <SelectItem value="event_cancelled">工事中止</SelectItem>
                  <SelectItem value="schedule_change">スケジュール変更</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Target Audience */}
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                配信対象
              </h3>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  配信先 <span className="text-red-600">*</span>
                </label>
                <Select
                  value={formData.targetAudience}
                  onValueChange={(value) =>
                    setFormData({ ...formData, targetAudience: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全住民</SelectItem>
                    <SelectItem value="floor">特定の階</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.targetAudience === 'floor' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    階数
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="35"
                    value={formData.targetFloor}
                    onChange={(e) =>
                      setFormData({ ...formData, targetFloor: e.target.value })
                    }
                    placeholder="例：15"
                  />
                </div>
              )}

              <div className="bg-white p-3 rounded border border-gray-300">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-900">
                    推定配信先：<strong>{estimatedRecipients}名</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">プレビュー</label>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2">
                <p className="text-sm font-semibold text-gray-900">
                  {formData.title || 'タイトルが入力されていません'}
                </p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {formData.message || 'メッセージが入力されていません'}
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button variant="outline" disabled={isSubmitting}>
                下書き保存
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={
                  isSubmitting ||
                  !formData.title.trim() ||
                  !formData.message.trim()
                }
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? '配信中...' : 'お知らせを配信'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Recent Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>配信済みお知らせ</CardTitle>
          <CardDescription>最近配信したお知らせ</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                id: 1,
                title: 'ジムメンテナンスのお知らせ',
                date: '2025-02-15',
                recipients: 280,
              },
              {
                id: 2,
                title: '外壁調査が開始します',
                date: '2025-02-10',
                recipients: 140,
              },
              {
                id: 3,
                title: '駐車場工事進捗報告',
                date: '2025-02-08',
                recipients: 280,
              },
            ].map(notification => (
              <div
                key={notification.id}
                className="flex justify-between items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <div>
                  <p className="font-medium text-gray-900">{notification.title}</p>
                  <p className="text-xs text-gray-600">{notification.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-600 font-medium">
                    {notification.recipients}名
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
