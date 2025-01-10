<template>
  <div class="post">
    <h2>{{ post.title }}</h2>
    <div v-html="content"></div>
  </div>
</template>

<script>
import axios from 'axios';
import MarkdownIt from 'markdown-it';

export default {
  name: 'Post',
  data() {
    return {
      post: {},
      md: new MarkdownIt(),
    };
  },
  async created() {
    const postId = this.$route.params.id;
    // 假设您有一个 API 端点可以根据 ID 获取文章
    const response = await axios.get(`/api/posts/${postId}`);
    this.post = response.data;
  },
  computed: {
    content() {
      return this.md.render(this.post.content || '');
    },
  },
};
</script> 