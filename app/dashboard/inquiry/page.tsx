'use client';

import { useState } from 'react';
import { useAuth } from '@/app/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, AlertCircle, Send } from 'lucide-react';

const categories = [
  { value: 'construction', label: '工事について' },
  { value: 'noise', label: '騒音について' },
  { value: 'schedule', label: 'スケジュール変更' },
  { value: 'access', label: 'アクセスに関する問題' },
  { value: 'other', label: 'その他' },
];

export default function InquiryPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    category: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.message.trim() || !formData.category) {
      setErrorMessage('すべての項目を入力してください');
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Inquiry submitted:', {
        ...formData,
        userId: user?.id,
        email: user?.email,
      });

      setSubmitStatus('success');
      setFormData({ title: '', message: '', category: '' });

      // Reset success message after 3 seconds
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } catch (err) {
      setErrorMessage('送信に失敗しました。もう一度お試しください。');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">質問フォーム</h1>
        <p className="text-gray-600 mt-2">工事や施設についてのご質問・ご不明な点をお知らせください</p>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>お問い合わせ</CardTitle>
          <CardDescription>
            ご質問や不明な点がございましたら、以下のフォームからお知らせください。
            通常2営業日以内にご回答いたします。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Info (Read-only) */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p className="text-sm text-gray-600">
                <strong>お名前：</strong> {user?.displayName}
              </p>
              <p className="text-sm text-gray-600">
                <strong>メールアドレス：</strong> {user?.email}
              </p>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium text-gray-700">
                質問の種類 <span className="text-red-600">*</span>
              </label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium text-gray-700">
                件名 <span className="text-red-600">*</span>
              </label>
              <Input
                id="title"
                placeholder="例：駐車場の工事について"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                disabled={isSubmitting}
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-gray-700">
                メッセージ <span className="text-red-600">*</span>
              </label>
              <Textarea
                id="message"
                placeholder="お問い合わせの内容をご記入ください..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={6}
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500">
                {formData.message.length} / 2000文字
              </p>
            </div>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  お問い合わせありがとうございます。確認後、メールでご連絡いたします。
                </AlertDescription>
              </Alert>
            )}

            {submitStatus === 'error' && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isSubmitting || submitStatus === 'success'}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  送信中...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  送信する
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* FAQ Link */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900 text-lg">よくある質問もご確認ください</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800">
          <p className="mb-4">
            お答えできることがすでにFAQに記載されているかもしれません。
          </p>
          <a
            href="/dashboard/faq"
            className="text-blue-600 hover:text-blue-700 font-semibold underline"
          >
            よくある質問を見る →
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
