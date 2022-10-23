<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Ref } from "vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

interface Props {
  hint?: string;
  autofocus?: boolean;
  spinner?: boolean;
  modelValue: string;
}

const inputRef: Ref<HTMLInputElement | null> = ref(null);
const props = withDefaults(defineProps<Props>(), {
  hint: "",
  autofocus: false,
  spinner: false,
});

const emit = defineEmits<{
  (e: "click"): void;
  (e: "update:modelValue", value: string | undefined): void;
}>();

function onInput(e: any) {
  emit("update:modelValue", e.target.value);
}

onMounted(() => {
  if (props.autofocus) {
    inputRef.value?.focus();
  }
});
</script>

<template>
  <div class="search">
    <input
      ref="inputRef"
      :value="props.modelValue"
      type="text"
      :placeholder="props.hint"
      @input="onInput"
    />
    <LoadingSpinner class="spinner-anim" v-if="props.spinner" />
  </div>
</template>

<style scoped>
.search {
  position: relative;
  background-color: #222222;
}
input {
  padding: 14px 44px 13px 48px;
  padding-left: 28px;
  padding-right: 140px;
  background: url(data:image/svg+xml;charset=utf-8,%3Csvg%20height%3D%2224%22%20width%3D%2224%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M0%200h24v24H0z%22%2F%3E%3Cpath%20d%3D%22M16.76023%2014.65292l2.89644%202.64982c.39061.35735.40734.94696.03329%201.32101l-.06627.06627c-.37223.37222-.96593.35483-1.321-.0333l-2.64978-2.89648C14.6412%2016.53776%2013.37458%2017%2012%2017c-3.3137%200-6-2.6863-6-6s2.6863-6%206-6%206%202.6863%206%206c0%201.3746-.46224%202.64122-1.23977%203.65292zM12%2015c2.20914%200%204-1.79086%204-4s-1.79086-4-4-4-4%201.79086-4%204%201.79086%204%204%204z%22%20fill%3D%22%23828282%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E)
    no-repeat;
  background-position: -6px 50%;
  border: 0;
  border-left: 20px solid transparent;
  color: #e1e3e6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  margin: 0;
  line-height: 18px;
  outline: 0;
  -webkit-box-shadow: none;
  box-shadow: none;
}
.spinner-anim {
  position: absolute;
  right: 10px;
  top: 8px;
}
</style>
