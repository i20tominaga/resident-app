'use client';

import { useAuth } from '@/app/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Building2, LogOut, Menu, X } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const isActive = (href: string) => {
    if (href === '/dashboard' && pathname === '/dashboard') return true;
    if (href !== '/dashboard' && pathname.startsWith(href)) return true;
    return false;
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setSidebarOpen(window.innerWidth >= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Building2 className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">読み込み中…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="w-64 bg-card border-r border-border flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-2">
              <Building2 className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-base font-semibold text-foreground">Building Navigator</h1>
                <p className="text-xs text-muted-foreground">工事・点検情報</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="px-6 py-4 border-b border-border">
            <p className="text-sm font-medium text-foreground">{user?.displayName}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
            {user?.floorNumber && (
              <p className="text-xs text-muted-foreground mt-1">{user.floorNumber}階 {user?.unitNumber}</p>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            <a 
              href="/dashboard" 
              className={`block px-4 py-2 rounded-lg transition-colors ${
                isActive('/dashboard')
                  ? 'text-foreground font-medium rounded-lg bg-primary/10 border border-primary/20'
                  : 'text-foreground hover:bg-secondary'
              }`}
            >
              ダッシュボード
            </a>
            <a 
              href="/dashboard/calendar" 
              className={`block px-4 py-2 rounded-lg transition-colors ${
                isActive('/dashboard/calendar')
                  ? 'text-foreground font-medium bg-primary/10 border border-primary/20'
                  : 'text-foreground hover:bg-secondary'
              }`}
            >
              カレンダー
            </a>
            <a 
              href="/dashboard/map" 
              className={`block px-4 py-2 rounded-lg transition-colors ${
                isActive('/dashboard/map')
                  ? 'text-foreground font-medium bg-primary/10 border border-primary/20'
                  : 'text-foreground hover:bg-secondary'
              }`}
            >
              工事マップ
            </a>
            <a 
              href="/dashboard/faq" 
              className={`block px-4 py-2 rounded-lg transition-colors ${
                isActive('/dashboard/faq')
                  ? 'text-foreground font-medium bg-primary/10 border border-primary/20'
                  : 'text-foreground hover:bg-secondary'
              }`}
            >
              よくある質問
            </a>
            <a 
              href="/dashboard/inquiry" 
              className={`block px-4 py-2 rounded-lg transition-colors ${
                isActive('/dashboard/inquiry')
                  ? 'text-foreground font-medium bg-primary/10 border border-primary/20'
                  : 'text-foreground hover:bg-secondary'
              }`}
            >
              ご質問・ご不安
            </a>
            <a 
              href="/dashboard/settings" 
              className={`block px-4 py-2 rounded-lg transition-colors ${
                isActive('/dashboard/settings')
                  ? 'text-foreground font-medium bg-primary/10 border border-primary/20'
                  : 'text-foreground hover:bg-secondary'
              }`}
            >
              設定
            </a>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-border">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full justify-start"
            >
              <LogOut className="w-4 h-4 mr-2" />
              ログアウトする
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-gray-900">Building Navigator</span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <LogOut className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
