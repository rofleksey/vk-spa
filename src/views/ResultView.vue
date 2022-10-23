<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, toRaw, watch } from "vue";
import VkHeader from "../components/VkHeader.vue";
import VkHorLine from "../components/VkHorLine.vue";
import VkButton from "../components/VkButton.vue";
import VkSearchBar from "../components/VkSearchBar.vue";
import type { Ref, ComputedRef } from "vue";
import UserList from "@/components/UserList.vue";
import type { User, VirtualUser } from "@/lib/types";
import Fuse from "fuse.js";
// @ts-ignore
import debounce from "debounce";
import { useResultStore, useTokenStore } from "@/stores/store";
import PQueue from "p-queue";
import { getFriendsCount } from "@/lib/vk";
import { useRouter } from "vue-router";

interface UserWithIndex {
  index: number;
  user: User;
}

const router = useRouter();

const queue = new PQueue({
  concurrency: 3,
  timeout: 10000,
  throwOnTimeout: true,
  intervalCap: 1,
  carryoverConcurrencyCount: true,
  interval: 333,
});

const searchText = ref("");

const loadingFriends = ref(false);
const tokenStore = useTokenStore();
const token = computed(() => tokenStore.token);

const resultStore = useResultStore();
const users: ComputedRef<User[]> = computed(() => resultStore.result);

const minFriendsCount = computed(() =>
  users.value.reduce(
    (a, b) => Math.min(a, b.friendOf!!.length),
    Number.MAX_SAFE_INTEGER
  )
);

const maxFriendsCount = computed(() =>
  users.value.reduce(
    (a, b) => Math.max(a, b.friendOf!!.length),
    Number.MIN_SAFE_INTEGER
  )
);

const virtualUsers: Ref<VirtualUser[]> = ref([]);

const fuse = computed(
  () =>
    new Fuse(users.value ?? [], {
      keys: [
        {
          name: "name",
          weight: 1,
        },
        {
          name: "username",
          weight: 0.75,
        },
        {
          name: "id",
          weight: 0.2,
        },
      ],
    })
);

function triggerSearch() {
  const searchResults =
    searchText.value.length === 0
      ? users.value
      : fuse.value.search(searchText.value).map((res) => res.item);
  virtualUsers.value = searchResults.map((user) => ({
    id: user.id,
    value: toRaw(user), // TODO: delete toRaw?
    selected: true,
  }));
}

const searchDebounce = debounce(triggerSearch, 250);

watch(searchText, searchDebounce);
watch(users, triggerSearch, {
  deep: true,
});

function startFriendCountsProcessing() {
  const pending: UserWithIndex[] = users.value
    .map((user, index) => ({
      index,
      user,
    }))
    .filter((item) => !item.user.description2);
  if (pending.length === 0) {
    return;
  }
  let counter = 0;
  loadingFriends.value = true;
  pending.forEach((item) => {
    queue
      .add(() => getFriendsCount(item.user.id, token.value!!))
      .then((friendsCount) => {
        resultStore.setDescription2(item.index, `${friendsCount} друзей`);
      })
      .catch((e) => console.error(e))
      .finally(() => {
        if (pending.length === ++counter) {
          loadingFriends.value = false;
        }
      });
  });
}

onMounted(() => {
  if (users.value.length === 0) {
    router.replace({ path: "/list" });
    return;
  }
  startFriendCountsProcessing();
  triggerSearch();
});

onUnmounted(() => {
  queue.clear();
});
</script>

<template>
  <div class="outer">
    <VkHeader tab-text="Результат" :tab-count="users.length">
      <VkButton text="Назад" @click="() => router.back()" />
    </VkHeader>
    <VkHorLine />
    <VkSearchBar
      hint="Поиск по списку"
      v-model="searchText"
      :spinner="loadingFriends"
    />
    <VkHorLine />
    <div class="list-container">
      <UserList
        :users="virtualUsers"
        :min-friends-count="minFriendsCount"
        :max-friends-count="maxFriendsCount"
      />
    </div>
  </div>
</template>

<style scoped>
.outer {
  max-width: 800px;
  min-width: 400px;
  height: calc(100vh - 70px);
  height: calc(var(--vh, 1vh) * 100 - 70px);
  overflow-y: auto;
  margin: 0 auto;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
}

.list-container {
  flex: 1;
  overflow-y: auto;
}
</style>
