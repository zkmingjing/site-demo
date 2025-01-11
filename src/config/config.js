export const AI_CONFIG = {
  // Gemini 配置
  gemini: {
    apiKey: 'AIzaSyCaYmEJxm-rFW0DwsEkd_nB3TwyanGMLhg', // 替换为实际的 API key
    model: 'gemini-pro', // 更新为正确的模型名称
    baseURL: 'https://gemini-api.zkvip.net.cn/v1beta/models',
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 2048,
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
      }
    ],
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': 'AIzaSyCaYmEJxm-rFW0DwsEkd_nB3TwyanGMLhg' // 替换为实际的 API key
    }
  },

  // DeepSeek 配置
  deepseek: {
    apiKey: 'YOUR_DEEPSEEK_API_KEY', // 替换为实际的 API key
    model: 'deepseek-chat', // 模型名称
    baseURL: 'https://api.deepseek.com/v1',
    temperature: 0.7,
    maxTokens: 2000,
    topP: 0.95,
    frequencyPenalty: 0,
    presencePenalty: 0,
    stop: null,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_DEEPSEEK_API_KEY' // 替换为实际的 API key
    }
  },

  // 通用配置
  common: {
    streamMode: true, // 是否使用流式响应
    timeout: 30000, // 请求超时时间（毫秒）
    retryTimes: 3, // 请求失败重试次数
    contextLength: 10, // 保留的上下文消息数量
  },

  // 开发环境配置
  development: {
    debug: true, // 是否开启调试模式
    mockResponse: false, // 是否使用模拟响应
  },

  // 生产环境配置
  production: {
    debug: false,
    mockResponse: false,
  }
};

// API 端点配置
export const API_ENDPOINTS = {
  gemini: {
    chat: '/chat/completions',
    complete: '/completions',
    embed: '/embeddings'
  },
  deepseek: {
    chat: '/chat/completions',
    complete: '/completions',
    embed: '/embeddings'
  }
};

// 错误消息配置
export const ERROR_MESSAGES = {
  API_KEY_MISSING: '请配置 API Key',
  NETWORK_ERROR: '网络连接错误，请检查网络设置',
  TIMEOUT_ERROR: '请求超时，请稍后重试',
  RATE_LIMIT: '请求频率超限，请稍后重试',
  SERVER_ERROR: '服务器错误，请稍后重试',
  INVALID_RESPONSE: '无效的响应数据',
  TOKEN_LIMIT: '输入内容超出最大长度限制'
};

// 提示语配置
export const PROMPT_TEMPLATES = {
  systemPrompt: {
    gemini: '你是一个由 Google 开发的 AI 助手 Gemini，请尽可能准确、有帮助地回答用户的问题。',
    deepseek: '你是一个由 DeepSeek 开发的 AI 助手，专注于提供专业、准确的回答。'
  },
  errorPrompt: '抱歉，我现在无法回答这个问题。请稍后再试或换个问题。',
  greetingPrompt: '你好！我是 AI 助手，有什么我可以帮你的吗？',
  contextLimitPrompt: '对话内容较长，已清除部分历史记录。'
};

// 环境变量配置
export const ENV_CONFIG = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  apiKeys: {
    gemini: process.env.VUE_APP_GEMINI_API_KEY,
    deepseek: process.env.VUE_APP_DEEPSEEK_API_KEY
  }
};

// 导出默认配置
export default {
  AI_CONFIG,
  API_ENDPOINTS,
  ERROR_MESSAGES,
  PROMPT_TEMPLATES,
  ENV_CONFIG
}; 