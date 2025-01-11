<template>
  <div class="ai-knowledge">
    <h2>AI 技术前沿</h2>
    <div class="knowledge-grid">
      <div class="knowledge-card" v-for="article in articles" :key="article.id">
        <div class="card-header">
          <span class="tag">{{ article.tag }}</span>
          <span class="date">{{ article.date }}</span>
        </div>
        <h3>{{ article.title }}</h3>
        <p>{{ article.summary }}</p>
        <a href="#" class="read-more">阅读更多</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AiKnowledge',
  data() {
    return {
      articles: [
        {
          id: 1,
          tag: 'Gemini',
          date: '2024-01-10',
          title: 'Google发布Gemini Ultra：超越GPT-4的新一代AI模型',
          summary: 'Google正式发布Gemini Ultra模型，在多个基准测试中超越GPT-4，展现出强大的多模态理解能力...'
        },
        {
          id: 2,
          tag: 'DeepSeek',
          date: '2024-01-09',
          title: 'DeepSeek发布67B代码生成模型',
          summary: 'DeepSeek推出新一代代码生成模型，在代码理解和生成方面展现出卓越性能...'
        },
        // 更多文章...
      ]
    }
  }
}
</script>

<style scoped>
.ai-knowledge {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.knowledge-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.knowledge-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.tag {
  background: #4CAF50;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.date {
  color: #666;
  font-size: 12px;
}

h3 {
  margin: 10px 0;
  color: #333;
}

.read-more {
  display: inline-block;
  margin-top: 10px;
  color: #4CAF50;
  text-decoration: none;
}

.read-more:hover {
  text-decoration: underline;
}
</style> 