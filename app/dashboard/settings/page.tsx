'use client';

import { useAuth } from '@/app/auth-context';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockBuildings } from '@/lib/mock-data';
import { CheckCircle2, Settings, Bell, MapPin, User, Trash2, Plus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getUserPreferences, updateNotificationSettings, addTimePreference, removeTimePreference } from '@/lib/user-preferences';

export default function SettingsPage() {
  const { user } = useAuth();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    floorNumber: user?.floorNumber?.toString() || '',
    unitNumber: user?.unitNumber || '',
  });
  const [preferences, setPreferences] = useState(user ? getUserPreferences(user.id) : null);
  const [newTimeStart, setNewTimeStart] = useState('');
  const [newTimeEnd, setNewTimeEnd] = useState('');
  const [newTimeLabel, setNewTimeLabel] = useState('');

  useEffect(() => {
    if (user) {
      setPreferences(getUserPreferences(user.id));
    }
  }, [user]);

  const building = mockBuildings.find(b => b.id === user?.buildingId);
  const selectedFacilities = building?.features.filter(f =>
    user?.facilitiesOfInterest.includes(f.id)
  ) || [];

  const handleSave = async () => {
    setSaveStatus('saving');
    await new Promise(resolve => setTimeout(resolve, 500));
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">設定</h1>
        <p className="text-gray-600 mt-2">アカウントと通知の設定を管理します</p>
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
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Profile */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <CardTitle>プロフィール</CardTitle>
              </div>
              <CardDescription>
                基本情報の確認・変更ができます
              </CardDescription>
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
                <p className="text-xs text-gray-500">変更はサポートにお問い合わせください</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  お名前
                </label>
                <Input
                  value={formData.displayName}
                  onChange={(e) =>
                    setFormData({ ...formData, displayName: e.target.value })
                  }
                  placeholder="田中太郎"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    階数
                  </label>
                  <Input
                    type="number"
                    value={formData.floorNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, floorNumber: e.target.value })
                    }
                    placeholder="15"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    部屋番号
                  </label>
                  <Input
                    value={formData.unitNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, unitNumber: e.target.value })
                    }
                    placeholder="1501"
                  />
                </div>
              </div>

              <Button
                onClick={handleSave}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={saveStatus === 'saving'}
              >
                {saveStatus === 'saving' ? '保存中...' : '保存する'}
              </Button>
            </CardContent>
          </Card>

          {/* Building Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <CardTitle>建物情報</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>建物名</strong>
                </p>
                <p className="text-gray-900">{building?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>住所</strong>
                </p>
                <p className="text-gray-900">{building?.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>管理会社</strong>
                </p>
                <p className="text-gray-900">{building?.managementCompany}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>建物規模</strong>
                </p>
                <p className="text-gray-900">
                  {building?.totalFloors}階建て、{building?.totalUnits}戸
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                <CardTitle>通知設定</CardTitle>
              </div>
              <CardDescription>
                どの情報を優先的に受け取るかを設定できます
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {preferences && (
                <>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          関連工事の通知
                        </p>
                        <p className="text-sm text-gray-600">
                          あなたのフロアや利用施設の工事情報
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.notificationSettings.eventUpdates}
                        onChange={(e) => {
                          const updated = updateNotificationSettings(user!.id, {
                            eventUpdates: e.target.checked,
                          });
                          setPreferences(updated);
                        }}
                        className="w-5 h-5"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          新しい工事の通知
                        </p>
                        <p className="text-sm text-gray-600">
                          新しい工事が追加された場合
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.notificationSettings.newEvents}
                        onChange={(e) => {
                          const updated = updateNotificationSettings(user!.id, {
                            newEvents: e.target.checked,
                          });
                          setPreferences(updated);
                        }}
                        className="w-5 h-5"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          スケジュール変更通知
                        </p>
                        <p className="text-sm text-gray-600">
                          工事予定の変更があった場合
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.notificationSettings.scheduleChanges}
                        onChange={(e) => {
                          const updated = updateNotificationSettings(user!.id, {
                            scheduleChanges: e.target.checked,
                          });
                          setPreferences(updated);
                        }}
                        className="w-5 h-5"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          高騒音工事の通知
                        </p>
                        <p className="text-sm text-gray-600">
                          高い騒音が予想される工事
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.notificationSettings.highNoiseEvents}
                        onChange={(e) => {
                          const updated = updateNotificationSettings(user!.id, {
                            highNoiseEvents: e.target.checked,
                          });
                          setPreferences(updated);
                        }}
                        className="w-5 h-5"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          新着FAQの通知
                        </p>
                        <p className="text-sm text-gray-600">
                          新しいFAQが追加された場合
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.notificationSettings.newFAQ}
                        onChange={(e) => {
                          const updated = updateNotificationSettings(user!.id, {
                            newFAQ: e.target.checked,
                          });
                          setPreferences(updated);
                        }}
                        className="w-5 h-5"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleSave}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={saveStatus === 'saving'}
                  >
                    {saveStatus === 'saving' ? '保存中...' : '保存する'}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Time Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>時間帯設定</CardTitle>
              <CardDescription>
                特に関心がある工事の時間帯を設定してください
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {preferences && (
                <>
                  {preferences.timePreferences.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {preferences.timePreferences.map((pref, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
                          <div>
                            <p className="font-medium text-gray-900">{pref.label}</p>
                            <p className="text-xs text-gray-600">
                              {pref.startHour}:00 ～ {pref.endHour}:00
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              const updated = removeTimePreference(user!.id, idx);
                              setPreferences(updated);
                            }}
                            className="p-2 hover:bg-red-100 rounded-lg text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-gray-900">新しい時間帯を追加</h4>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        時間帯の名前
                      </label>
                      <Input
                        placeholder="例：朝間工事"
                        value={newTimeLabel}
                        onChange={(e) => setNewTimeLabel(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          開始時間
                        </label>
                        <Input
                          type="number"
                          min="0"
                          max="23"
                          placeholder="7"
                          value={newTimeStart}
                          onChange={(e) => setNewTimeStart(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          終了時間
                        </label>
                        <Input
                          type="number"
                          min="0"
                          max="23"
                          placeholder="9"
                          value={newTimeEnd}
                          onChange={(e) => setNewTimeEnd(e.target.value)}
                        />
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        if (newTimeStart && newTimeEnd && newTimeLabel) {
                          const updated = addTimePreference(user!.id, {
                            startHour: parseInt(newTimeStart),
                            endHour: parseInt(newTimeEnd),
                            label: newTimeLabel,
                          });
                          setPreferences(updated);
                          setNewTimeStart('');
                          setNewTimeEnd('');
                          setNewTimeLabel('');
                        }
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={!newTimeStart || !newTimeEnd || !newTimeLabel}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      追加
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          {/* Interested Facilities */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">関心がある施設</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {selectedFacilities.length > 0 ? (
                  selectedFacilities.map(facility => (
                    <div key={facility.id} className="text-sm">
                      <p className="font-medium text-gray-900">{facility.name}</p>
                      <p className="text-gray-600 text-xs">
                        {facility.floor
                          ? `${facility.floor}F`
                          : 'B1F'}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">施設が登録されていません</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Time Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">時間帯設定</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {user?.timePreferences && user.timePreferences.length > 0 ? (
                  user.timePreferences.map((pref, idx) => (
                    <div key={idx} className="text-sm">
                      <p className="font-medium text-gray-900">{pref.label}</p>
                      <p className="text-gray-600 text-xs">
                        {pref.startHour}:00 ～ {pref.endHour}:00
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">時間帯設定がされていません</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Help */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900 text-lg">ヘルプ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <a
                href="/dashboard/faq"
                className="block text-sm text-blue-600 hover:text-blue-700 font-medium underline"
              >
                よくある質問
              </a>
              <a
                href="/dashboard/inquiry"
                className="block text-sm text-blue-600 hover:text-blue-700 font-medium underline"
              >
                お問い合わせ
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
