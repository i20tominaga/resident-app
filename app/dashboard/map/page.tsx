'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { loadEvents } from '@/lib/data-loader';
import { MapPin, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { ConstructionEvent } from '@/lib/types';

const getTypeColor = (type: string) => {
  switch (type) {
    case 'construction':
      return 'bg-destructive/10 border-destructive/20 text-destructive';
    case 'inspection':
      return 'bg-primary/10 border-primary/20 text-primary';
    case 'maintenance':
      return 'bg-accent/10 border-accent/20 text-accent';
    case 'repair':
      return 'bg-accent/10 border-accent/20 text-accent';
    default:
      return 'bg-muted border-border text-muted-foreground';
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

const getStatusColor = (status: string) => {
  switch (status) {
    case 'in_progress':
      return 'border-destructive bg-destructive/10';
    case 'scheduled':
      return 'border-accent bg-accent/10';
    case 'completed':
      return 'border-primary bg-primary/10';
    default:
      return 'border-border bg-muted';
  }
};

export default function MapPage() {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showOngoing, setShowOngoing] = useState(true);
  const [showScheduled, setShowScheduled] = useState(true);
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
      if (event.status === 'in_progress' && !showOngoing) return false;
      if (event.status === 'scheduled' && !showScheduled) return false;
      return true;
    });
  }, [showOngoing, showScheduled, allEvents]);

  const selectedEvent = selectedEventId
    ? allEvents.find(e => e.id === selectedEventId)
    : null;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">工事マップ</h1>
        <p className="text-muted-foreground mt-2">建物内の工事・点検エリアを確認できます</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Building Diagram */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                シティタワー東京
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Building Visual Representation */}
                <div className="bg-secondary p-6 rounded-lg border-2 border-border min-h-96">
                  <h3 className="font-semibold text-foreground mb-4">35階建てビル</h3>

                  {/* Floor Representation */}
                  <div className="space-y-2">
                    {/* Affected Areas Highlighted */}
                    {[30, 25, 20, 15, 10, 5, 1, -1].map(floor => {
                      const affectedEvents = filteredEvents.filter(event =>
                        event.affectedFloors.includes(floor) ||
                        (floor === -1 && event.affectedFacilities.some(fac => fac.includes('駐車場')))
                      );

                      const floorLabel =
                        floor === -1
                          ? 'B1F (駐車場)'
                          : floor === 1
                          ? '1F (ロビー)'
                          : floor === 2
                          ? '2F (ジム)'
                          : `${floor}F`;

                      const hasInProgress = affectedEvents.some(e => e.status === 'in_progress');
                      const hasScheduled = affectedEvents.some(e => e.status === 'scheduled');

                      return (
                        <div
                          key={floor}
                          className={`p-3 rounded-lg border-2 transition cursor-pointer ${
                            hasInProgress
                              ? getStatusColor('in_progress')
                              : hasScheduled
                              ? getStatusColor('scheduled')
                              : 'bg-muted border-border hover:bg-secondary'
                          }`}
                          onClick={() =>
                            setSelectedEventId(
                              affectedEvents.length > 0
                                ? affectedEvents[0].id
                                : null
                            )
                          }
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-foreground">{floorLabel}</span>
                            {affectedEvents.length > 0 && (
                              <div className="flex gap-1">
                                {affectedEvents.slice(0, 3).map(event => (
                                  <div
                                    key={event.id}
                                    className={`w-4 h-4 rounded-full border-2 ${getTypeColor(
                                      event.type
                                    )}`}
                                    title={event.title}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 pt-4 border-t border-border">
                    <h4 className="font-semibold text-foreground mb-2">凡例</h4>
                    <div className="space-y-1 text-xs">
                      {[
                        { type: 'construction', label: '工事' },
                        { type: 'inspection', label: '点検' },
                        { type: 'maintenance', label: 'メンテナンス' },
                      ].map(item => (
                        <div key={item.type} className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full border ${getTypeColor(item.type)}`} />
                          <span className="text-muted-foreground">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Filters */}
                <div className="space-y-3 pt-4 border-t border-border">
                  <p className="font-semibold text-foreground text-sm">フィルター</p>
                  <div className="space-y-2">
                    <Button
                      variant={showOngoing ? 'default' : 'outline'}
                      className="w-full justify-start text-sm"
                      onClick={() => setShowOngoing(!showOngoing)}
                    >
                      {showOngoing ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
                      進行中の工事
                    </Button>
                    <Button
                      variant={showScheduled ? 'default' : 'outline'}
                      className="w-full justify-start text-sm"
                      onClick={() => setShowScheduled(!showScheduled)}
                    >
                      {showScheduled ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
                      予定中の工事
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Event Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>工事詳細</CardTitle>
              <CardDescription>
                {selectedEvent ? 'クリックして詳細を確認' : 'フロアをクリックして詳細を表示'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedEvent ? (
                <div className="space-y-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">
                        {selectedEvent.title}
                      </h3>
                      <Badge className={getTypeColor(selectedEvent.type)}>
                        {getTypeLabel(selectedEvent.type)}
                      </Badge>
                    </div>
                    <Badge
                      variant={
                        selectedEvent.status === 'in_progress' ? 'destructive' : 'outline'
                      }
                    >
                      {selectedEvent.status === 'in_progress' ? '進行中' : '予定中'}
                    </Badge>
                  </div>

                  <p className="text-muted-foreground">{selectedEvent.description}</p>

                  <div className="bg-secondary p-3 rounded space-y-2 text-sm">
                    <p>
                      <strong>期間：</strong>{' '}
                      {selectedEvent.startDate.toLocaleDateString('ja-JP')} ～{' '}
                      {selectedEvent.endDate.toLocaleDateString('ja-JP')}
                    </p>
                    {selectedEvent.startTime && selectedEvent.endTime && (
                      <p>
                        <strong>時間：</strong> {selectedEvent.startTime} ～{' '}
                        {selectedEvent.endTime}
                      </p>
                    )}
                    {selectedEvent.affectedAreas.length > 0 && (
                      <p>
                        <strong>対象エリア：</strong> {selectedEvent.affectedAreas.join(', ')}
                      </p>
                    )}
                    {selectedEvent.noiseLevel && (
                      <p>
                        <strong>騒音：</strong>{' '}
                        {selectedEvent.noiseLevel === 'high'
                          ? '高い'
                          : selectedEvent.noiseLevel === 'medium'
                          ? '中程度'
                          : '低い'}
                      </p>
                    )}
                    {selectedEvent.contractor && (
                      <p>
                        <strong>施工者：</strong> {selectedEvent.contractor}
                      </p>
                    )}
                  </div>

                  {selectedEvent.contactPerson && selectedEvent.contactPhone && (
                    <div className="bg-primary/10 p-3 rounded border border-primary/20 space-y-1 text-sm">
                      <p className="font-semibold text-primary">お問い合わせ先</p>
                      <p className="text-foreground">
                        <strong>{selectedEvent.contactPerson}</strong>
                      </p>
                      <p className="text-foreground">{selectedEvent.contactPhone}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-muted mx-auto mb-3" />
                  <p className="text-muted-foreground">フロアをクリックして詳細を確認</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Event List */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">全ての工事・点検</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredEvents.map(event => (
                  <div
                    key={event.id}
                    onClick={() => setSelectedEventId(event.id)}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition ${
                      selectedEventId === event.id
                        ? getStatusColor(event.status) +
                          ' ring-2 ring-primary'
                        : getStatusColor(event.status)
                    }`}
                  >
                    <p className="font-medium text-sm text-foreground">
                      {event.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.startDate).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
