<script setup lang="ts">
defineProps<{
  tabText: string;
  tabCount: number;
}>();
</script>

<template>
  <div class="header">
    <div class="tab">
      {{ tabText }}
      <span class="tab-count">{{ tabCount }}</span>
    </div>
    <div class="buttons">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.header {
  background: #292929;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: 12px 12px 0 0;
}
.tab {
  padding: 10px 6px 15px;
  border-bottom: 2px solid #71aaeb;
  margin-left: 10px;
}
@media (max-width: 550px) {
  .tab {
    display: none;
  }
  .buttons {
    padding: 5px;
  }
  .header {
    justify-content: center;
  }
}
.tab-count {
  padding-left: 6px;
  font-size: 13px;
  color: #aaaaaa;
}
.buttons {
  margin-right: 10px;
}
</style>
