<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { throttle } from 'mdui/functions/throttle.js';
import 'mdui/components/card.js';
import 'mdui/components/dropdown.js';
import 'mdui/components/linear-progress.js';

import { useApiStore } from '@/stores/api.js'
import { mduiSnackbar, mduiAlert, escapeAndFormatText, getQueryVariable, formatUnixTimestamp } from '@/utils.js'

import { useHomePageScrollStore, useRecommendStore } from '@/stores/homePage.js'

import AccountBar from '@/components/AccountBar.vue'

const router = useRouter()
const homePageScrollStore = useHomePageScrollStore()
const recommendStore = useRecommendStore()
const api = useApiStore()

const recommends = recommendStore.recommends

const isLoaded = ref(Boolean(recommends.value))

async function fetchRecommend() {
	const result = await api.getRecommend(null, recommendStore.lastRecommend);
	recommendStore.lastRecommend = result.last
	recommendStore.moreRecommend = result.more
	if (result.code == 1 && result.status == 1) {
		result.recommends.forEach((post) => {
			if ( post.authorInfo.avatar ) {
				post.avatar = `${api.config.ossEndpoint}/${post.authorInfo.avatar}`
			} else {
				post.avatar = `${api.config.ossEndpoint}/${api.config.defaultAvatarID}`
			}
			recommends.push(post);
		})
	} else {
		mduiAlert("错误",`${result.code} ${result.status}`)
	}
	isLoaded.value = true
}

const onScroll = throttle(() => {
	const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	const scrollHeight = document.documentElement.scrollHeight;
	const clientHeight = document.documentElement.clientHeight;

	if (Math.abs(scrollTop + clientHeight - scrollHeight) < 10) {
		fetchRecommend()
	}
}, 500)

onMounted(async () =>{
	await api.init()
	nextTick(async () => {
		window.scrollTo(0, homePageScrollStore.getPosition('recommend'))
		await fetchRecommend()
	})
	window.addEventListener('scroll', onScroll)
})


onBeforeUnmount(() => {
	window.removeEventListener('scroll', onScroll)
    homePageScrollStore.savePosition('recommend', window.scrollY);
})

</script>

<template>
	<div v-if="isLoaded">
		<mdui-card v-for="item in recommends" :key="item.postId" @click="router.push(`/post?postId=${item.postId}`)" class="recommend-card">
			<div v-if="item.title" style="font-size: 2em; margin: 10px"><strong>{{ item.title }}</strong></div>
			<AccountBar :avatarUrl="item.avatar" :name="escapeAndFormatText(item.authorInfo.nickName)" />
			<div class="typescale-label-small" style="margin: 6px 10px 0px; color: rgb(var(--mdui-color-on-surface-variant));">{{ formatUnixTimestamp(item.createdAt) }}</div>
			<div style="text-indent: 0em; margin: 10px;">
				<div style="white-space: pre-wrap;" v-html="escapeAndFormatText(item.content)"></div>
			</div>
		</mdui-card>
	</div><div v-else style="margin: 10px">
		加载中
		<mdui-linear-progress></mdui-linear-progress>
	</div>
</template>

<style scope>
.recommend-card {
	background-color: rgb(var(--mdui-color-surface-variant));
}
</style>
