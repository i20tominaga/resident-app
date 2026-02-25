import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';

interface ActionButtonProps extends ButtonProps {
  /**
   * アクション動詞（例：「ログイン」ではなく「ログインする」）
   */
  action: string;
  /**
   * ボタンのコンテキストについての短い説明
   * （アクセシビリティとユーザビリティのため）
   */
  description?: string;
  /**
   * ボタンが実行中かどうか
   */
  isLoading?: boolean;
}

/**
 * ActionButton
 * UXライティング原則に従ったボタンコンポーネント
 * - ボタンラベルは動詞で終わる（例：「保存する」「削除する」）
 * - 状態表示はボタンのテキストには含めない（状態は別要素で表示）
 * - アクセシビリティのため説明文を提供
 */
export const ActionButton = React.forwardRef<
  HTMLButtonElement,
  ActionButtonProps
>(({ action, description, isLoading, children, disabled, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      disabled={disabled || isLoading}
      title={description}
      aria-label={description ? `${action}: ${description}` : action}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="inline-block animate-spin mr-2">⟳</span>
          {action}中…
        </>
      ) : (
        action
      )}
    </Button>
  );
});

ActionButton.displayName = 'ActionButton';
