'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loadBuildings } from '@/lib/data-loader';
import { Search, Plus, Building2, MapPin, Layers, UserPlus, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import { Building } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';

export default function AdminBuildingsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [inviteLink, setInviteLink] = useState<string | null>(null);
    const [showInviteDialog, setShowInviteDialog] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await loadBuildings();
                setBuildings(data);
            } catch (error) {
                console.error('Error loading buildings:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    const handleGenerateInvite = async (buildingId: string) => {
        try {
            const response = await fetch('/api/invites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ buildingId }),
            });
            const data = await response.json();
            const link = `${window.location.origin}/signup?code=${data.code}`;
            setInviteLink(link);
            setShowInviteDialog(true);
        } catch (error) {
            toast({
                title: 'エラー',
                description: '招待コードの生成に失敗しました',
                variant: 'destructive',
            });
        }
    };

    const handleCopy = () => {
        if (inviteLink) {
            navigator.clipboard.writeText(inviteLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            toast({
                title: 'コピーしました',
                description: '招待リンクをクリップボードにコピーしました',
            });
        }
    };

    const filteredBuildings = useMemo(() => {
        return buildings.filter(b =>
            b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.managementCompany.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, buildings]);

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">建物管理</h1>
                    <p className="text-gray-600 mt-2">登録済みの建物を一覧で管理します</p>
                </div>
                <Link href="/admin/buildings/new">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        新規建物登録
                    </Button>
                </Link>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <Input
                            placeholder="建物名、住所、管理会社で検索..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Building List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <p className="col-span-full text-center text-gray-500 py-12">読み込み中...</p>
                ) : filteredBuildings.length === 0 ? (
                    <p className="col-span-full text-center text-gray-500 py-12">建物が見つかりません</p>
                ) : (
                    filteredBuildings.map(building => (
                        <Card key={building.id} className="overflow-hidden hover:shadow-md transition">
                            <CardHeader className="bg-gray-50 border-b border-gray-100">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <Building2 className="w-5 h-5 text-blue-600" />
                                        <CardTitle className="text-lg">{building.name}</CardTitle>
                                    </div>
                                    <Badge variant="outline">{building.totalUnits}戸</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-3">
                                <div className="flex items-start gap-2 text-sm text-gray-600">
                                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                                    <span>{building.address}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Layers className="w-4 h-4 shrink-0" />
                                    <span>
                                        地上{building.totalFloors}階
                                        {building.basementFloors ? ` / 地下${building.basementFloors}階` : ''}
                                    </span>
                                </div>
                                <div className="pt-2 border-t border-gray-100">
                                    <p className="text-xs text-gray-500 mb-1">管理会社</p>
                                    <p className="text-sm font-medium text-gray-900">{building.managementCompany}</p>
                                </div>
                                <div className="flex gap-2 mt-4 pt-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => handleGenerateInvite(building.id)}
                                    >
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        招待
                                    </Button>
                                    <Button variant="outline" size="sm" className="flex-1">
                                        詳細
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Invite Dialog */}
            <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>住民招待リンク</DialogTitle>
                        <DialogDescription>
                            このリンクを住民の方に共有してください。このリンクから登録すると、自動的にこの建物に紐付きます。
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center gap-2 pt-4">
                        <Input value={inviteLink || ''} readOnly className="font-mono text-xs" />
                        <Button size="icon" onClick={handleCopy} variant={copied ? "default" : "outline"}>
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                    </div>
                    <DialogFooter className="sm:justify-start pt-4">
                        <Button type="button" variant="secondary" onClick={() => setShowInviteDialog(false)}>
                            閉じる
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
