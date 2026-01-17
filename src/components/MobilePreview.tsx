'use client';

import { useState, useEffect } from 'react';
import { Monitor, Smartphone, Tablet } from 'lucide-react';

type DeviceType = 'mobile' | 'tablet' | 'desktop';

const DEVICE_CONFIGS = {
  mobile: {
    name: '手机',
    icon: Smartphone,
    width: 375,
    height: 667,
    scale: 0.85,
  },
  mobileLarge: {
    name: '大屏手机',
    icon: Smartphone,
    width: 414,
    height: 896,
    scale: 0.8,
  },
  mobileXL: {
    name: '超大屏手机',
    icon: Smartphone,
    width: 428,
    height: 926,
    scale: 0.75,
  },
  tablet: {
    name: '平板',
    icon: Tablet,
    width: 768,
    height: 1024,
    scale: 0.6,
  },
  desktop: {
    name: '桌面',
    icon: Monitor,
    width: 1920,
    height: 1080,
    scale: 0.35,
  },
};

interface MobilePreviewProps {
  children: React.ReactNode;
}

export default function MobilePreview({ children }: MobilePreviewProps) {
  const [device, setDevice] = useState<keyof typeof DEVICE_CONFIGS>('mobile');
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const config = DEVICE_CONFIGS[device];
  const Icon = config.icon;

  // 键盘快捷键
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'f' || e.key === 'F') {
        setIsFullscreen(!isFullscreen);
      }
      if (e.key === 'h' || e.key === 'H') {
        setShowControls(!showControls);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showControls, isFullscreen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      {/* 预览控制面板 */}
      {showControls && !isFullscreen && (
        <div className="fixed top-4 left-4 right-4 z-50">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-4 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-orange-500" />
                <h3 className="font-semibold text-gray-900">设备预览模式</h3>
              </div>
              <button
                onClick={() => setShowControls(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 设备选择 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {(Object.keys(DEVICE_CONFIGS) as Array<keyof typeof DEVICE_CONFIGS>).map((key) => {
                const deviceConfig = DEVICE_CONFIGS[key];
                const DeviceIcon = deviceConfig.icon;
                const isActive = device === key;

                return (
                  <button
                    key={key}
                    onClick={() => setDevice(key)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <DeviceIcon className="w-6 h-6" />
                    <span className="text-xs font-medium">{deviceConfig.name}</span>
                  </button>
                );
              })}
            </div>

            {/* 快捷键提示 */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                快捷键: <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">F</span> 全屏预览 ·{' '}
                <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">H</span> 隐藏/显示控制面板
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 手机模拟器 */}
      {isFullscreen ? (
        // 全屏模式
        <div className="w-full h-full bg-white">
          {children}
        </div>
      ) : (
        // 设备模拟模式
        <div className="flex flex-col items-center gap-4">
          {/* 设备信息 */}
          <div className="text-white/80 text-sm flex items-center gap-2">
            <Icon className="w-4 h-4" />
            <span>{config.name}预览 ({config.width} × {config.height})</span>
          </div>

          {/* 手机外框 */}
          <div
            className="relative bg-black rounded-[3rem] p-3 shadow-2xl transition-all duration-300"
            style={{
              width: `${config.width * config.scale + 24}px`,
              height: `${config.height * config.scale + 24}px`,
            }}
          >
            {/* 手机屏幕 */}
            <div
              className="bg-white overflow-hidden rounded-[2.5rem]"
              style={{
                width: `${config.width * config.scale}px`,
                height: `${config.height * config.scale}px`,
              }}
            >
              {/* 状态栏模拟 */}
              <div className="bg-gray-50 h-6 flex items-center justify-between px-4 text-xs font-medium text-gray-600 border-b border-gray-100">
                <span>9:41</span>
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* 内容区域（缩放以适应手机屏幕） */}
              <div
                className="overflow-y-auto overflow-x-hidden"
                style={{
                  width: '100%',
                  height: `calc(100% - 24px)`,
                  transform: `scale(${config.scale})`,
                  transformOrigin: 'top left',
                }}
              >
                <div
                  style={{
                    width: `${config.width}px`,
                    minHeight: `${config.height}px`,
                  }}
                >
                  {children}
                </div>
              </div>
            </div>

            {/* 底部Home Indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-white/30 rounded-full" />
          </div>

          {/* 提示信息 */}
          <p className="text-white/60 text-xs text-center max-w-md">
            这是移动端预览模式，在实际设备上会自动适配屏幕尺寸
          </p>
        </div>
      )}

      {/* 显示控制按钮 */}
      {!showControls && !isFullscreen && (
        <button
          onClick={() => setShowControls(true)}
          className="fixed bottom-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-full shadow-lg hover:shadow-xl transition-all z-50"
        >
          <Monitor className="w-5 h-5 text-gray-700" />
        </button>
      )}

      {/* 全屏按钮 */}
      {!isFullscreen && (
        <button
          onClick={() => setIsFullscreen(true)}
          className="fixed top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all text-sm font-medium text-gray-700 z-50"
        >
          全屏预览
        </button>
      )}
    </div>
  );
}
