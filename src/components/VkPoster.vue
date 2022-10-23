<script setup lang="ts">
import { ref, watch } from "vue";
// @ts-ignore
import computePalette from "get-rgba-palette";
import { getImagePixels } from "@/lib/image";

interface Props {
  icon?: string;
}

const props = defineProps<Props>();
const style = ref({});

watch(
  () => props.icon,
  () => {
    if (!props.icon) {
      style.value = {};
      return;
    }
    getImagePixels(props.icon)
      .then((pixels) => {
        const palette = computePalette(pixels);
        const firstColor = palette[0];
        style.value = {
          "--gradient-color": `rgb(${firstColor[0]}, ${firstColor[1]}, ${firstColor[2]})`,
        };
      })
      .catch((e) => {
        console.error(e);
      });
  }
);
</script>

<template>
  <div class="poster" :style="style" />
</template>

<style scoped>
.poster {
  height: 100px;
  background-color: #222222;
  --gradient-color: #333333;
  background-image: linear-gradient(
      180deg,
      transparent 0%,
      var(--gradient-color) 100%
    ),
    linear-gradient(270deg, transparent 0%, var(--gradient-color) 100%);
  border-radius: 12px 12px 0 0;
}
</style>
