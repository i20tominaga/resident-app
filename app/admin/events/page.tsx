'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loadEvents } from '@/lib/data-loader';
import { Search, Plus, Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { ConstructionEvent } from '@/lib/types';

const getTypeColor = (type: string) => {
  switch (type) {
    case 'construction':
      return 'bg-red-100 text-red-800';
    case 'inspection':
      return 'bg-blue-100 text-blue-800';
    case 'maintenance':
      return 'bg-yellow-100 text-yellow-800';
    case 'repair':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
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

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [allEvents, setAllEvents] = useState<ConstructionEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const events = await loadEvents();
        setAllEvents(events);
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredEvents = useMemo(() => {
    return allEvents.filter(event => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !filterStatus || event.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, filterStatus, allEvents]);

  const stats = useMemo(() => {
    return {
      total: mockConstructionEvents.length,
      ongoing: mockConstructionEvents.filter(e => e.status === 'in_progress').length,
      scheduled: mockConstructionEvents.filter(e => e.status === 'scheduled').length,
      completed: mockConstructionEvents.filter(e => e.status === 'completed').length,
    };
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">工事・点検管理</h1>
          <p className="text-gray-600 mt-2">全ての工事・点検情報を管理</p>
        </div>
        <Link href="/admin/events/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            新しい工事を登録
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">合計</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">進行中</p>
            <p className="text-2xl font-bold text-red-600">{stats.ongoing}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">予定中</p>
            <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">完了</p>
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Input
              placeholder="工事名や説明で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filterStatus === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus(null)}
            >
              すべて
            </Button>
            <Button
              variant={filterStatus === 'in_progress' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('in_progress')}
              className={filterStatus === 'in_progress' ? 'bg-red-600' : ''}
            >
              進行中
            </Button>
            <Button
              variant={filterStatus === 'scheduled' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('scheduled')}
              className={filterStatus === 'scheduled' ? 'bg-blue-600' : ''}
            >
              予定中
            </Button>
            <Button
              variant={filterStatus === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('completed')}
              className={filterStatus === 'completed' ? 'bg-green-600' : ''}
            >
              完了
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Event List */}
      <Card>
        <CardHeader>
          <CardTitle>工事・点検一覧</CardTitle>
          <CardDescription>{filteredEvents.length}件の工事・点検</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredEvents.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                条件に合致する工事・点検がありません
              </p>
            ) : (
              filteredEvents.map(event => (
                <div
                  key={event.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{event.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getTypeColor(event.type)}>
                          {getTypeLabel(event.type)}
                        </Badge>
                        <Badge
                          variant={
                            event.status === 'in_progress' ? 'destructive' : 'outline'
                          }
                        >
                          {event.status === 'in_progress' ? '進行中' : event.status === 'scheduled' ? '予定中' : '完了'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/admin/events/${event.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">{event.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div>
                      <p className="text-gray-600">
                        <strong>期間</strong>
                      </p>
                      <p className="text-gray-900">
                        {event.startDate.toLocaleDateString('ja-JP')} ～{' '}
                        {event.endDate.toLocaleDateString('ja-JP')}
                      </p>
                    </div>
                    {event.contractor && (
                      <div>
                        <p className="text-gray-600">
                          <strong>施工者</strong>
                        </p>
                        <p className="text-gray-900">{event.contractor}</p>
                      </div>
                    )}
                    {event.affectedAreas.length > 0 && (
                      <div>
                        <p className="text-gray-600">
                          <strong>対象エリア</strong>
                        </p>
                        <p className="text-gray-900">{event.affectedAreas[0]}</p>
                      </div>
                    )}
                    {event.noiseLevel && (
                      <div>
                        <p className="text-gray-600">
                          <strong>騒音</strong>
                        </p>
                        <p className="text-gray-900">
                          {event.noiseLevel === 'high'
                            ? '高い'
                            : event.noiseLevel === 'medium'
                            ? '中程度'
                            : '低い'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
