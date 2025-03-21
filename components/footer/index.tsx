"use client";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* 品牌区域 */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            AI Wallpaper
                        </h3>
                        <p className="text-gray-500 text-sm">
                            Creating beautiful wallpapers with artificial intelligence
                        </p>
                    </div>

                    {/* 快速链接 */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><a href="/" className="text-gray-500 hover:text-gray-900 text-sm">Home</a></li>
                            <li><a href="/gallery" className="text-gray-500 hover:text-gray-900 text-sm">Gallery</a></li>
                            <li><a href="/about" className="text-gray-500 hover:text-gray-900 text-sm">About</a></li>
                        </ul>
                    </div>

                    {/* 联系方式 */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Contact</h4>
                        <ul className="space-y-2">
                            <li className="text-gray-500 text-sm">Email: contact@example.com</li>
                            <li className="text-gray-500 text-sm">Twitter: @aiwallpaper</li>
                        </ul>
                    </div>

                    {/* 技术支持 */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Powered By</h4>
                        <ul className="space-y-2">
                            <li className="text-gray-500 text-sm">OpenAI DALL·E 3</li>
                            <li className="text-gray-500 text-sm">Next.js</li>
                            <li className="text-gray-500 text-sm">Tailwind CSS</li>
                        </ul>
                    </div>
                </div>

                {/* 版权信息 */}
                <div className="mt-12 pt-8 border-t border-gray-100">
                    <p className="text-center text-gray-400 text-sm">
                        © {new Date().getFullYear()} AI Wallpaper Generator. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}