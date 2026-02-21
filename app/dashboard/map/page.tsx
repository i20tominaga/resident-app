'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockConstructionEvents } from '@/lib/mock-data';
import { MapPin, AlertTriangle, Eye, EyeOff } from 'lucide-react';

const getTypeColor = (type: string) => {
  switch (type) {
    case 'construction':
      return 'bg-red-100 border-red-300 text-red-800';
    case 'inspection':
      return 'bg-blue-100 border-blue-300 text-blue-800';
    case 'maintenance':
      return 'bg-yellow-100 border-yellow-300 text-yellow-800';
    case 'repair':
      return 'bg-purple-100 border-purple-300 text-purple-800';
    default:
      return 'bg-gray-100 border-gray-300 text-gray-800';
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
      return 'border-red-500 bg-red-50';
    case 'scheduled':
      return 'border-blue-500 bg-blue-50';
    case 'completed':
      return 'border-green-500 bg-green-50';
    default:
      return 'border-gray-300 bg-gray-50';
  }
};

export default function MapPage() {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showOngoing, setShowOngoing] = useState(true);
  const [showScheduled, setShowScheduled] = useState(true);

  const filteredEvents = useMemo(() => {
    return mockConstructionEvents.filter(event => {
      if (event.status === 'in_progress' && !showOngoing) return false;
      if (event.status === 'scheduled' && !showScheduled) return false;
      return true;
    });
  }, [showOngoing, showScheduled]);

  const selectedEvent = selectedEventId
    ? mockConstructionEvents.find(e => e.id === selectedEventId)
    : null;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">工事マップ</h1>
        <p className="text-gray-600 mt-2">建物内の工事・点検エリアを確認できます</p>
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
                <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 min-h-96">
                  <h3 className="font-semibold text-gray-900 mb-4">35階建てビル</h3>

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

                      return (
                        <div
                          key={floor}
                          className={`p-3 rounded-lg border-2 transition cursor-pointer ${
                            affectedEvents.length > 0
                              ? 'bg-yellow-50 border-yellow-300 hover:bg-yellow-100'
                              : 'bg-green-50 border-green-200 hover:bg-green-100'
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
                            <span className="font-medium text-gray-900">{floorLabel}</span>
                            {affectedEvents.length > 0 && (
                              <div className="flex gap-1">
                                {affectedEvents.slice(0, 3).map(event => (
                                  <div
                                    key={event.id}
                                    className={`w-4 h-4 rounded-full ${getTypeColor(
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

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">凡例</h4>
                    <div className="space-y-1 text-xs">
                      {[
                        { type: 'construction', label: '工事' },
                        { type: 'inspection', label: '点検' },
                        { type: 'maintenance', label: 'メンテナンス' },
                      ].map(item => (
                        <div key={item.type} className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getTypeColor(item.type)}`} />
                          <span className="text-gray-600">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Filters */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <p className="font-semibold text-gray-900 text-sm">フィルター</p>
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
                      <h3 className="font-semibold text-lg text-gray-900">
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

                  <p className="text-gray-700">{selectedEvent.description}</p>

                  <div className="bg-gray-50 p-3 rounded space-y-2 text-sm">
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
                    <div className="bg-blue-50 p-3 rounded border border-blue-200 space-y-1 text-sm">
                      <p className="font-semibold text-blue-900">お問い合わせ先</p>
                      <p className="text-blue-800">
                        <strong>{selectedEvent.contactPerson}</strong>
                      </p>
                      <p className="text-blue-800">{selectedEvent.contactPhone}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">フロアをクリックして詳細を確認</p>
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
                          ' ring-2 ring-blue-500'
                        : getStatusColor(event.status)
                    }`}
                  >
                    <p className="font-medium text-sm text-gray-900">
                      {event.title}
                    </p>
                    <p className="text-xs text-gray-600">
                      {event.startDate.toLocaleDateString('ja-JP')}
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
