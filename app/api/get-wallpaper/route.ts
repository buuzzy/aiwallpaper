import { getWallpapers } from "@/models/walpaper";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        // 从 URL 参数获取分页信息
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        
        // 限制 limit 的最大值，防止请求过多数据
        const safeLimit = Math.min(limit, 50);
        
        const wallpapers = await getWallpapers(page, safeLimit);
        
        return Response.json({
            code: 0,
            message: "success",
            data: wallpapers || [], // 确保返回空数组而不是 undefined
            pagination: {
                page,
                limit: safeLimit,
                // 如果需要总数，可以添加一个获取总数的函数
                // total: await getWallpapersCount()
            }
        });
        
    } catch (error: any) {
        console.error("Get wallpapers error:", error);
        return Response.json({
            code: 500,
            message: error.message || "获取壁纸列表失败",
            data: []
        }, { status: 500 });
    }
}