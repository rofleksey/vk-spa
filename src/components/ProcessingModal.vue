<script setup lang="ts">
import LoadingGif from "../assets/loading.gif";

interface Props {
  open: boolean;
}

defineProps<Props>();
</script>

<template>
  <Transition name="fade">
    <div v-if="open" class="dialog-wrapper">
      <div class="dialog">
        <img :src="LoadingGif" alt="loading..." rel="preload" />
        <div class="text">
          Мы обрабатываем ваш запрос, пожалуйста, подождите...
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.dialog-wrapper {
  z-index: 100;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  margin: 0;
}
.dialog {
  width: 300px;
  flex: none;
  padding: 1rem;
  background: #1c1f22;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
}

.dialog > * {
  margin: 20px;
  text-align: center;
}
</style>
