<script setup lang="ts">
import VkAvatar from "@/components/VkAvatar.vue";
import VkPoster from "@/components/VkPoster.vue";
import type { VkUser } from "@/lib/vk";
import { computed } from "vue";
import { getDescription } from "@/lib/util";

interface Props {
  vkUser?: VkUser | null;
}

const props = defineProps<Props>();

const details = computed(() =>
  props.vkUser ? getDescription(props.vkUser) : ""
);
</script>

<template>
  <div class="container">
    <VkPoster :icon="props.vkUser?.photo_200" />
    <div class="footer">
      <div class="avatar-container">
        <VkAvatar
          v-if="props.vkUser !== null"
          :icon="props.vkUser?.photo_200"
          big
        />
      </div>
      <div class="info">
        <div class="name">
          {{
            props.vkUser
              ? `${props.vkUser?.first_name} ${props.vkUser?.last_name}`
              : "Loading..."
          }}
        </div>
        <div class="details">{{ details }}</div>
        <div class="status">
          {{ vkUser?.status }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  background-color: #222222;
  border-radius: 12px;
  position: relative;
}

.avatar-container {
  position: absolute;
  top: 50px;
  left: 15px;
}

.footer {
  padding: 10px;
}

.info {
  display: flex;
  flex-direction: column;
  margin: 25px;
  margin-left: 175px;
}

.name {
  font-size: 25px;
  font-weight: 900;
  margin-bottom: 8px;
}

.details {
  margin-bottom: 8px;
}

.details,
.status {
  color: #939393;
}

.status:empty::before,
.details:empty::before {
  content: "";
  display: inline-block;
}
</style>
