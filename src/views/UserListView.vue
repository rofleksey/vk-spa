<script setup lang="ts">
import { computed, onMounted, ref, toRaw, watch } from "vue";
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
import { useResultStore, useSelectedUsersStore } from "@/stores/store";
import { useRouter } from "vue-router";
import ProcessingModal from "@/components/ProcessingModal.vue";
import { processUsers } from "@/lib/process";
import { loadAccessToken } from "@/lib/localstorage";

const router = useRouter();

const searchText = ref("");
const processing = ref(false);

const selectedUsersStore = useSelectedUsersStore();
const users: ComputedRef<User[]> = computed(() => selectedUsersStore.userList);

const resultStore = useResultStore();

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

onMounted(() => {
  triggerSearch();
});

function gotoAddUsers() {
  router.push("/add");
}

function startProcessing() {
  if (users.value.length < 2) {
    console.error("!");
    return;
  }
  processing.value = true;
  processUsers(
    users.value.map((user) => user.id),
    loadAccessToken()!!
  )
    .then((res) => {
      resultStore.setResult(res);
      router.push("/result");
    })
    .catch((e) => console.error(e))
    .finally(() => {
      processing.value = false;
    });
}
</script>

<template>
  <div class="outer">
    <ProcessingModal :open="processing" />
    <VkHeader tab-text="Список пользователей" :tab-count="users.length">
      <VkButton text="Добавить пользователей" @click="gotoAddUsers" />
      <VkButton
        text="Построить"
        :black="users.length < 2"
        @click="startProcessing"
      />
    </VkHeader>
    <VkHorLine />
    <VkSearchBar hint="Поиск по списку" v-model="searchText" />
    <VkHorLine />
    <div class="list-container">
      <UserList
        :users="virtualUsers"
        can-delete
        @delete="(u) => selectedUsersStore.removeUser(u.id)"
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
