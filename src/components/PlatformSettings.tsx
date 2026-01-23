'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Plus,
  Trash2,
  Save,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Edit3,
} from 'lucide-react';
import { PLATFORMS_CONFIG } from '@/lib/config';

type DialogMode = 'none' | 'list' | 'add' | 'edit';

export default function PlatformSettings() {
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>('none');
  const [editingPlatform, setEditingPlatform] = useState<any | null>(null);
  const [testResult, setTestResult] = useState<{ platform: string; success: boolean; message: string } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    loadPlatforms();
  }, []);

  const loadPlatforms = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      // 直接从配置文件读取
      setPlatforms([...PLATFORMS_CONFIG.settings.platforms]);
    } catch (error) {
      console.error('加载平台配置失败:', error);
      setErrorMessage('加载失败');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenListDialog = async () => {
    setDialogMode('list');
    setErrorMessage(null);
    await loadPlatforms();
  };

  const handleOpenAddDialog = () => {
    setDialogMode('add');
    setEditingPlatform({
      id: 0,
      key: '',
      name: '',
      apiUrl: '',
      latestApiUrl: '',
      method: 'GET',
      enabled: true,
      priority: platforms.length,
    });
    setSaveSuccess(false);
    setErrorMessage(null);
  };

  const handleOpenEditDialog = (platform: any) => {
    setDialogMode('edit');
    setEditingPlatform(platform);
    setSaveSuccess(false);
    setErrorMessage(null);
  };

  const handleCloseDialog = () => {
    setDialogMode('none');
    setEditingPlatform(null);
    setSaveSuccess(false);
    setErrorMessage(null);
  };

  const handleSave = async (platform: any) => {
    try {
      setErrorMessage(null);
      // 注意：此组件仅用于显示配置，实际修改需要在 @/lib/config.ts 中进行
      setSaveSuccess(true);
      setTimeout(() => {
        setDialogMode('list');
        setSaveSuccess(false);
      }, 1500);
    } catch (error) {
      console.error('保存平台配置失败:', error);
      setErrorMessage('保存失败');
    }
  };

  const handleToggleEnabled = async (platform: any) => {
    try {
      // 注意：此组件仅用于显示配置，实际修改需要在 @/lib/config.ts 中进行
      setErrorMessage('请在 @/lib/config.ts 文件中直接修改配置');
    } catch (error) {
      console.error('更新平台状态失败:', error);
      setErrorMessage('更新失败');
    }
  };

  const handleTestApi = async (platform: any, apiUrl?: string) => {
    try {
      const testApiUrl = apiUrl || platform.apiUrl;
      setTestResult({ platform: platform.key, success: false, message: '测试中...' });

      const response = await fetch(testApiUrl);

      if (response.ok) {
        const result = await response.json();
        setTestResult({
          platform: platform.key,
          success: true,
          message: `API 响应正常 (${response.status})`,
        });
      } else {
        setTestResult({
          platform: platform.key,
          success: false,
          message: `HTTP ${response.status}: ${response.statusText}`,
        });
      }
    } catch (error) {
      console.error('测试 API 失败:', error);
      setTestResult({
        platform: platform.key,
        success: false,
        message: '网络错误',
      });
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleOpenListDialog}
        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
      >
        <Edit3 className="w-4 h-4 mr-1" />
        配置
      </Button>

      {/* 列表对话框 */}
      <Dialog open={dialogMode === 'list'} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="max-w-4xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle>平台 API 配置</DialogTitle>
            <DialogDescription>
              管理各平台的数据获取接口配置（热榜 API 和最新 API）
              <br />
              <span className="text-sm text-orange-600">提示：实际配置修改请在 src/lib/config.ts 文件中进行</span>
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[600px] pr-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : platforms.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                暂无平台配置
              </div>
            ) : (
              <div className="space-y-4">
                {platforms.map((platform) => (
                  <div key={platform.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <h4 className="font-semibold text-lg">{platform.name}</h4>
                          <Badge variant={platform.enabled ? 'default' : 'secondary'}>
                            {platform.enabled ? '启用' : '禁用'}
                          </Badge>
                        </div>
                        <div className="text-sm space-y-2">
                          <div className="break-all">
                            <span className="text-gray-400 font-medium">Key:</span>{' '}
                            <span className="font-mono text-blue-600 bg-blue-50 px-1 rounded">{platform.key}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTestApi(platform, platform.apiUrl)}
                          disabled={testResult?.platform === platform.key}
                        >
                          {testResult?.platform === platform.key ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <RefreshCw className="w-4 h-4" />
                          )}
                          测试热榜
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTestApi(platform, platform.latestApiUrl)}
                          disabled={testResult?.platform === platform.key}
                        >
                          {testResult?.platform === platform.key ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <RefreshCw className="w-4 h-4" />
                          )}
                          测试最新
                        </Button>
                        {testResult?.platform === platform.key && testResult && (
                          <div className={`text-xs ${testResult.success ? 'text-green-600' : 'text-red-600'}`}>
                            {testResult.message}
                          </div>
                        )}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      {/* 热榜 API */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Label className="text-sm font-semibold text-orange-600">🔥 热榜 API</Label>
                        </div>
                        <div className="bg-orange-50 border border-orange-200 rounded p-2">
                          <div className="text-xs text-gray-600 font-mono break-all">
                            {platform.apiUrl || '未配置'}
                          </div>
                        </div>
                      </div>

                      {/* 最新 API */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Label className="text-sm font-semibold text-blue-600">📰 最新 API</Label>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded p-2">
                          <div className="text-xs text-gray-600 font-mono break-all">
                            {platform.latestApiUrl || '未配置'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Method: {platform.method}</span>
                        <span>Priority: {platform.priority}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {errorMessage && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-between pt-4">
            <Button onClick={handleOpenAddDialog} disabled>
              <Plus className="w-4 h-4 mr-2" />
              添加平台
            </Button>
            <Button onClick={handleCloseDialog}>关闭</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 添加/编辑对话框 */}
      <Dialog open={dialogMode === 'add' || dialogMode === 'edit'} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'add' ? '添加平台' : '编辑平台'}
            </DialogTitle>
            <DialogDescription>
              配置平台的两个 API 接口
            </DialogDescription>
          </DialogHeader>

          <PlatformForm
            platform={editingPlatform!}
            onSave={handleSave}
            onCancel={handleCloseDialog}
            saveSuccess={saveSuccess}
            errorMessage={errorMessage}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

function PlatformForm({
  platform,
  onSave,
  onCancel,
  saveSuccess,
  errorMessage,
}: {
  platform: any;
  onSave: (platform: any) => void;
  onCancel: () => void;
  saveSuccess: boolean;
  errorMessage: string | null;
}) {
  const [formData, setFormData] = useState(platform);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="key">平台 Key</Label>
        <Input
          id="key"
          value={formData.key}
          onChange={(e) => setFormData({ ...formData, key: e.target.value })}
          placeholder="例如: zhihu"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">平台名称</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="例如: 知乎"
          required
        />
      </div>

      {/* 热榜 API */}
      <div className="space-y-2">
        <Label htmlFor="apiUrl" className="text-orange-600 font-semibold">🔥 热榜 API 地址</Label>
        <Input
          id="apiUrl"
          value={formData.apiUrl}
          onChange={(e) => setFormData({ ...formData, apiUrl: e.target.value })}
          placeholder="https://..."
          required
        />
        <p className="text-xs text-gray-500">用于获取热榜数据</p>
      </div>

      {/* 最新 API */}
      <div className="space-y-2">
        <Label htmlFor="latestApiUrl" className="text-blue-600 font-semibold">📰 最新 API 地址</Label>
        <Input
          id="latestApiUrl"
          value={formData.latestApiUrl || ''}
          onChange={(e) => setFormData({ ...formData, latestApiUrl: e.target.value })}
          placeholder="https://..."
        />
        <p className="text-xs text-gray-500">用于获取最新资讯数据</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="method">请求方法</Label>
        <select
          id="method"
          value={formData.method}
          onChange={(e) => setFormData({ ...formData, method: e.target.value as 'GET' | 'POST' })}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="enabled"
          checked={formData.enabled}
          onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
        />
        <Label htmlFor="enabled">启用此平台</Label>
      </div>

      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {saveSuccess && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            保存成功
            <br />
            <span className="text-xs">实际配置请在 src/lib/config.ts 文件中修改</span>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit" disabled>
          <Save className="w-4 h-4 mr-2" />
          保存
        </Button>
      </div>
    </form>
  );
}
