<script setup lang="ts">
import { RouterView, useRouter } from "vue-router";
// @ts-ignore
import WAVES from "vanta/dist/vanta.waves.min";
import { onMounted, onUnmounted, ref } from "vue";

const bgRef = ref(null);
let vantaRef: any = null;

const router = useRouter();

function updateVhVar() {
  const doc = document.documentElement;
  doc.style.setProperty("--vh", window.innerHeight * 0.01 + "px");
}

onMounted(() => {
  vantaRef = WAVES({
    el: bgRef.value,
    mouseControls: false,
    touchControls: false,
    gyroControls: false,
    color: "#292929",
  });
  window.addEventListener("resize", updateVhVar);
  updateVhVar();
});

onUnmounted(() => {
  if (vantaRef) {
    vantaRef.destroy();
  }
  window.removeEventListener("resize", updateVhVar);
});

function openBugTracker() {
  window
    ?.open("https://github.com/rofleksey/vk-spa/issues/new", "_blank")
    ?.focus();
}
</script>

<template>
  <header>
    <div class="logo-container" @click="() => router.push('/')">
      <img
        alt="logo"
        class="logo"
        src="@/assets/logo.png"
        width="24"
        height="24"
      />
      <div class="header-title">Vk-SPA</div>
    </div>
    <img
      alt="bug"
      class="bug"
      src="@/assets/bug.png"
      width="24"
      height="24"
      @click="openBugTracker"
    />
  </header>

  <div class="bg" ref="bgRef" />

  <main>
    <RouterView v-slot="{ Component, route }">
      <Transition name="fade" mode="out-in">
        <keep-alive include="UserListView">
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
      </Transition>
    </RouterView>
  </main>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.12s ease, transform 0.12s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.bg {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: -1000;
}

header {
  background-color: #222222;
  height: 48px;
  width: 100%;
  z-index: 1000;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.header-title {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.logo-container:hover .header-title {
  text-decoration: underline;
}

.bug {
  margin-right: 1em;
  opacity: 0.25;
  transition: opacity 0.15s ease;
  cursor: pointer;
}

.bug:hover {
  opacity: 1;
}

main {
  position: relative;
  max-height: calc(100vh - 48px);
  max-height: calc(var(--vh, 1vh) * 100 - 48px);
  overflow-y: auto;
  scrollbar-gutter: stable;
}

@media (max-width: 800px) {
  header {
    display: none;
  }

  main {
    max-height: 100vh;
    max-height: calc(var(--vh, 1vh) * 100);
    scrollbar-gutter: auto;
  }
}

.logo-container {
  display: flex;
  text-align: left;
  font-size: 16px;
  font-family: monospace;
  margin-left: 1em;
}

.header-title {
  margin-left: 0.5em;
}
</style>
