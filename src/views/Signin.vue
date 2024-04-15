<template>
  <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
      <div class="col-12">
        <navbar
          isBlur="blur  border-radius-lg my-3 py-2 start-0 end-0 mx-4 shadow"
          v-bind:darkMode="true"
          isBtn="bg-gradient-success"
        />
      </div>
    </div>
  </div>
  <main class="mt-0 main-content">
    <section>
      <div class="page-header min-vh-100">
        <div class="container">
          <div class="row">
            <div class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column mx-lg-0">
              <div class="card card-plain">
                <div class="pb-0 card-header text-start">
                  <h4 class="font-weight-bolder">Sign In</h4>
                  <p class="mb-0">Enter your email and password to sign in</p>
                </div>
                <div class="card-body">
                  <form role="form" @submit.prevent="login">
                    <div class="mb-3">
                      <argon-input type="text" placeholder="Username" v-model="username" size="lg" />
                    </div>
                    <div class="mb-3">
                      <argon-input type="password" placeholder="Password" v-model="password" size="lg" />
                    </div>
                    <argon-switch id="rememberMe">Remember me</argon-switch>

                    <div class="text-center">
                      <argon-button type="submit"
                      class="mt-4"
                      variant="gradient"
                      color="success"
                      fullWidth
                      size="lg"
                      >Sign in</argon-button>
                    </div>
                  </form>
                </div>

                <div class="px-1 pt-0 text-center card-footer px-lg-2">
                  <p class="mx-auto mb-4 text-sm">
                    Don't have an account?
                    <a
                      href="javascript:;"
                      class="text-success text-gradient font-weight-bold"
                    >Sign up</a>
                  </p>
                </div>
              </div>
            </div>
            <div
              class="top-0 my-auto text-center col-6 d-lg-flex d-none h-100 pe-0 position-absolute end-0 justify-content-center flex-column"
            >
              <div
                class="position-relative bg-gradient-primary h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden"
                style="background-image: url('/src/assets/img/download/signin-ill.jpg');
          background-size: cover;"
              >
                <span class="mask bg-gradient-success opacity-6"></span>
                <h4
                  class="mt-5 text-white font-weight-bolder position-relative"
                >"Attention is the new currency"</h4>
                <p
                  class="text-white position-relative"
                >The more effortless the writing looks, the more effort the writer actually put into the process.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import Navbar from "@/examples/PageLayout/Navbar.vue";
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonSwitch from "@/components/ArgonSwitch.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import axios from 'axios';
import { useStore } from 'vuex';
import {onBeforeUnmount, onMounted, ref} from "vue";
import router from "@/router";

// 根据实际目录结构修改

export default {
  name: "signin",
  components: {
    Navbar,
    ArgonInput,
    ArgonSwitch,
    ArgonButton,
  },
  setup() {
    const store = useStore();
    const username = ref('');
    const password = ref('');

    // 初始化页面状态
    onMounted(() => {
      store.state.hideConfigButton = true;
      store.state.showNavbar = false;
      store.state.showSidenav = false;
      store.state.showFooter = false;
      document.body.classList.remove("bg-gray-100");
      // 获取存储中的jwt
      const jwtFromStorage = localStorage.getItem('jwt');

      // 更新store中的jwt和isLoggedIn状态
      store.commit('auth/SET_JWT', jwtFromStorage);
    });

    // 恢复页面原始状态
    onBeforeUnmount(() => {
      store.state.hideConfigButton = false;
      store.state.showNavbar = true;
      store.state.showSidenav = true;
      store.state.showFooter = true;
      document.body.classList.add("bg-gray-100");
    });

    async function login() {
      try {
        console.log('About to send login request...');
        const response = await axios.post('/api/login', { username: username.value, password: password.value }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          withCredentials: true,
        });
        if (response.status === 200) {
          const { token } = response.data;
          await store.dispatch('auth/setJwt', { jwt: token });
          router.push({ path: '/dashboard-default' });

        } else {
          console.error(`Login failed with status code ${response.status}`);
        }
      } catch (error) {
        // 错误处理逻辑...
        if (error.response && error.response.status === 401) {

          console.log('Received a 401 Unauthorized response. Redirecting to login page...');
          // 在这里由于已经是登录页面，不需要再次重定向，只需提示用户或清空表单等操作
          [username.value, password.value] = ['', ''];
          alert('Invalid credentials. Please try again.');
        } else {
          console.error(`An error occurred during the login process: ${error.message}`);
        }
      }
    }

    return {
      username,
      password,
      login
    };
  }
};
</script>
