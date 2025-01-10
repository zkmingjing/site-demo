<template>
  <li>
    <router-link :to="{ name: 'post', params: { id: post.id } }">
      {{ post.title }}
    </router-link>
  </li>
</template>

<script>
export default {
  name: 'PostItem',
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
};
</script> 