<script setup lang="ts">
import { computed, ref } from "vue";
import type { Ref } from "vue";
import login from "../assets/login.png";
import accounts from "../assets/accounts.png";
import list from "../assets/list.png";
import wall from "../assets/wall.png";
import { useRouter } from "vue-router";
import { useTokenStore } from "@/stores/store";

interface Step {
  icon: string;
  title: string;
  description: string;
}

const router = useRouter();

const tokenStore = useTokenStore();
const token = computed(() => tokenStore.token);

function authorize() {
  if (token.value) {
    router.push("/list");
  } else {
    const redirectUrl = encodeURIComponent(
      `${location.protocol}//${location.host}`
    );
    location.replace(
      `https://oauth.vk.com/authorize?client_id=51442436&display=page&redirect_uri=${redirectUrl}&scope=friends&response_type=token&v=5.131`
    );
  }
}

const steps: Ref<Step[]> = ref([
  {
    icon: login,
    title: "Авторизуйтесь",
    description:
      "Авторизуйтесь в VK для того чтобы получить доступ к функционалу сервиса. Перейдите по ссылке и предоставьте Vk-SPA доступ к чтению вашего аккаунта.",
  },
  {
    icon: accounts,
    title: "Добавьте пользователей",
    description:
      "Составьте список пользователей, всех друзей которых вы хотите увидеть. Добавлять их можно по id, логину или имени/фамилии.",
  },
  {
    icon: list,
    title: "Постройте список",
    description:
      "Нажмите 'построить' чтобы составить список всех друзей выбранных пользователей. В списке отображается информация о поле, возрасте, кол-ве друзей. Кроме того, цвет панели друга тем ярче, чем у большего числа выбранных пользователей он находится в друзьях.",
  },
  {
    icon: wall,
    title: "Посмотрите стену",
    description:
      "Нажмите на пользователя в списке, чтобы узнать, у кого из выбранных пользователей он находится в друзьях, а также посмотреть его стену.",
  },
]);
</script>

<template>
  <div class="landing">
    <h1>
      Платформа поиска <span class="highlight">общих друзей</span> нового
      поколения
    </h1>
    <h2>
      Просматривайте список всех друзей выбранных пользователей, а также их
      стену и информацию об общих друзьях с помощью Vk-SPA
    </h2>
    <div class="algorithm">
      <div v-once v-for="(step, index) in steps" :key="step.title" class="step">
        <div class="icon">
          <img :alt="step.title" :src="step.icon" />
        </div>
        <div>
          <h3 class="title">{{ index + 1 }}. {{ step.title }}</h3>
          <div class="description">{{ step.description }}</div>
        </div>
      </div>
    </div>
    <div class="next" @click="authorize">
      <div class="label">Начать</div>
      <div class="circle">
        <svg
          aria-hidden="true"
          focusable="false"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 320 512"
        >
          <path
            fill="currentColor"
            d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"
            class=""
          ></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.landing {
  background: #292929;
  border-radius: 20px;
  margin: 50px auto;
  max-width: 1000px;
  padding: 60px 80px;
  width: 100%;
}

@media (max-width: 800px) {
  .landing {
    margin-top: 0;
  }
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 auto;
  margin-bottom: 20px;
  text-align: center;
}

h2 {
  color: #cccccc;
  font-size: 1rem;
  margin: 0 auto;
  text-align: center;
  max-width: 600px;
}

h3 {
  margin: 0;
  margin-bottom: 8px;
  padding: 0;
}

.highlight {
  white-space: nowrap;
  color: #71aaeb;
  background-color: rgba(73, 134, 204, 0.2);
}

.algorithm {
  display: grid;
  grid-gap: 70px 60px;
  grid-template-columns: repeat(2, minmax(300px, 400px));
  justify-content: center;
  margin: 0 auto;
  margin-bottom: 90px;
  margin-top: 85px;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

@media (max-width: 800px) {
  .algorithm {
    grid-template-columns: minmax(200px, 500px);
    grid-gap: 50px;
    margin-top: 70px;
  }
}

.step {
  display: grid;
  grid-template-columns: 80px auto;
  grid-gap: 0;
}

.description {
  border-left-color: transparent;
  transition: 0.1s padding-left ease, 0.2s border-left-color ease;
}

@media (min-width: 800px) {
  .description:hover {
    border-left: 1px solid #71aaeb;
    padding-left: 8px;
  }
}

.icon {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

img {
  width: 48px;
  height: 48px;
}

.next {
  align-items: center;
  background: #0077ff;
  border-radius: 30px;
  box-shadow: 0 2px 40px rgba(0, 0, 0, 0.4);
  display: grid;
  grid-template-columns: auto 38px;
  height: 49px;
  padding-left: 20px;
  padding-right: 7px;
  width: 200px;
  margin: 0 auto;
  margin-bottom: -78px;
  transition: box-shadow 0.4s ease;
  cursor: pointer;
}

.next:hover {
  box-shadow: 0 2px 43px rgb(8 150 230 / 60%);
}

.next .label {
  color: #f7fafc;
  font-size: 1.2rem;
  font-weight: 800;
  text-align: center;
  font-family: monospace;
}

.next .circle {
  background: #d9e6ff;
  color: #3577ff;
  font-size: 1rem;
  height: 37px;
  padding-left: 3px;
  width: 37px;
  align-items: center;
  border-radius: 50%;
  display: grid;
  font-weight: 700;
  justify-content: center;
}

svg {
  height: 1em;
  width: 0.625em;
}
</style>
