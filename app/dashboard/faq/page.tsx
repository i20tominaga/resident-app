'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { mockFAQs } from '@/lib/mock-data';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQId, setExpandedFAQId] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(mockFAQs.map(faq => faq.category));
    return Array.from(cats);
  }, []);

  const filteredFAQs = useMemo(() => {
    return mockFAQs.filter(faq => {
      const query = searchQuery.toLowerCase();
      return (
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.category.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

  const faqsByCategory = useMemo(() => {
    const grouped: Record<string, typeof mockFAQs> = {};
    filteredFAQs.forEach(faq => {
      if (!grouped[faq.category]) {
        grouped[faq.category] = [];
      }
      grouped[faq.category].push(faq);
    });
    return grouped;
  }, [filteredFAQs]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">よくある質問</h1>
        <p className="text-gray-600 mt-2">工事・点検に関するご質問にお答えします</p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Input
              placeholder="質問や関連キーワードで検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* FAQs by Category */}
      <div className="space-y-6">
        {Object.entries(faqsByCategory).map(([category, faqs]) => (
          <div key={category}>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Badge variant="outline">{category}</Badge>
              <span className="text-gray-600 text-lg">({faqs.length})</span>
            </h2>

            <div className="space-y-2">
              {faqs.map(faq => (
                <Card
                  key={faq.id}
                  className="cursor-pointer hover:bg-gray-50 transition"
                  onClick={() =>
                    setExpandedFAQId(expandedFAQId === faq.id ? null : faq.id)
                  }
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {faq.question}
                        </h3>
                      </div>
                      <div className="flex-shrink-0">
                        {expandedFAQId === faq.id ? (
                          <ChevronUp className="w-5 h-5 text-gray-600" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                    </div>

                    {expandedFAQId === faq.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-gray-700 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {filteredFAQs.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-600 mb-2">検索条件に該当するFAQが見つかりません</p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                検索をリセット
              </button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Contact Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">見つからないことはありますか？</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800">
          <p className="mb-4">
            ご不明な点やご質問がございましたら、お気軽にお問い合わせフォームからご連絡ください。
          </p>
          <a
            href="/dashboard/inquiry"
            className="text-blue-600 hover:text-blue-700 font-semibold underline"
          >
            質問フォームへ →
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
