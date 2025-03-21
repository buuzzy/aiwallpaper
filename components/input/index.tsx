"use client";

import { useState } from "react";
import { Wallpaper } from "@/types/wallpaper";
import { useWallpaper } from "@/context/wallpaper";
import { useAuth, SignInButton, useUser } from "@clerk/nextjs";

export default function PromptInput() {
    const { addWallpaper } = useWallpaper();
    const { isLoaded, userId } = useAuth();
    const { user } = useUser();
    const [isGenerating, setIsGenerating] = useState(false);    
    const [prompt, setPrompt] = useState("");
    const [error, setError] = useState("");

    const generateWallpaper = async function () {
        // 检查用户是否已登录，如果未登录则不执行后续操作
        // 错误信息会在 API 调用失败后显示
        setError("");
        setIsGenerating(true);
        try {
            const params = {
                description: prompt
            };

            console.log("发送请求参数:", params);

            const result = await fetch("/api/gen-wallpaper", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(params)
            });

            const data = await result.json();
            console.log("API 响应数据:", data);

            if (data.code === 401) {
                // 未登录错误，显示登录按钮
                throw new Error("请先登录后再生成壁纸");
            }

            if (data.code !== 0) {
                throw new Error(data.message || "生成壁纸失败");
            }

            if (!data.data?.img_url) {
                throw new Error("生成的图片数据无效");
            }

            // 获取用户信息
            const userName = user?.fullName || user?.username || "AI User";
            const userAvatar = user?.imageUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=AI";

            // 创建新的壁纸对象
            const newWallpaper: Wallpaper = {
                img_url: data.data.img_url,
                img_description: data.data.img_description,
                created_at: new Date().toISOString(),
                user_name: userName,
                user_avatar: userAvatar,
                img_size: data.data.img_size || "1792x1024",
                user_email: userId || "",
                llm_name: "dall-e-3",
                llm_params: {
                    model: "dall-e-3",
                    prompt: prompt,
                    n: 1,
                    size: data.data.img_size || "1792x1024",
                    quality: "standard",
                    style: "natural"
                }
            };

            // 添加到壁纸列表
            addWallpaper(newWallpaper);
            
            // 清空输入框
            setPrompt("");
        } catch (error: any) {
            console.error("生成壁纸失败:", error);
            setError(error.message);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="bg-gradient-to-b from-white to-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="描述你想要的壁纸，例如：一片星空下的湖泊，倒映着满天繁星..."
                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        
                        <button
                            onClick={generateWallpaper}
                            disabled={isGenerating || !prompt.trim()}
                            className="whitespace-nowrap bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isGenerating ? "生成中..." : "生成壁纸"}
                        </button>
                    </div>
                    
                    {error && error.includes("请先登录") ? (
                        <div className="flex flex-col items-center space-y-3">
                            <p className="text-red-500 text-sm">{error}</p>
                            <SignInButton mode="modal">
                                <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                                    登录
                                </button>
                            </SignInButton>
                        </div>
                    ) : error ? (
                        <div className="text-red-500 text-sm">{error}</div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}