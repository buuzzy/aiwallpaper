"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import type { Wallpaper } from '@/types/wallpaper';

interface WallpaperContextType {
  wallpapers: Wallpaper[];
  isLoading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  refreshWallpapers: () => Promise<void>;
  loadMoreWallpapers: () => Promise<void>;
  addWallpaper: (wallpaper: Wallpaper) => void;
}

const WallpaperContext = createContext<WallpaperContextType | null>(null);

export function WallpaperProvider({ children }: { children: React.ReactNode }) {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10; // 每页显示的数量

  // 从服务器获取壁纸数据（刷新）
  const refreshWallpapers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/get-wallpaper?page=1&limit=${limit}`);
      const data = await response.json();
      
      if (data.code === 0) {
        setWallpapers(data.data);
        setPage(1);
        setHasMore(data.data.length === limit);
      } else {
        setError(data.message || '获取壁纸失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 加载更多壁纸（分页）
  const loadMoreWallpapers = async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const response = await fetch(`/api/get-wallpaper?page=${nextPage}&limit=${limit}`);
      const data = await response.json();
      
      if (data.code === 0) {
        if (data.data.length > 0) {
          setWallpapers(prev => [...prev, ...data.data]);
          setPage(nextPage);
          setHasMore(data.data.length === limit);
        } else {
          setHasMore(false);
        }
      } else {
        setError(data.message || '获取更多壁纸失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    refreshWallpapers();
  }, []);

  // 添加新壁纸（客户端临时更新，同时刷新服务器数据）
  const addWallpaper = (wallpaper: Wallpaper) => {
    // 先更新本地状态提供即时反馈
    setWallpapers(prev => [wallpaper, ...prev]);
    // 然后刷新服务器数据以确保一致性
    setTimeout(() => refreshWallpapers(), 1000);
  };

  return (
    <WallpaperContext.Provider value={{ 
      wallpapers, 
      isLoading, 
      error, 
      page,
      hasMore,
      refreshWallpapers, 
      loadMoreWallpapers,
      addWallpaper 
    }}>
      {children}
    </WallpaperContext.Provider>
  );
}

export function useWallpaper() {
  const context = useContext(WallpaperContext);
  if (!context) {
    throw new Error('useWallpaper must be used within a WallpaperProvider');
  }
  return context;
}