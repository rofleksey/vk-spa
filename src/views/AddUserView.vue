<script setup lang="ts">
import type { ComputedRef, Ref } from "vue";
import { computed, ref, toRaw, watch } from "vue";
import VkHeader from "../components/VkHeader.vue";
import VkButton from "../components/VkButton.vue";
import VkHorLine from "../components/VkHorLine.vue";
import VkSearchBar from "../components/VkSearchBar.vue";
import UserList from "@/components/UserList.vue";
import type { User, VirtualUser } from "@/lib/types";
import type { VkUser } from "@/lib/vk";
// @ts-ignore
import debounce from "debounce";
import { useTokenStore, useSelectedUsersStore } from "@/stores/store";
import { getUser, searchUsers } from "@/lib/vk";
import { useRouter } from "vue-router";

const numberRegex = /^\d+$/;

const router = useRouter();

const tokenStore = useTokenStore();
const token = computed(() => tokenStore.token);

const selectedUsersStore = useSelectedUsersStore();
const selectedUsersSet: ComputedRef<Set<number>> = computed(() => {
  const set = new Set<number>();
  selectedUsersStore.userList.forEach((user) => {
    set.add(user.id);
  });
  return set;
});

const searchText = ref("");
const loading = ref(false);
const count = ref(0);
const nextPage = ref(0);
const users: Ref<User[]> = ref([]);
const virtualUsers: ComputedRef<VirtualUser[]> = computed(() => {
  return users.value.map((user) => ({
    id: user.id,
    value: toRaw(user), // TODO: delete toRaw?
    selected: selectedUsersSet.value.has(user.id),
  }));
});

function vkUserToUser(vkUser: VkUser): User {
  return {
    id: vkUser.id,
    icon: vkUser.photo_200!!,
    name: `${vkUser.first_name} ${vkUser.last_name}`,
    firstName: vkUser.first_name,
    username: vkUser.screen_name!!,
    description: vkUser.screen_name!!,
  };
}

function fetchUsers(clear: boolean) {
  if (nextPage.value === -1) {
    return;
  }
  const trimmed = searchText.value.trim();
  if (numberRegex.test(trimmed)) {
    loading.value = true;
    getUser(Number(trimmed), token.value!!)
      .then((user) => {
        users.value = [];
        nextPage.value = -1;
        count.value = 1;
        users.value = [vkUserToUser(user)];
      })
      .catch((e) => {
        console.error(e);
        users.value = [];
        nextPage.value = -1;
      })
      .finally(() => {
        loading.value = false;
      });
    return;
  }
  loading.value = true;
  searchUsers(trimmed, nextPage.value, token.value!!)
    .then((vkUsers) => {
      if (vkUsers.items.length === 0) {
        nextPage.value = -1;
        return;
      }
      if (clear) {
        users.value = [];
      }
      const newUsers = vkUsers.items.map(vkUserToUser);
      users.value.push(...newUsers);
      count.value = vkUsers.count;
      nextPage.value += 1;
    })
    .catch((e) => console.error(e))
    .finally(() => {
      loading.value = false;
    });
}

function triggerSearch() {
  nextPage.value = 0;
  fetchUsers(true);
}

function onEnter() {
  if (users.value.length === 0) {
    return;
  }
  const firstUser = users.value[0];
  if (!selectedUsersSet.value.has(firstUser.id)) {
    selectedUsersStore.addUser(users.value[0]);
  }
}

function onEscape() {
  router.back();
}

const searchDebounce = debounce(triggerSearch, 333);

watch(searchText, searchDebounce);
</script>

<template>
  <div class="outer" @keyup.enter="onEnter" @keyup.esc="onEscape">
    <VkHeader tab-text="Поиск" :tab-count="count">
      <VkButton text="Назад" @click="() => router.back()" />
    </VkHeader>
    <VkHorLine />
    <VkSearchBar
      autofocus
      hint="Поиск новых пользователей"
      :spinner="loading"
      v-model="searchText"
    />
    <VkHorLine />
    <div class="list-container">
      <UserList
        :users="virtualUsers"
        can-add
        can-delete
        @delete="(u) => selectedUsersStore.removeUser(u.id)"
        @add="(u) => selectedUsersStore.addUser(u)"
        @eol="() => fetchUsers(false)"
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
