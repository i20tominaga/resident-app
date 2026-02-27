'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, ArrowRight, Save, Building2, MapPin, Layers, CheckCircle2 } from 'lucide-react';
import { Building, Facility } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

const FACILITY_PRESETS: { id: string; name: string; type: Facility['type'] }[] = [
    { id: 'parking', name: '駐車場', type: 'parking' },
    { id: 'gym', name: 'フィットネスジム', type: 'gym' },
    { id: 'lobby', name: 'ロビー', type: 'lobby' },
    { id: 'lounge', name: 'ラウンジ', type: 'common' },
    { id: 'rooftop', name: '屋上庭園', type: 'rooftop' },
    { id: 'delivery', name: '宅配ボックス', type: 'other' },
];

export default function NewBuildingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        managementCompany: '',
        totalFloors: 10,
        basementFloors: 0,
        totalUnits: 50,
        selectedFacilities: [] as string[],
    });

    const handleNext = () => setStep(s => s + 1);
    const handlePrev = () => setStep(s => s - 1);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Create features from selected facilities
            const features: Facility[] = formData.selectedFacilities.map(presetId => {
                const preset = FACILITY_PRESETS.find(p => p.id === presetId)!;
                return {
                    id: `fac-${Date.now()}-${presetId}`,
                    name: preset.name,
                    buildingId: '', // To be filled by server
                    type: preset.type,
                    floor: presetId === 'parking' ? -1 : presetId === 'rooftop' ? formData.totalFloors : 1,
                };
            });

            const buildingData = {
                name: formData.name,
                address: formData.address,
                managementCompany: formData.managementCompany,
                totalFloors: formData.totalFloors,
                basementFloors: formData.basementFloors,
                totalUnits: formData.totalUnits,
                features,
            };

            const response = await fetch('/api/buildings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(buildingData),
            });

            if (!response.ok) throw new Error('Failed to register building');

            toast({
                title: '登録完了',
                description: `${formData.name}が正常に登録されました`,
            });
            router.push('/admin/buildings');
        } catch (error) {
            console.error('Registration failed:', error);
            toast({
                title: 'エラー',
                description: '建物の登録に失敗しました',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleFacility = (facilityId: string) => {
        setFormData(prev => ({
            ...prev,
            selectedFacilities: prev.selectedFacilities.includes(facilityId)
                ? prev.selectedFacilities.filter(id => id !== facilityId)
                : [...prev.selectedFacilities, facilityId],
        }));
    };

    return (
        <div className="p-6 max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-2">
                <Button variant="ghost" onClick={() => router.back()} size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    戻る
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">新規建物登録</h1>
            </div>

            {/* Progress */}
            <div className="flex justify-between px-4">
                {[1, 2, 3, 4].map(s => (
                    <div key={s} className="flex flex-col items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                            }`}>
                            {s}
                        </div>
                        <span className="text-xs text-gray-500">
                            {s === 1 ? '基本情報' : s === 2 ? '構造設定' : s === 3 ? '共用施設' : '確認'}
                        </span>
                    </div>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>
                        {step === 1 ? '建物の基本情報' : step === 2 ? '建物の構造' : step === 3 ? '共用施設の設定' : '入力内容の確認'}
                    </CardTitle>
                    <CardDescription>
                        {step === 1 ? '建物名と所在地、管理者を入力してください' :
                            step === 2 ? '階数や戸数などの構造情報を入力してください' :
                                step === 3 ? '建物に備わっている施設を選択してください' :
                                    '登録する内容に誤りがないか確認してください'}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {step === 1 && (
                        <div className="space-y-4 font-inter">
                            <div className="space-y-2">
                                <Label htmlFor="b-name">建物名</Label>
                                <Input
                                    id="b-name"
                                    placeholder="例：スカイテラス代々木"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="b-addr">住所</Label>
                                <Input
                                    id="b-addr"
                                    placeholder="東京都渋谷区..."
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="b-mgmt">管理会社名</Label>
                                <Input
                                    id="b-mgmt"
                                    placeholder="株式会社〇〇管理"
                                    value={formData.managementCompany}
                                    onChange={e => setFormData({ ...formData, managementCompany: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="b-floors">地上階数</Label>
                                    <Input
                                        id="b-floors"
                                        type="number"
                                        value={formData.totalFloors}
                                        onChange={e => setFormData({ ...formData, totalFloors: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="b-basement">地下階数</Label>
                                    <Input
                                        id="b-basement"
                                        type="number"
                                        value={formData.basementFloors}
                                        onChange={e => setFormData({ ...formData, basementFloors: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="b-units">総戸数</Label>
                                <Input
                                    id="b-units"
                                    type="number"
                                    value={formData.totalUnits}
                                    onChange={e => setFormData({ ...formData, totalUnits: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="grid grid-cols-2 gap-3">
                            {FACILITY_PRESETS.map(fac => (
                                <div
                                    key={fac.id}
                                    className={`flex items-center space-x-2 border rounded-lg p-3 cursor-pointer transition ${formData.selectedFacilities.includes(fac.id) ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                                        }`}
                                    onClick={() => toggleFacility(fac.id)}
                                >
                                    <Checkbox
                                        id={fac.id}
                                        checked={formData.selectedFacilities.includes(fac.id)}
                                        className="pointer-events-none"
                                    />
                                    <Label htmlFor={fac.id} className="cursor-pointer flex-1">{fac.name}</Label>
                                </div>
                            ))}
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-4 divide-y divide-gray-100">
                            <div className="pt-2">
                                <Label className="text-gray-500">建物名</Label>
                                <p className="font-semibold">{formData.name || '未入力'}</p>
                            </div>
                            <div className="pt-2">
                                <Label className="text-gray-500">住所</Label>
                                <p>{formData.address || '未入力'}</p>
                            </div>
                            <div className="pt-2">
                                <Label className="text-gray-500">規模</Label>
                                <p>
                                    地上{formData.totalFloors}階 / 地下{formData.basementFloors}階
                                    <span className="ml-2 text-gray-500">({formData.totalUnits}戸)</span>
                                </p>
                            </div>
                            <div className="pt-2">
                                <Label className="text-gray-500">共用施設</Label>
                                <p className="text-sm">
                                    {formData.selectedFacilities.length > 0
                                        ? formData.selectedFacilities.map(id => FACILITY_PRESETS.find(p => p.id === id)?.name).join('、')
                                        : 'なし'}
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex justify-between border-t border-gray-100 pt-6">
                    {step > 1 ? (
                        <Button variant="outline" onClick={handlePrev} disabled={isSubmitting}>
                            戻る
                        </Button>
                    ) : (
                        <div />
                    )}

                    {step < 4 ? (
                        <Button
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={handleNext}
                            disabled={step === 1 && !formData.name}
                        >
                            次へ
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button
                            className="bg-green-600 hover:bg-green-700"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? '登録中...' : '登録を完了する'}
                            <Save className="w-4 h-4 ml-2" />
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
