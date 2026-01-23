'use client';

import { useEffect } from 'react';

interface BackButtonHandlerProps {
  onBack: () => boolean; // 返回 true 表示阻止默认后退行为
}

export default function BackButtonHandler({ onBack }: BackButtonHandlerProps) {
  useEffect(() => {
    // 动态导入 Capacitor，避免服务端渲染问题
    let BackButton: any;
    let App: any;

    const initBackButton = async () => {
      try {
        const capacitor = await import('@capacitor/core');
        if (capacitor.Capacitor.isNativePlatform()) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const backButtonModule = await import('@capacitor/android');
          BackButton = backButtonModule.BackButton;
          App = backButtonModule.App;

          // 监听后退按钮
          BackButton.addListener('backButton', ({ canGoBack }: { canGoBack: boolean }) => {
            const shouldPreventDefault = onBack();
            if (!shouldPreventDefault) {
              // 如果不需要阻止默认行为，退出应用
              App.exitApp();
            }
          });
        }
      } catch (error) {
        console.error('Failed to initialize back button handler:', error);
      }
    };

    initBackButton();

    // 清理函数
    return () => {
      if (BackButton) {
        BackButton.removeAllListeners();
      }
    };
  }, [onBack]);

  return null; // 这个组件不渲染任何内容
}
