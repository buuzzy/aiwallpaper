"use client";

interface PaginationProps {
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  loadMoreText?: string;
  loadingText?: string;
  noMoreText?: string;
}

export default function Pagination({
  isLoading,
  hasMore,
  onLoadMore,
  loadMoreText = "加载更多",
  loadingText = "加载中...",
  noMoreText = "没有更多了"
}: PaginationProps) {
  return (
    <div className="flex justify-center my-8">
      {hasMore ? (
        <button
          onClick={onLoadMore}
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
        >
          {isLoading ? loadingText : loadMoreText}
        </button>
      ) : (
        <p className="text-gray-500">{noMoreText}</p>
      )}
    </div>
  );
}