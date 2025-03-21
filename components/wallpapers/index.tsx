"use client";

import { Wallpaper } from "@/types/wallpaper";
import { useState } from "react";
import { useWallpaper } from '@/context/wallpaper';
import Pagination from '@/components/pageination';

const WallpaperCard = ({ wallpaper }: { wallpaper: Wallpaper }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-[16/9] overflow-hidden bg-gray-100 relative">
        <img 
          className={`w-full h-full object-cover ${imageError ? 'hidden' : ''}`}
          src={wallpaper.img_url} 
          alt={wallpaper.img_description || "AI Generated Wallpaper"}
          loading="lazy"
          onError={() => setImageError(true)}
        />

        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50">
            <p className="text-red-500 text-xs">图片加载失败</p>
          </div>
        )}
      </div>

      <div className="p-2">
        <p className="text-xs text-gray-600 line-clamp-2 h-8 overflow-hidden">
          {wallpaper.img_description}
        </p>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center space-x-1">
            <img 
              src={wallpaper.user_avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=AI"}
              alt="Avatar"
              className="w-5 h-5 rounded-full"
            />
            <p className="text-xs text-gray-500">{wallpaper.user_name || "AI"}</p>
          </div>
          <p className="text-xs text-gray-400">{new Date(wallpaper.created_at || '').toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default function WallpaperList() {
  const { wallpapers, isLoading, error, hasMore, loadMoreWallpapers } = useWallpaper();

  if (error) {
    return <div className="text-center text-red-500 my-4 text-sm">{error}</div>;
  }

  if (isLoading && wallpapers.length === 0) {
    return <div className="text-center my-4 text-sm">加载中...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-xl font-medium mb-4 text-center text-gray-800">
        {wallpapers.length > 0 ? `${wallpapers.length}+ 张 AI 生成壁纸` : 'AI 壁纸'}
      </h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {wallpapers.map((wallpaper) => (
          <WallpaperCard key={wallpaper.id || wallpaper.img_url} wallpaper={wallpaper} />
        ))}
      </div>
      
      <Pagination
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadMore={loadMoreWallpapers}
        loadMoreText="加载更多"
        noMoreText="没有更多壁纸了"
      />
    </div>
  );
}