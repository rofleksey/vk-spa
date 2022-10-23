<script setup lang="ts">
interface Props {
  icon: string | undefined;
  big?: boolean;
  medium?: boolean;
  small?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  big: false,
  medium: false,
  small: false,
});
</script>

<template>
  <img
    :src="props.icon"
    :key="props.icon"
    :class="{ big: props.big, small: props.small, medium: props.medium }"
    alt="avatar"
  />
</template>

<style scoped>
img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  box-sizing: content-box; /* somehow removes whitish border effect */
}
.big {
  width: 150px;
  height: 150px;
}
.medium {
  width: 64px;
  height: 64px;
}
.small {
  width: 50px;
  height: 50px;
}
</style>
