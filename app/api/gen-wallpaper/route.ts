import { getOpenAIClient } from "@/service/openai";
import { downloadAndUploadImage } from "@/lib/s3";
import { Wallpaper } from "@/types/wallpaper";
import { ImageGenerateParams } from "openai/resources/images.mjs";
import { insertWallpaper } from "@/models/walpaper";
import { auth, currentUser } from "@clerk/nextjs/server";

// 响应类型定义
type GenerateResponse = {
    code: number;
    message: string;
    data?: {
        img_description: string;
        img_url: string;
        created_at: string;
        img_size: string;
        user_name: string;
        user_avatar: string;
    }
};

export async function POST(req: Request) {
    try {
        // 获取用户认证信息
        const authData = await auth();
        const userId = authData.userId;
        
        // 获取更详细的用户信息
        const user = await currentUser();
        const userName = user?.firstName && user?.lastName 
            ? `${user.firstName} ${user.lastName}` 
            : user?.username || "AI User";
        const userImage = user?.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`;
        
        // 检查用户是否已登录
        if (!userId) {
            return Response.json({ 
                code: 401, 
                message: "请先登录后再生成壁纸" 
            }, { status: 401 });
        }

        // 验证环境变量
        if (!process.env.AWS_BUCKET_NAME) {
            throw new Error("AWS_BUCKET_NAME is required");
        }

        // 解析并验证请求参数
        const { description } = await req.json();
        if (!description || description.length > 1000) {
            return Response.json({ 
                code: 400, 
                message: "Description is invalid or too long" 
            }, { status: 400 });
        }

        // 调用 OpenAI 生成图片
        const openai = getOpenAIClient();
        const llm_name = "dall-e-3";
        const llm_params: ImageGenerateParams = {
            model: "dall-e-3",
            prompt: description,
            n: 1,
            size: "1792x1024",
            quality: "standard",
            style: "natural",
        };
        
        const response = await openai.images.generate(llm_params);
        const imageUrl = response.data[0]?.url;
        
        if (!imageUrl) {
            throw new Error("Failed to generate image");
        }

        // 下载并上传到 S3
        const img_size = "1792x1024";
        const s3Key = `wallpapers/${Date.now()}-${Math.random().toString(36).slice(2)}.png`;
        const s3Result = await downloadAndUploadImage(imageUrl, process.env.AWS_BUCKET_NAME, s3Key);
        
        // 检查 s3Result.Location 是否存在
        if (!s3Result.Location) {
            throw new Error("Failed to upload image to S3");
        }
        
        // 准备数据库记录
        const now = new Date().toISOString();
        
        // 获取用户信息
        const userEmail = userId; // 或者从 Clerk API 获取更多用户信息
        
        const wallpaper: Wallpaper = {
            user_email: userId,
            user_name: userName,
            user_avatar: userImage,
            img_description: description,
            img_size,
            img_url: s3Result.Location,
            llm_name,
            llm_params: JSON.stringify(llm_params),
            created_at: now
        };

        // 保存到数据库
        await insertWallpaper(wallpaper);

        // 返回成功响应，包含用户信息
        return Response.json({
            code: 0,
            message: "success",
            data: {
                img_description: description,
                img_url: s3Result.Location,
                created_at: now,
                img_size,
                user_name: userName,
                user_avatar: userImage
            }
        } as GenerateResponse);

    } catch (error: any) {
        // 错误日志和响应
        console.error("Generate wallpaper error:", error);
        return Response.json({
            code: 500,
            message: error.message || "生成图片失败"
        } as GenerateResponse, { status: 500 });
    }
}