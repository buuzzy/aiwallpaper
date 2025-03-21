import OpenAI from "openai";

export function getOpenAIClient(): OpenAI {
    return new OpenAI({
        apiKey: "sk-ZDjyPa3L3I8q39GejNEUVTnWZ3tuSt0iA8TpEEVncvNFReLE",
        baseURL: "https://xiaoai.plus/v1"
    });
}

{/* 创建 /service 目录以及目录下的 /openai.ts 文件，是通过模块化的方式进行编程。
    实际上，对 openai 图像生成接口的请求页可以直接写在其他文件中，但会过于杂乱
    */}



