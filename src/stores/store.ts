import { ref } from "vue";
import type { Ref } from "vue";
import { defineStore } from "pinia";
import {
  loadAccessToken,
  loadSelectedUsers,
  saveSelectedUsers,
} from "@/lib/localstorage";
import type { User } from "@/lib/types";

export const useSelectedUsersStore = defineStore("selected-users", () => {
  const userList = ref(loadSelectedUsers());

  function addUser(user: User) {
    userList.value.push(user);
    saveSelectedUsers(userList.value);
  }

  function removeUser(id: number) {
    const index = userList.value.findIndex((user) => user.id === id);
    if (index < 0) {
      return;
    }
    userList.value.splice(index, 1);
    saveSelectedUsers(userList.value);
  }

  return { userList, addUser, removeUser };
});

export const useResultStore = defineStore("result", () => {
  const result: Ref<User[]> = ref([]);

  function setResult(newResult: User[]) {
    result.value = newResult;
  }

  function setDescription2(index: number, description2: string) {
    result.value[index].description2 = description2;
  }

  return { result, setResult, setDescription2 };
});

export const useTokenStore = defineStore("access-token", () => {
  const token = ref(loadAccessToken());

  return { token };
});
