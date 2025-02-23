<template>
  <div class="bg-transparent" style="padding: 40px;">
    <ul role="list" class="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8">
      <li v-for="bot in bots" :key="bot.id" class="overflow-hidden rounded-xl border border-gray-200 bg-slate-800 transform hover:scale-105 hover:shadow-lg transition-all duration-300"
        @click="openModal(bot)">
        <div class="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
          <div class="text-sm/6 font-medium text-gray-900">{{ bot.name }}</div>
        </div>
        <dl class="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm/6">
          <div class="flex justify-between gap-x-4 py-3">
            <dt class="text-gray-200 font-bold">version</dt>
            <dd class="text-white">
              <div :version="bot.version">{{ bot.version }}</div>
            </dd>
          </div>
          <div class="flex justify-between gap-x-4 py-3">
            <dt class="text-gray-200 font-bold">Last Update</dt>
            <dd class="text-white">
              {{getFormattedDate(bot.createdAt)}}
            </dd>
          </div>
          <div class="flex justify-between gap-x-4 py-3">
            <dt class="text-gray-200 font-bold">views</dt>
            <dd class="text-white">
              <div :version="bot.version">{{ bot.views }}</div>
            </dd>
          </div>
          <div class="flex justify-between gap-x-4 py-3">
            <dt class="text-gray-200 font-bold">Amount</dt>
            <dd class="flex items-start gap-x-2">
              <div class="font-medium text-white">{{ bot.price }} tokens/question</div>
              <div :class="[statuses[bot.state], 'rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset']">{{
                bot.state }}</div>
            </dd>
          </div>
        </dl>
      </li>
    </ul>
    
    <TransitionRoot as="template" :show="isShowBotModal">
      <Dialog class="relative z-10" @close="closeModal()">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 hidden bg-gray-500/75 transition-opacity md:block" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div class="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
            <!-- This element is to trick the browser into centering the modal contents. -->
            <span class="hidden md:inline-block md:h-screen md:align-middle" aria-hidden="true">&#8203;</span>
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 md:translate-y-0 md:scale-95" enter-to="opacity-100 translate-y-0 md:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 md:scale-100" leave-to="opacity-0 translate-y-4 md:translate-y-0 md:scale-95">
              <DialogPanel class="w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-2xl">
                <BotDetail :botId = "showBot.id"/>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import BotDetail from './BotDetail.vue';
import axios from 'axios'
import dayjs from 'dayjs';

const isLoading = ref(true); // 加载状态
const errorMessage = ref(null); // 错误消息

const showBot = ref(null); // 显示信息的bot
const isShowBotModal = ref(false); // 显示bot信息的模态框

const openModal = (bot) => {
  showBot.value = bot
  isShowBotModal.value = true
}

const closeModal = async() => {
  isShowBotModal.value = false
  try{
    bots.value = await fetchBots()
    return;
  }catch(error){
    errorMessage.value = error.message;
  }
}

const bots = ref([

])

const statuses = {
  Online: 'text-green-700 bg-green-300 ring-green-600/20',
  Offline: 'text-gray-600 bg-gray-50 ring-gray-500/10',
  error: 'text-red-700 bg-red-50 ring-red-600/10',
}

function getFormattedDate(date, format = "MMMM D, YYYY") {
  return date ? dayjs(date.slice(0,19)).format(format) : null;
}


async function fetchBots(){
  try{
    const response = await axios.get('/bots/showAllOnline');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch bot lists');
  }
}

onMounted(async () => {
  try {
    bots.value = await fetchBots();
    return ;
  } catch (error) {
    errorMessage.value = error.message; // 捕获错误
  } finally {
    isLoading.value = false; // 完成加载
  }
})  

</script>