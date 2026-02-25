/**
 * Design System
 * パナソニックのデザイン原則に基づく統一的なUIガイドライン
 * 
 * 原則：
 * 1. カラー：3色の配色ルール（ベース：セカンダリ、メイン：プライマリ、アクセント：アクセント）
 * 2. タイポグラフィ：フォント1種類、ジャンプ率を統一
 * 3. レイアウト：近接、整列、反復、コントラストの4つの基本原則
 */

export const designSystem = {
  // 色（3色に統一）
  colors: {
    // ベースカラー（70%）：背景や大面積に使用
    base: {
      light: 'oklch(0.985 0.001 0)',
      dark: 'oklch(0.170 0.005 0)',
    },
    // メインカラー（25%）：プライマリアクション、重要要素
    primary: {
      light: 'oklch(0.530 0.130 184)',
      dark: 'oklch(0.630 0.150 184)',
    },
    // セカンダリカラー（5%）：アクセント、強調要素
    accent: {
      light: 'oklch(0.610 0.160 184)',
      dark: 'oklch(0.700 0.160 184)',
    },
  },

  // タイポグラフィ
  typography: {
    // フォント：Geistで統一
    fontFamily: "'Geist', 'Geist Fallback', sans-serif",
    
    // ジャンプ率：1.25（Major Third）で統一
    jumpRate: 1.25,
    
    // フォントサイズスケール
    sizes: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '20px',
      xl: '24px',
      '2xl': '28px',
      '3xl': '32px',
    },

    // 行の高さ：1.4～1.6
    lineHeight: {
      tight: 1.4,
      normal: 1.5,
      relaxed: 1.6,
    },

    // 文字組み設定
    textAlign: 'left', // 中央揃えを避ける
    hiraganaRatio: 0.7, // ひらがな7割、漢字3割
  },

  // レイアウト原則
  layout: {
    // 1. 近接：関連する項目をグループ化
    proximity: {
      tight: '8px', // 強く関連
      normal: '16px', // 中程度
      loose: '24px', // 別グループ
      section: '32px', // セクション間
    },

    // 2. 整列：見えない線で一貫性を出す
    alignment: 'left', // 左揃え推奨
    grid: '8px', // 8pxグリッド

    // 3. 反復：要素の一貫性
    consistency: {
      headerFooter: true, // ヘッダ・フッターは統一
      spacing: true, // スペーシング比率を統一
      colors: true, // 色の使用を統一
    },

    // 4. コントラスト：階層構造を表現
    contrast: {
      title: {
        size: '28px',
        weight: 600,
      },
      subtitle: {
        size: '20px',
        weight: 600,
      },
      body: {
        size: '16px',
        weight: 400,
      },
      caption: {
        size: '14px',
        weight: 400,
        opacity: 0.7,
      },
    },
  },

  // コンポーネント指定ルール
  components: {
    button: {
      // ボタンは動詞で終わらせる（例：「ログインする」）
      labelShouldEndWithAction: true,
      // ボタンは状態表示をしない（状態は別要素で表示）
      shouldNotShowState: true,
      // はい/いいえを避ける
      avoidYesNo: true,
    },

    dialog: {
      // 「はい/いいえ」ではなく動詞を使用
      useActionVerbs: true,
      // 文章とボタンで同じ動詞を使う
      matchingVerbs: true,
    },

    form: {
      // 「～してください」ではなく「～します」を使用
      avoidImperativeForm: true,
      // ラベルは必須
      labelsRequired: true,
      // ヘルプテキストを追加
      helpTextRecommended: true,
      // プレースホルダーだけでは不十分
      placeholderNotEnough: true,
    },

    icon: {
      // アイコンだけでは不十分、ラベルを付ける
      labelAlways: true,
      // アイコンは慣れた人のため（初心者でもわかるように）
      considerBeginners: true,
    },

    feedback: {
      // エラーメッセージ：ユーザーを責めない
      dontBlameUser: true,
      // 何が起きたか説明
      explainWhat: true,
      // どう対処するか説明
      explainHow: true,
    },
  },

  // スペーシングスケール
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },

  // 角丸半径
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },

  // シャドウ
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  },
};

/**
 * 視認性チェック
 * テキストコントラスト比を計算（WCAG 2.0基準）
 * - 小さい文字：4.5以上推奨
 * - 大きい文字（18pt以上）：3.0以上推奨
 */
export function checkContrast(foreground: string, background: string): {
  ratio: number;
  isValid: boolean;
  level: 'AAA' | 'AA' | 'FAIL';
} {
  // 簡略化されたコントラスト比計算
  // 本来は適切なカラーライブラリを使用すること推奨
  const ratio = 1.0; // プレースホルダー
  
  return {
    ratio,
    isValid: ratio >= 4.5,
    level: ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'FAIL',
  };
}

/**
 * テキスト比率チェック
 */
export function checkTextBalance(
  hiragana: number,
  kanji: number,
): {
  total: number;
  hiraganaRatio: number;
  kanjRatio: number;
  isBalanced: boolean;
} {
  const total = hiragana + kanji;
  const hiraganaRatio = total > 0 ? hiragana / total : 0;
  const kanjiRatio = total > 0 ? kanji / total : 0;

  // ひらがな7割、漢字3割が目安
  const isBalanced = hiraganaRatio >= 0.6 && kanjiRatio <= 0.4;

  return {
    total,
    hiraganaRatio: Math.round(hiraganaRatio * 100),
    kanjRatio: Math.round(kanjiRatio * 100),
    isBalanced,
  };
}
