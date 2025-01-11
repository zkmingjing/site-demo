<template>
  <div class="ai-chat">
    <div class="chat-header">
      <h2>AI 助手对话</h2>
      <select v-model="selectedModel" class="model-select">
        <option value="gemini">Gemini</option>
        <option value="deepseek">DeepSeek</option>
      </select>
    </div>
    
    <div class="chat-messages" ref="chatMessages">
      <div v-for="(message, index) in messages" 
           :key="index" 
           :class="['message', message.role]">
        <div class="message-content">
          {{ message.content }}
          <span v-if="isLoading && index === messages.length - 1" 
                class="loading-indicator">...</span>
        </div>
      </div>
    </div>

    <div class="chat-input">
      <textarea 
        v-model="userInput"
        @keyup.enter.prevent="sendMessage"
        :disabled="isLoading"
        placeholder="输入您的问题..."
        rows="3"
      ></textarea>
      <button 
        @click="sendMessage" 
        :disabled="!userInput.trim() || isLoading">
        {{ isLoading ? '发送中...' : '发送' }}
      </button>
    </div>
  </div>
</template>

<script>
import AiService from '@/services/aiService';
import { PROMPT_TEMPLATES } from '@/config/config';

export default {
  name: 'AiChat',
  data() {
    return {
      selectedModel: 'gemini',
      userInput: '',
      messages: [
        {
          role: 'assistant',
          content: PROMPT_TEMPLATES.greetingPrompt
        }
      ],
      isLoading: false,
      aiService: null
    };
  },
  watch: {
    selectedModel: {
      immediate: true,
      handler(newModel) {
        this.aiService = new AiService(newModel);
      }
    }
  },
  methods: {
    async sendMessage() {
      if (!this.userInput.trim() || this.isLoading) return;

      const userMessage = this.userInput.trim();
      this.messages.push({
        role: 'user',
        content: userMessage
      });

      this.userInput = '';
      this.isLoading = true;

      try {
        // 获取上下文消息（最近的几条）
        const context = this.messages.slice(-5).map(msg => ({
          role: msg.role,
          content: msg.content
        }));

        const response = await this.aiService.sendMessage(userMessage, context);
        
        this.messages.push(response);
      } catch (error) {
        console.error('Chat Error:', error);
        this.messages.push({
          role: 'assistant',
          content: error.message || PROMPT_TEMPLATES.errorPrompt
        });
      } finally {
        this.isLoading = false;
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },
    scrollToBottom() {
      const chatMessages = this.$refs.chatMessages;
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }
};
</script>

<style scoped>
.ai-chat {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  height: 600px;
  display: flex;
  flex-direction: column;
  margin: 20px;
}

.chat-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.model-select {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.message {
  margin-bottom: 20px;
  max-width: 80%;
}

.message.user {
  margin-left: auto;
}

.message-content {
  padding: 12px;
  border-radius: 8px;
  background: #f5f5f5;
}

.message.user .message-content {
  background: #4CAF50;
  color: white;
}

.chat-input {
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
}

textarea {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: none;
}

button {
  padding: 10px 20px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.message.loading {
  opacity: 0.6;
}

.loading-indicator {
  display: inline-block;
  margin-left: 8px;
  animation: bounce 0.8s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
</style> 