<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { Ref, ComputedRef } from "vue";
import type { Friend, User } from "@/lib/types";
import {
  useTokenStore,
  useSelectedUsersStore,
  useResultStore,
} from "@/stores/store";
import { useRoute } from "vue-router";
import VkProfileHeader from "@/components/VkProfileHeader.vue";
import type { VkUser } from "@/lib/vk";
import { getUser } from "@/lib/vk";
import VkWall from "@/components/VkWall.vue";
import VkFriendsList from "@/components/VkFriendsList.vue";

const route = useRoute();
const userId = computed(() => Number(route.query.userId));

const tokenStore = useTokenStore();
const resultStore = useResultStore();
const selectedUsersStore = useSelectedUsersStore();
const selectedUsersMap: ComputedRef<Map<number, User>> = computed(() => {
  const map = new Map<number, User>();
  selectedUsersStore.userList.forEach((user) => {
    map.set(user.id, user);
  });
  return map;
});

const token = computed(() => tokenStore.token);

const vkUser: Ref<VkUser | null> = ref(null);
const resultUser: ComputedRef<User | undefined> = computed(() =>
  resultStore.result.find((user) => user.id === userId.value)
);
const friendOf: ComputedRef<Friend[] | undefined> = computed(() => {
  if (!resultUser.value) {
    return undefined;
  }
  return resultUser.value!!.friendOf!!.map((id) => {
    const user = selectedUsersMap.value.get(id)!!;
    return {
      id: user.id,
      name: user.firstName,
      icon: user.icon,
    };
  });
});

function fetchUserInfo() {
  getUser(userId.value, token.value!!)
    .then((user) => {
      vkUser.value = user;
    })
    .catch((e) => console.error(e));
}

onMounted(() => {
  fetchUserInfo();
});
</script>

<template>
  <div class="outer">
    <VkProfileHeader :vk-user="vkUser" />
    <div class="content">
      <div class="wall-container">
        <VkFriendsList
          class="list-inside"
          v-if="friendOf !== undefined"
          :friends="friendOf"
        />
        <VkWall v-if="vkUser" :user-id="vkUser?.id" />
      </div>
      <VkFriendsList
        class="list-outside"
        v-if="friendOf !== undefined"
        :friends="friendOf"
        sticky
      />
    </div>
  </div>
</template>

<style scoped>
.outer {
  max-width: 911px;
  min-width: 400px;
  margin: 10px auto;
  display: flex;
  flex-direction: column;
}
.list-inside {
  display: none;
  margin-left: auto;
  margin-right: auto;
}
@media (max-width: 920px) {
  .list-inside {
    display: block;
  }

  .list-outside {
    display: none;
  }
}
.content {
  display: flex;
  flex-direction: row;
}
.wall-container {
  flex-grow: 1;
  max-width: 550px;
}
</style>
