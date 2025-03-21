"use client";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* 品牌区域 - 居中显示 */}
                <div className="text-center space-y-3 mb-12">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        AI Wallpaper
                    </h3>
                    <p className="text-gray-500 text-sm">
                        使用人工智能创建精美壁纸
                    </p>
                </div>

                {/* 版权信息 */}
                <div className="mt-8 pt-8 border-t border-gray-100">
                    <p className="text-center text-gray-400 text-sm">
                        © {new Date().getFullYear()} AI Wallpaper Generator. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}