<template>
    <header class="flex items-center justify-between border-b border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <h1 class="text-base/7 font-semibold text-white">Recently Used Bots</h1>
    </header>
    <ul role="list" class="divide-y divide-white/5">
        <li v-for="bot in RecentlyUseList" :key="bot.id" class="relative flex items-center space-x-4 px-4 py-4 sm:px-6 lg:px-8">
            <div class="min-w-0 flex-auto">
                <div class="flex items-center gap-x-3">
                    <div :class="[statuses[bot.status], 'flex-none rounded-full p-1']">
                        <div class="size-2 rounded-full bg-current" />
                    </div>
                    <h2 class="min-w-0 text-sm/6 font-semibold text-white">
                        <div class="flex gap-x-2">
                            <span class="whitespace-nowrap">{{ bot.projectName }}</span>
                            <span class="absolute inset-0" />
                        </div>
                    </h2>
                </div>
                <div class="mt-3 flex items-center gap-x-2.5 text-xs/5 text-gray-400">
                    <p class="whitespace-nowrap">Last use time:  {{ getLastUseTime(bot) }}</p>
                </div>
                <div class="mt-3 flex items-center gap-x-2.5 text-xs/5 text-gray-400">
                    <p class="whitespace-nowrap">Interaction count:  {{ bot.interactionCount }} times</p>
                </div>
            </div>
            <div :class="[statuses_tags[bot.status], 'flex-none rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset']">
                {{ bot.status }}
            </div>
            <ChevronRightIcon class="size-5 flex-none text-gray-400" aria-hidden="true" />
        </li>
    </ul>
</template>

<script setup>
import { ref, onMounted} from 'vue'
import { useStore } from 'vuex'
import axios from "axios";
const store = useStore();
const isLoading = ref(true); // 加载状态
const errorMessage = ref(null); // 错误消息

const RecentlyUseList = ref(
    [

    ]
)
const statuses = {
    Offline: 'text-gray-500 bg-gray-100/10',
    Online: 'text-green-400 bg-green-400/10',
    error: 'text-rose-400 bg-rose-400/10',
}
const statuses_tags = {
    Offline: 'text-gray-400 bg-gray-400/10 ring-gray-400/20',
    Online: 'text-green-400 bg-green-400/10 ring-green-400/30',
    error: 'text-red-400 bg-red-400/10 ring-red-400/30',
}

function getLastUseTime(bot) {
    const now = new Date();
    const lastUseTime = new Date(bot.last_use_time.slice(0,19));
    const diff = now - lastUseTime;
    const diffSeconds = diff / 1000;
    if (diffSeconds < 60) {
        return `${Math.floor(diffSeconds)} seconds ago`;
    }
    const diffMinutes = diffSeconds / 60;
    if (diffMinutes < 60) {
        return `${Math.floor(diffMinutes)} minutes ago`;
    }
    const diffHours = diffMinutes / 60;
    if (diffHours < 24) {
        return `${Math.floor(diffHours)} hours ago`;
    }
    const diffDays = diffHours / 24;
    return `${Math.floor(diffDays)} days ago`;
}

async function fetchRecentUseBots(userEmail) {
  try {
    console.log(userEmail);
    const response = await axios.get(`/user/getRecentUseBots`, {
      params: { email: userEmail }
    }); // 发送 GET 请求
    return response.data; // 返回数据
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch recently used bot details');
  }
}

onMounted(async () => {
  try {
    RecentlyUseList.value = await fetchRecentUseBots(store.state.user.email); // 加载数据
    return true; // 成功加载
  } catch (error) {
    errorMessage.value = error.message; // 捕获错误
  } finally {
    isLoading.value = false; // 完成加载
  }
});

</script>