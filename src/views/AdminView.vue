<template>
  <div v-if="officialBot">
    <div class="hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col">
      <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-black/10 px-6 ring-1 ring-white/5">
        <div class="flex h-16 shrink-0 items-center">
          <button type="button" @click="logout" class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 right-0.5">
            Logout
          </button>
          <img class="h-8 w-auto" src="../assets/image.png" alt="Your Company" />
        </div>

        <nav class="flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" class="-mx-2 space-y-1">
                <li v-for="item in navigation" :key="item.name">
                  <a @click="selectNavItem(item)"
                     :class="[
                         item.current ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                         'group flex gap-x-3 rounded-md p-2 text-sm font-semibold'
                       ]">
                    <component :is="item.icon" class="size-6 shrink-0" aria-hidden="true" />
                    {{ item.name }}
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
    <div  class="xl:pl-72" >
      <main class="lg:pr-px">
        <div style="padding: 20px"  v-if="currentNavItem == 'Search' ">
          <div style="margin-bottom: 20px" class="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">
            <p class="text-base font-semibold text-indigo-100">To Excel</p>
            <div class="mt-3 sm:ml-4 sm:mt-0 flex space-x-4">
              <button type="button" @click="downloadComment" class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Get Comment Excel
              </button>
              <button type="button" @click="downloadStats" class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Get Stats Excel
              </button>
            </div>
          </div>
<!--          <div style="" class="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">-->
<!--            <p class="text-base font-semibold text-indigo-100">Edit</p>-->
<!--            <div class="mt-3 sm:ml-4 sm:mt-0">-->
<!--              <button type="button" class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Upload</button>-->
<!--            </div>-->
<!--          </div>-->

          <div style="margin-bottom: 20px" class="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">
            <p class="text-base font-semibold text-indigo-100">Edit and Upload</p>
            <div class="mt-3 sm:ml-4 sm:mt-0">
              <form @submit.prevent="uploadFile" class="flex items-center space-x-2">
                <input type="file" @change="handleFileUpload" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"/>
                <button type="submit" class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600">
                  Upload File
                </button>
              </form>
            </div>
          </div>

          <div style="margin-bottom: 20px" class="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">            <!-- 标题 -->
            <p class="text-base font-semibold text-indigo-100">Administrative authority</p>
            <div class="mt-3 sm:ml-4 sm:mt-0 flex space-x-4">
              <button type="button" @click="Incentive" class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 mr-2">
                Incentive
              </button>
              <button type="button" @click="resetFreeTokens" class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600">
                reset free tokens
              </button>
            </div>
          </div>

          <div style="" class="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between ">            <!-- 标题 -->
            <p class="text-base font-semibold text-indigo-100">Current Default Bot</p>
            <div class="font-bold text-xl text-white flex items-center ">
              <img class="w-14 h-14 rounded-full bg-gray-700 border-4 border-indigo-400 shadow-sm hover:scale-105 transition-transform duration-300" :src="officialBot.avatarUrl" alt="用户头像" style="max-width: 56px; max-height: 56px; object-fit: cover;"/>

              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5.121 17.804A10.97 10.97 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10c0 1.57-.363 3.057-1.006 4.389"/>
              </svg>
              {{ officialBot.name }}
            </div>
          </div>



          <SearchView_admin></SearchView_admin>
        </div>

        <div style="padding: 20px" v-if="currentNavItem == 'Check' ">
            <check-view_admin></check-view_admin>
        </div>

      </main>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import Search from './SearchView.vue'
import {ClockIcon, MagnifyingGlassCircleIcon, SignalIcon} from '@heroicons/vue/24/outline'
import axios from "axios";
import SearchView_admin from "./SearchView_admin.vue";
import CheckView_admin from "./CheckView_admin.vue";
import Swal from "sweetalert2";
import { useRouter } from 'vue-router';
import { onMounted, onUnmounted } from 'vue';


const router = useRouter();

const navigation = ref([
  { name: 'Search', href: '#', icon: MagnifyingGlassCircleIcon, current: true },
  { name: 'Check', href: '#', icon: SignalIcon, current: true },

])

const currentNavItem = ref('Search')

const officialBot = ref()
let intervalId = null;

onMounted(() => {
  // 定义轮询函数
  const fetchOfficialBot = async () => {
    try {
      const response = await axios.get('/admin/getOfficial');
      officialBot.value = response.data;
    } catch (error) {
      console.error('Error fetching official bot:', error);
    }
  };

  // 第一次立即调用
  fetchOfficialBot();

  // 每0.5秒触发一次
  intervalId = setInterval(fetchOfficialBot, 500);
});

onUnmounted(() => {
  // 清理定时器
  if (intervalId) {
    clearInterval(intervalId);
  }
});

function selectNavItem(item) {
  currentNavItem.value = item.name
  item.current = true
  navigation.value.forEach(item1 => {
    if (item1 !== item) {
      item1.current = false
    }
  })
}
const selectedFile = ref(null);

const handleFileUpload = (event) => {
  selectedFile.value = event.target.files[0];
};

// 上传文件
const uploadFile = async () => {
  if (!selectedFile.value) {
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      confirmButtonText: 'OK',
      text: 'Please select a file!',
    })
    return;
  }

  const formData = new FormData();
  formData.append('file', selectedFile.value);

  try {
    const response = await axios.post('admin/upload/excel', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status === 200) {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        confirmButtonText: 'OK',
        text: 'File uploaded and database updated successfully!',
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        confirmButtonText: 'OK',
        text: 'Failed to upload file!',
      })
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      confirmButtonText: 'OK',
      text: 'An error occurred while uploading the file.',
    })
  }
};

function logout() {
  router.push('/login');
}

function downloadComment() {
  axios.get('admin/export/comments', {
    responseType: 'blob', // 指定接收二进制数据
  }).then(response => {
    // 创建 Blob 对象
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    // 创建下载链接
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'comments.xlsx'; // 设置文件名
    document.body.appendChild(link);
    link.click();
    // 清理
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
  }).catch(error => {
    console.error('Error downloading the file:', error);
  });
}

function downloadStats() {
  axios.get('admin/export/stats', {
    responseType: 'blob', // 指定接收二进制数据
  }).then(response => {
    // 创建 Blob 对象
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    // 创建下载链接
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'comments.xlsx'; // 设置文件名
    document.body.appendChild(link);
    link.click();
    // 清理
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
  }).catch(error => {
    console.error('Error downloading the file:', error);
  });
}

async function Incentive() {
  try {
    await axios.post(`bots/incentive`).then(() => {
      Swal.fire({
        title: 'Success!',
        html: `<p style="font-family: poppins;">Reset Free Tokens successfully!</p>`,
        icon: 'success',
        confirmButtonText: 'OK',
        showCancelButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false
      });
    }).catch((error) => {
      console.log(error.response?.data);
      Swal.fire({
        title: 'Error!',
        html: `<p style="font-family: poppins;">${error.response?.data?.message || 'An error occurred'}</p>`,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    });
  } catch (error) {
    Swal.fire({
      title: 'Oops!',
      html: `<p style="font-family: poppins;">There's something wrong!</p>`,
      icon: 'error',
      confirmButtonText: 'OK',
      allowOutsideClick: false,
      allowEscapeKey: false
    });
    throw new Error(error.response?.data?.message || 'Failed to process request');
  }
}

async function resetFreeTokens() {
  try {
    const formData = new FormData();
    formData.append('reset', true);
    await axios.post(`admin/resetFreeTokens`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(() => {
      Swal.fire({
        title: 'Success!',
        html: `<p style="font-family: poppins;">Reset Free Tokens successfully!</p>`,
        icon: 'success',
        confirmButtonText: 'OK',
        showCancelButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false
      });
    }).catch((error) => {
      console.log(error.response.data);
    }).finally(() => {
    });
  } catch (error) {
    Swal.fire({
      title: 'Oops!',
      html: `<p style="font-family: poppins;">Thers's some thing wrong!</p>`,
      icon: 'error',
      confirmButtonText: 'OK',
      allowOutsideClick: false,
      allowEscapeKey: false
    });
    throw new Error(error.response?.data?.message || 'Failed to post comment');
  }
}

const statuses = {
  offline: 'text-gray-500 bg-gray-100/10',
  online: 'text-green-400 bg-green-400/10',
  error: 'text-rose-400 bg-rose-400/10',
}

const environments = {
  Preview: 'text-gray-400 bg-gray-400/10 ring-gray-400/20',
  Launch: 'text-indigo-400 bg-indigo-400/10 ring-indigo-400/30',
}

const stats = [
  { name: 'Points', value: ref(() => this.$store.state.user.points) },
  { name: 'Tokens', value: '0', unit: 'tokens' },
  { name: 'Number of bots', value: '0' },
  { name: 'Success rate', value: '98.5%' },
]
</script>

<script>
export default {
  mounted() {
    if (this.$store.state.user.userType === 'regular') {
      this.$router.push('/Home');
    }
  }
}
</script>
