"use client";

import { useState } from "react";
import { Wallpaper } from "@/types/wallpaper";
import { useWallpaper } from "@/context/wallpaper";

export default function PromptInput() {
    const { addWallpaper } = useWallpaper();
    const [isGenerating, setIsGenerating] = useState(false);    
    const [prompt, setPrompt] = useState("");

    const generateWallpaper = async function () {
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

            if (data.code !== 0) {
                throw new Error(data.message || "生成壁纸失败");
            }

            if (!data.data?.img_url) {
                throw new Error("生成的图片数据无效");
            }

            // 创建新的壁纸对象
            const newWallpaper: Wallpaper = {
                img_url: data.data.img_url,
                img_description: data.data.img_description,
                created_at: new Date().toISOString(),
                user_name: "AI Generated",
                user_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AI",
                img_size: "1792x1024",
                user_email: "anonymous@wallpaper.ai",
                llm_name: "claude-3"
            };

            addWallpaper(newWallpaper);

            // 清空输入
            setPrompt("");

        } catch (error: any) {
            console.error("生成失败:", error);
            alert(error.message || "生成壁纸失败，请重试");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = async function () {
        if (!prompt.trim()) {
            alert("壁纸描述不能为空");
            return;
        }
        await generateWallpaper();
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            {/* 标题区域 */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                    Create Your Perfect Wallpaper
                </h2>
                <p className="text-gray-600">
                    Describe the wallpaper you want to create using AI
                </p>
            </div>

            {/* 输入区域 */}
            <div className="bg-white rounded-2xl shadow-lg p-4">
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe the wallpaper you want to create..."
                        className="flex-1 p-3 text-gray-700 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    
                    <button
                        onClick={handleSubmit} // 添加点击事件处理函数
                        disabled={isGenerating || !prompt.trim()}
                        className={`px-6 py-3 rounded-xl font-medium text-white whitespace-nowrap transition-all
                            ${isGenerating || !prompt.trim() 
                                ? 'bg-gray-300 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90'
                            }`}
                    >
                        {isGenerating ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                                Generating...
                            </span>
                        ) : (
                            'Generate'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}