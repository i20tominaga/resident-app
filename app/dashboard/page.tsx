'use client';

import { useAuth } from '@/app/auth-context';
import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockConstructionEvents, mockNotifications } from '@/lib/mock-data';
import { getOngoingEvents, getEventsInNextDays, calculateRelevanceScores } from '@/lib/personalization';
import { AlertTriangle, Calendar, Bell, MapPin, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'in_progress':
      return <Badge variant="destructive">進行中</Badge>;
    case 'scheduled':
      return <Badge variant="outline">予定中</Badge>;
    case 'completed':
      return <Badge variant="secondary">完了</Badge>;
    case 'cancelled':
      return <Badge variant="secondary">中止</Badge>;
    default:
      return null;
  }
};

const getTypeLabel = (type: string) => {
  const typeMap: Record<string, string> = {
    construction: '工事',
    inspection: '点検',
    maintenance: 'メンテナンス',
    repair: '修理',
  };
  return typeMap[type] || type;
};

const getNoiseLevelColor = (level?: string) => {
  switch (level) {
    case 'high':
      return 'text-red-600 bg-red-50';
    case 'medium':
      return 'text-yellow-600 bg-yellow-50';
    case 'low':
      return 'text-green-600 bg-green-50';
    default:
      return '';
  }
};

const getNoiseLevelLabel = (level?: string) => {
  const levelMap: Record<string, string> = {
    high: '高い騒音',
    medium: '中程度の騒音',
    low: '低い騒音',
  };
  return levelMap[level || ''] || '情報なし';
};

export default function DashboardPage() {
  const { user } = useAuth();

  const ongoingEvents = useMemo(() => {
    return getOngoingEvents(mockConstructionEvents);
  }, []);

  const upcomingEvents = useMemo(() => {
    return getEventsInNextDays(mockConstructionEvents, 14);
  }, []);

  const relevanceScores = useMemo(() => {
    if (!user) return [];
    return calculateRelevanceScores(user, mockConstructionEvents);
  }, [user]);

  const unreadNotifications = useMemo(() => {
    return mockNotifications.filter(n => !n.isRead);
  }, []);

  const getRelevanceInfo = (eventId: string) => {
    return relevanceScores.find(rs => rs.eventId === eventId);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="text-gray-600 mt-2">
          {user?.displayName}さん、こんにちは。あなたに関連する工事・点検情報です。
        </p>
      </div>

      {/* Ongoing Events Alert */}
      {ongoingEvents.length > 0 && (
        <Alert className="bg-red-50 border-red-200">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>進行中の工事：</strong> {ongoingEvents.length}件の工事が進行中です。詳細は下記をご確認ください。
          </AlertDescription>
        </Alert>
      )}

      {/* Unread Notifications */}
      {unreadNotifications.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-blue-900">新しいお知らせ</CardTitle>
              <Badge variant="default" className="ml-auto">{unreadNotifications.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {unreadNotifications.map(notif => (
              <div key={notif.id} className="text-sm text-blue-800">
                <p className="font-medium">{notif.title}</p>
                <p className="text-blue-700">{notif.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ongoing Events */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                進行中の工事
              </CardTitle>
              <CardDescription>
                現在、以下の工事が進行中です
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {ongoingEvents.length === 0 ? (
                <p className="text-gray-500 text-sm">進行中の工事はありません</p>
              ) : (
                ongoingEvents.map(event => {
                  const relevance = getRelevanceInfo(event.id);
                  return (
                    <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{event.title}</h3>
                            {getStatusBadge(event.status)}
                          </div>
                          <p className="text-sm text-gray-600">{getTypeLabel(event.type)}</p>
                        </div>
                        {relevance && relevance.score >= 50 && (
                          <Badge className="bg-orange-100 text-orange-800">関連度高</Badge>
                        )}
                      </div>

                      <p className="text-sm text-gray-700 mb-3">{event.description}</p>

                      <div className="space-y-2 mb-3">
                        <div className="text-xs text-gray-600 space-y-1">
                          <p>
                            <strong>期間：</strong> {event.startDate.toLocaleDateString('ja-JP')} ～ {event.endDate.toLocaleDateString('ja-JP')}
                          </p>
                          {event.startTime && event.endTime && (
                            <p>
                              <strong>時間：</strong> {event.startTime} ～ {event.endTime}
                            </p>
                          )}
                          {event.noiseLevel && (
                            <p className={`inline-block px-2 py-1 rounded ${getNoiseLevelColor(event.noiseLevel)}`}>
                              <strong>騒音：</strong> {getNoiseLevelLabel(event.noiseLevel)}
                            </p>
                          )}
                          {event.affectedAreas.length > 0 && (
                            <p>
                              <strong>対象エリア：</strong> {event.affectedAreas.join(', ')}
                            </p>
                          )}
                        </div>
                      </div>

                      {relevance && relevance.reasons.length > 0 && (
                        <div className="bg-blue-50 p-2 rounded text-xs text-blue-800 space-y-1">
                          <p className="font-medium">あなたに関連している理由：</p>
                          {relevance.reasons.map((reason, idx) => (
                            <p key={idx}>• {reason}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">クイックアクセス</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/dashboard/calendar">
                <Button variant="outline" className="w-full justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    カレンダー
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/dashboard/map">
                <Button variant="outline" className="w-full justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    工事マップ
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/dashboard/faq">
                <Button variant="outline" className="w-full justify-between">
                  <span>よくある質問</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/dashboard/inquiry">
                <Button variant="outline" className="w-full justify-between">
                  <span>質問フォーム</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Upcoming Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">今後の予定</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600 mb-2">{upcomingEvents.length}</p>
              <p className="text-sm text-gray-600">
                今後14日間の工事・点検予定
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              今後の予定
            </CardTitle>
            <CardDescription>
              次の14日間の予定されている工事・点検
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingEvents.slice(0, 5).map(event => {
                const relevance = getRelevanceInfo(event.id);
                return (
                  <div key={event.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{event.title}</h4>
                        <p className="text-xs text-gray-600">
                          {event.startDate.toLocaleDateString('ja-JP')}
                          {event.startTime && ` ${event.startTime}`}
                        </p>
                      </div>
                      <Badge variant="outline">{getTypeLabel(event.type)}</Badge>
                    </div>
                    {relevance && relevance.score >= 50 && (
                      <p className="text-xs text-orange-600 font-medium">あなたに関連する予定です</p>
                    )}
                  </div>
                );
              })}
              {upcomingEvents.length > 5 && (
                <Link href="/dashboard/calendar">
                  <Button variant="ghost" className="w-full text-blue-600">
                    すべての予定を見る →
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
