<template>
  <div>
    <h2>文章列表</h2>
    <ul>
      <PostItem v-for="post in posts" :key="post.id" :post="post" />
    </ul>
  </div>
</template>

<script>
import PostItem from './PostItem.vue';

export default {
  name: 'PostList',
  components: {
    PostItem,
  },
  data() {
    return {
      posts: [
        { id: 1, title: '第一篇文章', content: '这是第一篇文章的内容...' },
        { id: 2, title: '第二篇文章', content: '这是第二篇文章的内容...' },
        // ... 更多文章
      ],
    };
  },
};
</script> 