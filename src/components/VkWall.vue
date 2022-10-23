<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { Ref } from "vue";
import VkWallItem from "./VkWallItem.vue";
import { getWall } from "@/lib/vk";
import type {
  VkGroupObject,
  VkUser,
  VkWallPost,
  VkWallResponse,
} from "@/lib/vk";
import { useTokenStore } from "@/stores/store";
import dateFormat from "dateformat";
import type { VirtualWallPost, WallPost } from "@/lib/types";
import debounce from "debounce";
import Eye from "../assets/eye.png";
import List from "../assets/list.png";

interface Props {
  userId: number;
}

const props = defineProps<Props>();
const showWall = ref(false);
const isPrivate = ref(false);
const isEmpty = ref(false);

const tokenStore = useTokenStore();
const token = computed(() => tokenStore.token);

let nextPage = 0;
const posts: Ref<VirtualWallPost[]> = ref([]);

function vkPostToPost(
  post: VkWallPost,
  profileMap: Map<number, VkUser>,
  groupMap: Map<number, VkGroupObject>
): WallPost {
  let posterName = "";
  let posterIcon = "";
  if (profileMap.has(post.from_id)) {
    const profile = profileMap.get(post.from_id)!!;
    posterName = `${profile.first_name} ${profile.last_name}`;
    posterIcon = profile.photo_50!!;
  } else if (groupMap.has(-post.from_id)) {
    const group = groupMap.get(-post.from_id)!!;
    posterName = group.name;
    posterIcon = group.photo_50!!;
  }
  const photos =
    post.attachments
      ?.filter((a) => a.photo)
      ?.map((a) => {
        const bestSize = a.photo!!.sizes.reduce((acc, size) => {
          if (acc.width < size.width) {
            return size;
          }
          return acc;
        });
        return {
          width: bestSize.width,
          height: bestSize.height,
          url: bestSize.url,
        };
      }) ?? [];
  return {
    id: post.id,
    posterName,
    posterIcon,
    text: post.text,
    date: dateFormat(post.date * 1000, "dd.mm.yy в HH:MM"),
    nestedItems:
      post.copy_history?.map((nestedPost) =>
        vkPostToPost(nestedPost, profileMap, groupMap)
      ) ?? [],
    photos,
  };
}

function vkResponseToPosts(res: VkWallResponse): VirtualWallPost[] {
  const profileMap = new Map<number, VkUser>();
  const groupMap = new Map<number, VkGroupObject>();
  res.profiles?.forEach((profile) => {
    profileMap.set(profile.id, profile);
  });
  res.groups?.forEach((group) => {
    groupMap.set(group.id, group);
  });
  return res.items.map((vkPost) => {
    const post = vkPostToPost(vkPost, profileMap, groupMap);
    return {
      id: post.id,
      value: post,
    };
  });
}

function fetchNextPage() {
  if (nextPage < 0) {
    return;
  }
  const curPage = nextPage++;
  getWall(props.userId, curPage, token.value!!)
    .then((res) => {
      if (res.items.length === 0) {
        if (curPage === 0) {
          isEmpty.value = true;
        }
        nextPage = -1;
        return;
      }
      const converted = vkResponseToPosts(res);
      posts.value.push(...converted);
    })
    .catch((e) => {
      if (e.toString().includes("This profile is private")) {
        isPrivate.value = true;
      } else {
        console.error(e);
      }
    })
    .finally(() => {
      showWall.value = true;
    });
}

const fetchNextPageDebounce = debounce(fetchNextPage, 333);

function onScrollToBottom() {
  fetchNextPageDebounce();
}

onMounted(() => {
  fetchNextPage();
});
</script>

<template>
  <div class="container" :class="{ show: showWall }">
    <div class="post-container" v-if="isPrivate">
      <div class="box msg">
        <img :src="Eye" alt="private profile" />
        <div class="msg-text">Это закрытый профиль</div>
        <div class="msg-description">
          Добавьте пользователя в друзья, чтобы смотреть записи, фотографии и
          другие материалы
        </div>
      </div>
    </div>
    <div class="post-container" v-else-if="isEmpty">
      <div class="box msg">
        <img :src="List" alt="empty profile" />
        <div class="msg-text">На стене пока нет ни одной записи</div>
      </div>
    </div>
    <DynamicScroller
      v-else
      :items="posts"
      :min-item-size="30"
      class="wall"
      @scroll-end="onScrollToBottom"
      page-mode
    >
      <template v-slot="{ item, index, active }">
        <DynamicScrollerItem
          :item="item"
          :active="active"
          :size-dependencies="[]"
          :data-index="index"
        >
          <div class="post-container">
            <div class="box">
              <VkWallItem :post="item.value" />
            </div>
          </div>
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
  </div>
</template>

<style scoped>
.container {
  max-width: 550px;
  opacity: 0;
  transition: 0.15s opacity ease;
}
.container.show {
  opacity: 1;
}
.msg {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.msg > img {
  animation: spin 5s linear infinite;
}
.msg-text {
  font-size: 20px;
}
.msg-description {
  color: #939393;
  font-size: 13px;
}
.msg > * {
  margin: 10px;
}
.box {
  padding: 10px;
  background: #222222;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.24);
}
.post-container {
  padding-top: 16px;
}
@-moz-keyframes spin {
  100% {
    -moz-transform: rotate(360deg);
  }
}
@-webkit-keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
  }
}
@keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
