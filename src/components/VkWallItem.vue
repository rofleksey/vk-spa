<script setup lang="ts">
import type { WallPost } from "@/lib/types";
import VkAvatar from "@/components/VkAvatar.vue";

interface Props {
  post: WallPost;
  nested?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  nested: false,
});
</script>

<template>
  <div class="post" :class="{ nested: nested }">
    <div class="header">
      <VkAvatar :icon="props.post.posterIcon" small />
      <div class="info">
        <div class="name">{{ props.post.posterName }}</div>
        <div class="date">{{ props.post.date }}</div>
      </div>
    </div>
    <div class="content">
      <div class="text">{{ props.post.text }}</div>
      <div
        v-for="(photo, i) in props.post.photos"
        :key="photo.url"
        class="photo"
      >
        <img
          :src="photo.url"
          :width="photo.width"
          :height="photo.height"
          :alt="`photo #${i + 1}`"
        />
      </div>
      <VkWallItem
        v-for="nestedItem in props.post.nestedItems"
        :key="nestedItem.id"
        :post="nestedItem"
        nested
      />
    </div>
  </div>
</template>

<style scoped>
.post {
  padding-left: 10px;
}
.nested {
  border-left: 2px solid rgba(255, 255, 255, 0.24);
  margin: 10px 0 0 0;
}
.header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.info {
  margin-left: 15px;
}
.name {
  margin-bottom: 3px;
}
.date {
  color: #939393;
  font-size: 12px;
}
.photo {
  margin: 10px 5px 5px 5px;
}
.photo > img {
  width: 100%;
  height: auto;
}
</style>
