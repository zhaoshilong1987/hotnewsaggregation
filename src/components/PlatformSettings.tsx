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
import type { PlatformConfig } from '@/storage/file/types';

type DialogMode = 'none' | 'list' | 'add' | 'edit';

export default function PlatformSettings() {
  const [platforms, setPlatforms] = useState<PlatformConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>('none');
  const [editingPlatform, setEditingPlatform] = useState<PlatformConfig | null>(null);
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
      const response = await fetch('/api/platforms');
      const result = await response.json();

      if (result.success) {
        setPlatforms(result.data);
      } else {
        setErrorMessage('加载平台配置失败: ' + result.error);
      }
    } catch (error) {
      console.error('加载平台配置失败:', error);
      setErrorMessage('网络错误，加载失败');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenListDialog = async () => {
    setDialogMode('list');
    setErrorMessage(null);
    // 每次打开对话框时重新加载数据
    await loadPlatforms();
  };

  const handleOpenAddDialog = () => {
    setDialogMode('add');
    setEditingPlatform({
      id: 0,
      key: '',
      name: '',
      apiUrl: '',
      method: 'GET',
      enabled: true,
      priority: platforms.length,
    });
    setSaveSuccess(false);
    setErrorMessage(null);
  };

  const handleOpenEditDialog = (platform: PlatformConfig) => {
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

  const handleSave = async (platform: PlatformConfig) => {
    try {
      setErrorMessage(null);
      const response = await fetch('/api/platforms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(platform),
      });

      const result = await response.json();

      if (result.success) {
        setSaveSuccess(true);
        await loadPlatforms();
        setTimeout(() => {
          setDialogMode('list');
          setSaveSuccess(false);
        }, 800);
      } else {
        setErrorMessage('保存失败: ' + result.error);
      }
    } catch (error) {
      console.error('保存平台配置失败:', error);
      setErrorMessage('网络错误，保存失败');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个平台配置吗？删除后无法恢复！')) return;

    try {
      const response = await fetch(`/api/platforms?id=${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        await loadPlatforms();
      } else {
        alert('删除失败: ' + result.error);
      }
    } catch (error) {
      console.error('删除平台配置失败:', error);
      alert('删除失败');
    }
  };

  const handleToggleEnabled = async (platform: PlatformConfig) => {
    try {
      const response = await fetch('/api/platforms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...platform,
          enabled: !platform.enabled,
        }),
      });

      const result = await response.json();

      if (result.success) {
        await loadPlatforms();
      } else {
        alert('更新失败: ' + result.error);
      }
    } catch (error) {
      console.error('更新平台状态失败:', error);
      alert('更新失败');
    }
  };

  const handleTestApi = async (platform: PlatformConfig) => {
    try {
      setTestResult({ platform: platform.key, success: false, message: '测试中...' });

      const response = await fetch(`/api/news/${platform.key}`);

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setTestResult({
            platform: platform.key,
            success: true,
            message: `成功获取 ${result.data.length} 条数据`,
          });
        } else {
          setTestResult({
            platform: platform.key,
            success: false,
            message: result.error || '获取数据失败',
          });
        }
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
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>平台 API 配置</DialogTitle>
            <DialogDescription>
              管理各平台的数据获取接口配置
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[500px] pr-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : platforms.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                暂无平台配置
              </div>
            ) : (
              <div className="space-y-3">
                {platforms.map((platform) => (
                  <div key={platform.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{platform.name}</h4>
                          <Badge variant={platform.enabled ? 'default' : 'secondary'}>
                            {platform.enabled ? '启用' : '禁用'}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="break-all">
                            <span className="text-gray-400">Key:</span> {platform.key}
                          </div>
                          <div className="break-all">
                            <span className="text-gray-400">API:</span> {platform.apiUrl}
                          </div>
                          <div>
                            <span className="text-gray-400">Method:</span> {platform.method}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTestApi(platform)}
                          disabled={testResult?.platform === platform.key}
                        >
                          {testResult?.platform === platform.key ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <RefreshCw className="w-4 h-4" />
                          )}
                          测试
                        </Button>
                        {testResult?.platform === platform.key && (
                          <div className={`text-xs ${testResult.success ? 'text-green-600' : 'text-red-600'}`}>
                            {testResult.message}
                          </div>
                        )}
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <Switch
                        checked={platform.enabled}
                        onCheckedChange={() => handleToggleEnabled(platform)}
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEditDialog(platform)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(platform.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
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
            <Button onClick={handleOpenAddDialog}>
              <Plus className="w-4 h-4 mr-2" />
              添加平台
            </Button>
            <Button onClick={handleCloseDialog}>关闭</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 添加/编辑对话框 */}
      <Dialog open={dialogMode === 'add' || dialogMode === 'edit'} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'add' ? '添加平台' : '编辑平台'}
            </DialogTitle>
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
  platform: PlatformConfig;
  onSave: (platform: PlatformConfig) => void;
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

      <div className="space-y-2">
        <Label htmlFor="apiUrl">API 地址</Label>
        <Input
          id="apiUrl"
          value={formData.apiUrl}
          onChange={(e) => setFormData({ ...formData, apiUrl: e.target.value })}
          placeholder="https://..."
          required
        />
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
          <AlertDescription className="text-green-800">保存成功</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit">
          <Save className="w-4 h-4 mr-2" />
          保存
        </Button>
      </div>
    </form>
  );
}
