<script setup lang="ts">
interface Props {
  text: string;
  black?: boolean;
  class?: any; // TODO: delete?
}

const props = withDefaults(defineProps<Props>(), {
  black: false,
});

const emit = defineEmits<{
  (e: "click"): void;
}>();
</script>

<template>
  <button
    :class="{ black: props.black, ...props.class }"
    @click="emit('click')"
  >
    {{ text }}
  </button>
</template>

<style scoped>
button {
  height: 28px;
  padding: 0 16px;
  color: #222222;
  background-color: #e1e3e6;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: 0;
  margin: 0;
  margin-left: 5px;
  margin-right: 5px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
  font-size: 13px;
  font-family: inherit;
  border-radius: 8px;
  transition: 0.5s background-color ease, 0.5s color linear, 0.15s opacity ease;
}

button.black {
  color: #e1e3e6;
  background-color: #424242;
}

button:hover {
  opacity: 0.85;
  text-decoration: none;
}

button:active {
  opacity: 0.6;
  text-decoration: none;
}
</style>
