"use client";

import Footer from "@/components/footer";
import Header from "@/components/header";
import Wallpapers from "@/components/wallpapers";
import Input from "@/components/input";
import { useState } from "react";
import { Wallpaper } from "@/types/wallpaper";

export default function Home() {
  // 移除不必要的 state，因为我们使用了 Context
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Input />
        <Wallpapers />
      </main>
      <Footer />
    </div>
  )
}

