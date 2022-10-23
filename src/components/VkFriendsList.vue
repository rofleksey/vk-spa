<script setup lang="ts">
import type { Friend } from "@/lib/types";
import VkAvatar from "@/components/VkAvatar.vue";
import { useRouter } from "vue-router";

interface Props {
  friends: Friend[];
  sticky?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  sticky: false,
});

const router = useRouter();

function openWall(id: number) {
  router.push({
    path: "/wall",
    query: { userId: id },
  });
}
</script>

<template>
  <div :class="{ list: true, sticky: props.sticky }">
    <div class="header">В друзьях у:</div>
    <div class="content">
      <div
        v-for="friend in props.friends"
        :key="friend.id"
        class="friend"
        @click="() => openWall(friend.id)"
      >
        <VkAvatar :icon="friend.icon" medium />
        <div class="name">
          {{ friend.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list {
  align-self: flex-start;
  width: 345px;
  padding: 10px;
  background: #222222;
  border-radius: 12px;
  margin: 16px;
  border: 1px solid rgba(255, 255, 255, 0.24);
}
.sticky {
  position: sticky;
  top: 5px;
}
.header {
  margin-bottom: 10px;
}
.content {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.friend {
  width: 80px;
  transition: background-color 0.15s ease-out;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 12px;
  padding: 5px;
}
.friend:hover {
  background-color: #ffffff33;
}
.name {
  margin-top: 5px;
  font-size: 12px;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
