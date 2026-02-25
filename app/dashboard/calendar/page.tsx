'use client';

import { useAuth } from '@/app/auth-context';
import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { loadEvents } from '@/lib/data-loader';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConstructionEvent } from '@/lib/types';

const getTypeColor = (type: string) => {
  switch (type) {
    case 'construction':
      return 'bg-destructive/10 text-destructive border-destructive/20';
    case 'inspection':
      return 'bg-primary/10 text-primary border-primary/20';
    case 'maintenance':
      return 'bg-accent/10 text-accent border-accent/20';
    case 'repair':
      return 'bg-accent/10 text-accent border-accent/20';
    default:
      return 'bg-muted text-muted-foreground border-border';
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

export default function CalendarPage() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date(2025, 1, 1));
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

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const eventsForMonth = useMemo(() => {
    const events: Record<number, ConstructionEvent[]> = {};

    allEvents.forEach(event => {
      const eventStart = new Date(event.startDate);
      if (
        eventStart.getFullYear() === currentDate.getFullYear() &&
        eventStart.getMonth() === currentDate.getMonth()
      ) {
        const day = eventStart.getDate();
        if (!events[day]) events[day] = [];
        events[day].push(event);
      }
    });

    return events;
  }, [currentDate, allEvents]);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const monthName = currentDate.toLocaleDateString('ja-JP', { month: 'long', year: 'numeric' });
  const days = [];
  const totalDays = daysInMonth(currentDate);
  const startingDayOfWeek = firstDayOfMonth(currentDate);

  // Empty cells for days before the 1st
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }

  // Days of the month
  for (let day = 1; day <= totalDays; day++) {
    days.push(day);
  }

  const dayLabels = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">カレンダー</h1>
        <p className="text-gray-600 mt-2">工事・点検予定を確認できます</p>
      </div>

      {/* Calendar Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{monthName}</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={previousMonth}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextMonth}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Day labels */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayLabels.map(day => (
              <div key={day} className="text-center font-semibold text-gray-600 text-sm py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => (
              <div
                key={index}
                className={`min-h-24 border rounded-lg p-2 ${
                  day === null
                    ? 'bg-gray-50'
                    : 'bg-white border-gray-200 hover:border-blue-300 transition'
                }`}
              >
                {day && (
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-gray-900">{day}</p>
                    <div className="space-y-1">
                      {eventsForMonth[day] && eventsForMonth[day].map(event => (
                        <div
                          key={event.id}
                          className={`text-xs px-2 py-1 rounded truncate border ${getTypeColor(event.type)} cursor-pointer hover:opacity-80 transition`}
                          title={event.title}
                        >
                          {getTypeLabel(event.type)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Event Details */}
      <Card>
        <CardHeader>
          <CardTitle>工事・点検詳細</CardTitle>
          <CardDescription>選択した期間の工事情報</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allEvents
              .filter(event => {
                const eventStart = new Date(event.startDate);
                const eventMonth = eventStart.getMonth();
                const eventYear = eventStart.getFullYear();
                const currentMonth = currentDate.getMonth();
                const currentYear = currentDate.getFullYear();
                return eventMonth === currentMonth && eventYear === currentYear;
              })
              .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
              .map(event => (
                <div key={event.id} className="border border-border rounded-lg p-4 hover:bg-secondary transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{event.title}</h3>
                      <Badge className={getTypeColor(event.type)}>
                        {getTypeLabel(event.type)}
                      </Badge>
                    </div>
                    <Badge
                      variant={event.status === 'in_progress' ? 'destructive' : 'outline'}
                    >
                      {event.status === 'in_progress' ? '進行中' : '予定中'}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">{event.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">
                        <strong>期間：</strong>
                      </p>
                      <p className="text-gray-900">
                        {event.startDate.toLocaleDateString('ja-JP')} ～{' '}
                        {event.endDate.toLocaleDateString('ja-JP')}
                      </p>
                    </div>
                    {event.startTime && event.endTime && (
                      <div>
                        <p className="text-gray-600">
                          <strong>時間：</strong>
                        </p>
                        <p className="text-gray-900">
                          {event.startTime} ～ {event.endTime}
                        </p>
                      </div>
                    )}
                    {event.affectedAreas.length > 0 && (
                      <div>
                        <p className="text-gray-600">
                          <strong>対象エリア：</strong>
                        </p>
                        <p className="text-gray-900">{event.affectedAreas.join(', ')}</p>
                      </div>
                    )}
                    {event.contractor && (
                      <div>
                        <p className="text-gray-600">
                          <strong>施工者：</strong>
                        </p>
                        <p className="text-gray-900">{event.contractor}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
