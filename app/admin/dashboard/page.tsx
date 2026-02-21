'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockConstructionEvents, mockNotifications } from '@/lib/mock-data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { AlertTriangle, CheckCircle2, Clock, FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminDashboardPage() {
  const stats = useMemo(() => {
    const ongoing = mockConstructionEvents.filter(e => e.status === 'in_progress').length;
    const scheduled = mockConstructionEvents.filter(e => e.status === 'scheduled').length;
    const total = mockConstructionEvents.length;

    return { ongoing, scheduled, total };
  }, []);

  const eventChartData = useMemo(() => {
    const months = ['1月', '2月', '3月', '4月', '5月', '6月'];
    return months.map((month, idx) => ({
      month,
      工事: Math.floor(Math.random() * 8) + 2,
      点検: Math.floor(Math.random() * 5) + 1,
    }));
  }, []);

  const recentEvents = useMemo(() => {
    return mockConstructionEvents.slice(0, 5).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }, []);

  const recentNotifications = mockNotifications.slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="text-gray-600 mt-2">工事・点検の管理状況を確認できます</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">合計工事数</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FileText className="w-10 h-10 text-blue-100" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">進行中</p>
                <p className="text-3xl font-bold text-red-600">{stats.ongoing}</p>
              </div>
              <AlertTriangle className="w-10 h-10 text-red-100" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">予定中</p>
                <p className="text-3xl font-bold text-blue-600">{stats.scheduled}</p>
              </div>
              <Clock className="w-10 h-10 text-blue-100" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">住民通知</p>
                <p className="text-3xl font-bold text-gray-900">{mockNotifications.length}</p>
              </div>
              <CheckCircle2 className="w-10 h-10 text-green-100" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Event Trend */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>工事・点検トレンド</CardTitle>
              <CardDescription>過去6ヶ月の工事・点検件数</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={eventChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="工事" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="点検" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">クイックアクション</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/admin/events/new">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  工事を登録
                </Button>
              </Link>
              <Link href="/admin/notifications">
                <Button variant="outline" className="w-full justify-start">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  お知らせ配信
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">最近の変更</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-gray-500 space-y-1">
                {recentEvents.map(event => (
                  <div key={event.id}>
                    <p className="font-medium text-gray-900 truncate">{event.title}</p>
                    <p>{event.updatedAt.toLocaleDateString('ja-JP')}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>最近の工事・点検</CardTitle>
              <CardDescription>最新の登録・更新内容</CardDescription>
            </div>
            <Link href="/admin/events">
              <Button variant="outline" size="sm">
                すべて見る →
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentEvents.map(event => (
              <div
                key={event.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-600">
                      {event.startDate.toLocaleDateString('ja-JP')} ～{' '}
                      {event.endDate.toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                  <Badge
                    variant={event.status === 'in_progress' ? 'destructive' : 'outline'}
                  >
                    {event.status === 'in_progress' ? '進行中' : '予定中'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{event.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
