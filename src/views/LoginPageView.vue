<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img style="cursor: pointer;" @click="goToMainPage" class="mx-auto h-10 w-auto" src="/src/assets/image.png"
        alt="Your Company" />
      <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">Sign in to your account</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="handleLogin">
        <div>
          <label for="email" class="block text-sm/6 font-medium text-white">Email address</label>
          <div class="mt-2">
            <input id="email" v-model="email" name="email" type="email" autocomplete="email" required=""
              class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm/6" />
          </div>
        </div>
        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm/6 font-medium text-white">Password</label>
            <div class="text-sm">
              <a href="#" class="font-semibold text-white">Forgot password?</a>
            </div>
          </div>
          <div class="mt-2">
            <input id="password" v-model="password" name="password" type="password" autocomplete="current-password"
              required=""
              class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm/6" />
          </div>
        </div>

        <div>
          <button type="submit"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Sign
            In</button>
        </div>
      </form>

      <p class="mt-10 text-center text-sm/6 text-white">
        Not a member?
        {{ ' ' }}
        <a href="/register" class="font-semibold text-indigo-400 hover:text-indigo-300">Register</a>
      </p>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
export default {
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    goToMainPage() {
      this.$router.push('/');
    },
    handleLogin() {
      this.$store.dispatch('login', {
        email: this.email,
        password: this.password
      }).then(success => {
        if (success) {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            confirmButtonText: 'OK',
            text: 'Logged in successfully',
          })
          this.$router.push('/Home');  // 登录成功后跳转到个人主页
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            confirmButtonText: 'OK',
            text: 'Login failed. Please check your credentials.',
          })
        }
      }).catch(error => {
        console.log("An error occurred during login:", error);
      });
    }
  }
};
</script>