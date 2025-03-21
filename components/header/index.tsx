"use client";

import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export default function Header() {
    return (
        <header className="relative w-full bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo 部分 */}
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            AI Wallpaper
                        </h1>
                    </div>

                    {/* 用户认证按钮 */}
                    <div className="flex items-center space-x-4">
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    登录
                                </button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                                    注册
                                </button>
                            </SignUpButton>
                        </SignedOut>
                        <SignedIn>
                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>
                    </div>
                </div>
            </div>
        </header>
    );
}