<script setup lang="ts">
import VkAvatar from "./VkAvatar.vue";
import interpolateColor from "color-interpolate";
import { computed } from "vue";

interface Props {
  icon: string;
  name: string;
  highlightAlpha?: number | null;
  description?: string;
  description2?: string;
}

const colorInterpolator = interpolateColor(["#222222", "#346297"]);

const props = withDefaults(defineProps<Props>(), {
  highlightAlpha: null,
});

const bgStyle = computed(() => {
  if (props.highlightAlpha === null) {
    return {};
  }
  return {
    backgroundColor: colorInterpolator(props.highlightAlpha),
  };
});

const emit = defineEmits<{
  (e: "select"): void;
}>();
</script>

<template>
  <div class="user" :style="bgStyle">
    <div class="avatar-container">
      <VkAvatar :icon="props.icon" />
    </div>
    <div class="info">
      <div class="name" @click="() => emit('select')">
        {{ props.name }}
      </div>
      <div class="description" v-if="props.description">
        {{ props.description }}
      </div>
      <div class="description2" v-if="props.description2">
        {{ props.description2 }}
      </div>
    </div>
    <div class="separator" />
    <div class="actions">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.user {
  width: 100%;
  padding: 12px 0;
  display: flex;
  flex-direction: row;
  justify-content: start;
  height: 107px;
}
.avatar-container {
  padding-left: 5px;
}
.info {
  margin-left: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.name {
  font-weight: 700;
  font-size: 13px;
  color: #e1e3e6;
  margin-bottom: 9px;
  word-wrap: break-word;
  cursor: pointer;
}
.name:hover {
  text-decoration: underline;
}
.description,
.description2 {
  color: #939393;
  word-wrap: break-word;
  font-size: 12px;
}
.description2 {
  margin-top: 9px;
}
.separator {
  flex: 1;
}
.actions {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
