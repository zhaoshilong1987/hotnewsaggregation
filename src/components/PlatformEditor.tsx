'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Check, ChevronUp, ChevronDown, GripVertical, Save } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { PLATFORMS } from '@/types/news';
import PlatformIcon from '@/components/PlatformIcon';

// 自定义向上箭头加横线的图标
function PinTopIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* 上方横线 */}
      <line x1="5" y1="3" x2="19" y2="3" />
      {/* 向上箭头 */}
      <path d="M12 15V7" />
      <path d="M8 11L12 7L16 11" />
    </svg>
  );
}

interface PlatformEditorProps {
  visiblePlatforms: string[];
  hiddenPlatforms: string[];
  onSave: (visible: string[], hidden: string[]) => void;
  onCancel: () => void;
}

interface PlatformItem {
  key: string;
  name: string;
  visible: boolean;
  pinned: boolean;
}

export default function PlatformEditor({
  visiblePlatforms,
  hiddenPlatforms,
  onSave,
  onCancel,
}: PlatformEditorProps) {
  // 控制拖拽状态
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  // 保存状态
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 合并所有平台，统一管理
  const [platforms, setPlatforms] = useState<PlatformItem[]>(() => {
    const items: PlatformItem[] = [];

    // 添加显示的平台
    visiblePlatforms.forEach(key => {
      const platform = PLATFORMS.find(p => p.key === key);
      if (platform) {
        items.push({
          key: platform.key,
          name: platform.name,
          visible: true,
          pinned: false,
        });
      }
    });

    // 添加隐藏的平台
    hiddenPlatforms.forEach(key => {
      const platform = PLATFORMS.find(p => p.key === key);
      if (platform) {
        items.push({
          key: platform.key,
          name: platform.name,
          visible: false,
          pinned: false,
        });
      }
    });

    return items;
  });

  // 自动保存（防抖）
  useEffect(() => {
    // 清除之前的定时器
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // 延迟 1 秒后自动保存
    saveTimeoutRef.current = setTimeout(() => {
      autoSave();
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [platforms]);

  // 自动保存函数
  const autoSave = async () => {
    try {
      setIsSaving(true);
      setSaveSuccess(false);

      const visible = platforms.filter(p => p.visible).map(p => p.key);
      const hidden = platforms.filter(p => !p.visible).map(p => p.key);

      await onSave(visible, hidden);

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (error) {
      console.error('自动保存失败:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // 切换显示/隐藏
  const handleToggleVisible = (index: number) => {
    const newPlatforms = [...platforms];
    newPlatforms[index].visible = !newPlatforms[index].visible;
    setPlatforms(newPlatforms);
  };

  // 切换置顶
  const handleTogglePinned = (index: number) => {
    const newPlatforms = [...platforms];
    const isPinned = newPlatforms[index].pinned;

    if (isPinned) {
      // 取消置顶
      newPlatforms[index].pinned = false;
    } else {
      // 置顶：将该项移到最前面（第一行）
      newPlatforms[index].pinned = true;
      const item = newPlatforms.splice(index, 1)[0];
      newPlatforms.splice(0, 0, item);
    }

    setPlatforms(newPlatforms);
  };

  // 上移
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newPlatforms = [...platforms];
    const temp = newPlatforms[index];
    newPlatforms[index] = newPlatforms[index - 1];
    newPlatforms[index - 1] = temp;
    setPlatforms(newPlatforms);
  };

  // 下移
  const handleMoveDown = (index: number) => {
    if (index === platforms.length - 1) return;
    const newPlatforms = [...platforms];
    const temp = newPlatforms[index];
    newPlatforms[index] = newPlatforms[index + 1];
    newPlatforms[index + 1] = temp;
    setPlatforms(newPlatforms);
  };

  // 拖拽开始
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  // 拖拽经过
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;

    const newPlatforms = [...platforms];
    const draggedItem = newPlatforms[dragIndex];
    newPlatforms.splice(dragIndex, 1);
    newPlatforms.splice(index, 0, draggedItem);
    setPlatforms(newPlatforms);
    setDragIndex(index);
  };

  // 拖拽结束
  const handleDragEnd = () => {
    setDragIndex(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">编辑平台标签</h2>
            {/* 保存状态提示 */}
            {isSaving && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Save className="w-3 h-3 animate-spin" />
                保存中...
              </span>
            )}
            {saveSuccess && !isSaving && (
              <span className="text-xs text-green-600 flex items-center gap-1">
                <Check className="w-3 h-3" />
                已保存
              </span>
            )}
          </div>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 内容区 */}
        <div className="flex-1 overflow-y-auto">
          {/* 提示信息 */}
          <div className="mx-4 mt-4 mb-2 py-2 px-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-600">
              💡 调整完成后自动保存，点击排序图标可上下移动平台，置顶的标签会优先显示
            </p>
          </div>

          {/* 表格区域 */}
          <div className="px-4">
            {/* 标题栏 */}
            <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-t-lg border-b border-gray-200">
              <div className="w-12 text-xs font-medium text-gray-500">显示</div>
              <div className="flex-1 text-xs font-medium text-gray-500">平台</div>
              <div className="w-12 text-xs font-medium text-gray-500 text-center">置顶</div>
              <div className="w-12 text-xs font-medium text-gray-500 text-center">排序</div>
            </div>

            {/* 平台列表 */}
            <div className="space-y-1 mt-1">
              {platforms.map((platform, index) => (
                <div
                  key={platform.key}
                  className={`
                    flex items-center gap-3 px-3 py-3 bg-white rounded-lg
                    border transition-all
                    ${platform.visible ? 'border-gray-200' : 'border-gray-200 bg-gray-50'}
                  `}
                >
                  {/* 第一列：开关 */}
                  <div className="w-12 flex-shrink-0">
                    <Switch
                      checked={platform.visible}
                      onCheckedChange={() => handleToggleVisible(index)}
                      className="flex-shrink-0"
                    />
                  </div>

                  {/* 第二列：平台信息 */}
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <PlatformIcon platform={platform.key as any} size={20} />
                    <span className={`text-sm font-medium truncate ${
                      platform.visible ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {platform.name}
                    </span>
                  </div>

                  {/* 第三列：置顶 */}
                  <div className="w-12 flex-shrink-0 flex justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 p-0 hover:bg-gray-100 text-gray-400"
                      onClick={() => handleTogglePinned(index)}
                      title={platform.pinned ? '取消置顶' : '置顶'}
                    >
                      <PinTopIcon className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* 第四列：排序 */}
                  <div className="w-12 flex-shrink-0 flex justify-center">
                    <div
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`h-8 w-8 flex items-center justify-center cursor-grab active:cursor-grabbing rounded-lg hover:bg-gray-100 text-gray-400 ${
                        dragIndex === index ? 'bg-gray-200' : ''
                      }`}
                      title="拖动调整排序"
                    >
                      <GripVertical className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
