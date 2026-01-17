'use client';

import { useEffect, useState } from 'react';

export default function LoadingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 自动跳转到首页
    const timer = setTimeout(() => {
      window.location.href = '/';
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mb-4"></div>
        <p className="text-gray-600 text-lg">正在加载...</p>
      </div>
    </div>
  );
}
