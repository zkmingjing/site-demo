import axios from 'axios';
import { AI_CONFIG, ERROR_MESSAGES } from '@/config/config';

class AiService {
  constructor(model) {
    this.model = model;
    this.config = AI_CONFIG[model];
  }

  async sendMessage(message, context = []) {
    try {
      const config = this.config;
      
      if (this.model === 'gemini') {
        const contents = [{
          role: 'user',
          parts: [{
            text: message
          }]
        }];

        if (context.length > 0) {
          contents.unshift(...context.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{
              text: msg.content
            }]
          })));
        }

        const response = await axios.post(`${config.baseURL}/${config.model}:generateContent`, {
          contents,
          generationConfig: {
            temperature: config.temperature,
            topK: config.topK,
            topP: config.topP,
            maxOutputTokens: config.maxOutputTokens,
            stopSequences: [],
          },
          safetySettings: config.safetySettings
        }, {
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': config.apiKey
          }
        });

        if (response.data.candidates && response.data.candidates.length > 0) {
          const candidate = response.data.candidates[0];
          
          if (candidate.finishReason === 'SAFETY') {
            throw new Error('内容被安全策略拦截');
          }

          return {
            content: candidate.content.parts[0].text,
            role: 'assistant'
          };
        } else {
          throw new Error('未获得有效响应');
        }
      } 
      else if (this.model === 'deepseek') {
        const response = await axios.post(`${config.baseURL}/chat/completions`, {
          model: config.model,
          messages: [
            ...context,
            { role: "user", content: message }
          ],
          temperature: config.temperature,
          max_tokens: config.maxTokens,
          top_p: config.topP,
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
          }
        });

        return {
          content: response.data.choices[0].message.content,
          role: 'assistant'
        };
      }
    } catch (error) {
      console.error('AI Service Error:', error);
      console.error('Request payload:', error.config?.data);
      console.error('Response:', error.response?.data);
      throw new Error(this.getErrorMessage(error));
    }
  }

  formatContextMessage(message) {
    return {
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [{
        text: message.content
      }]
    };
  }

  getErrorMessage(error) {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          return ERROR_MESSAGES.API_KEY_MISSING;
        case 429:
          return ERROR_MESSAGES.RATE_LIMIT;
        case 500:
          return ERROR_MESSAGES.SERVER_ERROR;
        default:
          return error.response.data?.error?.message || ERROR_MESSAGES.SERVER_ERROR;
      }
    }
    if (error.request) {
      return ERROR_MESSAGES.NETWORK_ERROR;
    }
    return ERROR_MESSAGES.INVALID_RESPONSE;
  }
}

export default AiService; 