/**
 * UX Writing Strings
 * ユーザー中心のフレンドリーな文言を一元管理
 * 原則：
 * 1. ユーザーを主体者にする（「〜します」を使用）
 * 2. 話し言葉で親切に（漢字3割：ひらがな7割）
 * 3. ボタンラベルは動詞で明確に
 * 4. 説明文を追加して親切に
 */

export const uxStrings = {
  // ナビゲーション
  navigation: {
    dashboard: 'ダッシュボード',
    calendar: 'カレンダー',
    map: '工事マップ',
    faq: 'よくある質問',
    inquiry: 'お問い合わせ',
    settings: '設定',
    admin: '管理画面',
  },

  // ボタンアクション
  buttons: {
    login: 'ログインする',
    logout: 'ログアウトする',
    save: '保存する',
    delete: '削除する',
    create: '新規作成',
    edit: '編集する',
    submit: '送信する',
    cancel: 'キャンセル',
    back: '戻る',
    next: '次へ',
    confirm: '確認する',
    apply: '適用する',
    reset: 'リセット',
  },

  // ステータスメッセージ
  status: {
    loading: '読み込み中…',
    saving: '保存中…',
    deleting: '削除中…',
    submitted: '送信しました',
    saved: '保存しました',
    deleted: '削除しました',
    error: 'エラーが発生しました',
  },

  // ダッシュボード
  dashboard: {
    welcome: 'おはようございます',
    ongoingEvents: '進行中の工事',
    upcomingEvents: '今後の予定',
    unreadNotifications: '未読のお知らせ',
    relatedInfo: 'あなたに関連した情報',
    noOngoingEvents: '現在、進行中の工事はありません',
    noUpcomingEvents: 'これからの予定はありません',
  },

  // イベント情報
  events: {
    eventType: '工事の種類',
    startDate: '開始日',
    endDate: '終了日',
    affectedAreas: '対象エリア',
    noiseLevel: '予想される騒音',
    contractor: '施工会社',
    description: '詳細情報',
    schedule: 'スケジュール',
    moreInfo: 'さらに詳しく',
    relatedFacilities: '関連施設',
  },

  // ノイズレベル
  noise: {
    high: '高い騒音（80dB以上）',
    medium: '中程度の騒音（60-80dB）',
    low: '低い騒音（60dB未満）',
    description: {
      high: 'イヤホンをしても会話が聞こえにくいレベルです',
      medium: '会話をするときに少し声を大きくする必要があります',
      low: '通常の会話ができます',
    },
  },

  // FAQ
  faq: {
    title: 'よくある質問',
    searchPlaceholder: '質問を検索する…',
    allCategories: 'すべてのカテゴリ',
    noResults: 'お探しの質問が見つかりません',
    helpful: 'この回答は役に立ちましたか？',
    yes: 'はい',
    no: 'いいえ',
  },

  // お問い合わせ
  inquiry: {
    title: 'ご質問・ご不安をお聞かせください',
    subject: 'お問い合わせの内容',
    message: 'ご質問やご不安な点',
    submitted: 'ご質問をお送りしました。すぐにご確認いただきます',
    placeholder: '気になっていることを教えてください…',
  },

  // エラーメッセージ
  errors: {
    invalidCredentials: 'メールアドレスまたはパスワードが正しくありません',
    loginFailed: 'ログインできませんでした。もう一度試してください',
    loadingFailed: 'データを読み込めませんでした',
    saveFailed: '保存できませんでした',
    deleteFailed: '削除できませんでした',
    required: 'この項目は入力が必要です',
  },

  // 確認メッセージ
  confirmations: {
    delete: 'これを削除してもよろしいですか？',
    logout: 'ログアウトしてもよろしいですか？',
    unsavedChanges: '保存していない変更があります。本当に終了してもよろしいですか？',
  },

  // 説明文
  help: {
    floor: 'あなたが住んでいる階を設定することで、関連する工事情報が表示されます',
    facilities: 'よく使う施設を選択すると、その施設に関連した工事情報を優先的に表示します',
    notifications: 'どの情報を重視するか設定し、自分にとって重要なお知らせだけを受け取ります',
    timePreferences: '特に気になる工事の時間帯を設定すると、そのタイミングの工事情報を優先表示します',
  },
};

/**
 * 工事ステータスをユーザーフレンドリーな表現に変換
 */
export function getEventStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    in_progress: '工事中です',
    scheduled: '予定されています',
    completed: '完了しました',
    cancelled: '中止になりました',
  };
  return statusMap[status] || status;
}

/**
 * 工事タイプをユーザーフレンドリーな表現に変換
 */
export function getEventTypeLabel(type: string): string {
  const typeMap: Record<string, string> = {
    construction: '工事',
    inspection: '点検',
    maintenance: 'メンテナンス',
    repair: '修理',
  };
  return typeMap[type] || type;
}

/**
 * 時間帯をユーザーフレンドリーな表現に変換
 */
export function formatTimeRange(startTime: string, endTime: string): string {
  return `${startTime}～${endTime}`;
}

/**
 * 日付をユーザーフレンドリーな表現に変換
 */
export function formatDateRange(startDate: Date, endDate: Date): string {
  const isSameDay = startDate.toDateString() === endDate.toDateString();
  
  if (isSameDay) {
    return `${startDate.getMonth() + 1}月${startDate.getDate()}日`;
  }
  
  return `${startDate.getMonth() + 1}月${startDate.getDate()}日～${endDate.getMonth() + 1}月${endDate.getDate()}日`;
}
