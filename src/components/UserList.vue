<script setup lang="ts">
import type { User, VirtualUser } from "@/lib/types";
import UserItem from "@/components/UserItem.vue";
import VkButton from "@/components/VkButton.vue";
import VkHorLine from "@/components/VkHorLine.vue";
import { useRouter } from "vue-router";

const router = useRouter();

interface Props {
  users: VirtualUser[];
  canDelete?: boolean;
  canAdd?: boolean;
  minFriendsCount?: number;
  maxFriendsCount?: number;
}

const props = withDefaults(defineProps<Props>(), {
  canDelete: false,
  canAdd: false,
  highlight: false,
  minFriendsCount: 0,
  maxFriendsCount: 0,
});

const emit = defineEmits<{
  (e: "delete", user: User): void;
  (e: "add", user: User): void;
  (e: "eol"): void;
}>();

function openWall(userId: number) {
  router.push({
    path: "/wall",
    query: { userId },
  });
}
</script>

<template>
  <div v-if="props.users.length === 0" class="list empty">
    <img src="@/assets/binoculars.png" alt="empty list" />
    <div class="empty-text">Список пуст =(</div>
  </div>
  <RecycleScroller
    class="list"
    v-else
    :items="props.users"
    :item-size="108"
    key-field="id"
    v-slot="{ item }"
    @scroll-end="() => emit('eol')"
  >
    <UserItem
      :id="item.value.id"
      :icon="item.value.icon"
      :name="item.value.name"
      :description="item.value.description"
      :description2="item.value.description2"
      :highlight-alpha="
        item.value.friendOf
          ? (item.value.friendOf.length - props.minFriendsCount) /
            (props.maxFriendsCount - props.minFriendsCount)
          : null
      "
      @select="() => openWall(item.value.id)"
    >
      <VkButton
        v-if="canDelete && canAdd"
        :text="item.selected ? 'Удалить' : 'Добавить'"
        :black="item.selected"
        @click="
          () =>
            item.selected ? emit('delete', item.value) : emit('add', item.value)
        "
      />
      <VkButton
        v-else-if="canDelete && item.selected"
        text="Удалить"
        black
        @click="emit('delete', item.value)"
      />
      <VkButton
        v-else-if="canAdd && !item.selected"
        text="Добавить"
        @click="emit('add', item.value)"
      />
    </UserItem>
    <VkHorLine />
  </RecycleScroller>
</template>

<style scoped>
.list {
  height: 100%;
  background-color: #222222;
  padding: 0 20px;
}
.empty {
  padding-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.empty > * {
  margin: 10px;
}
.empty > img {
  opacity: 0.5;
}
.empty-text {
  color: #939393;
}
</style>
