<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { throttle } from 'mdui/functions/throttle.js';
import 'mdui/components/card.js';
import 'mdui/components/dropdown.js';
import 'mdui/components/linear-progress.js';

import { useApiStore } from '@/stores/api.js'
import { mduiSnackbar, mduiAlert, escapeAndFormatText, getQueryVariable } from '@/utils.js'

import { useHomePageScrollStore, useRecommendStore } from '@/stores/homePage.js'

import AccountBar from '@/components/AccountBar.vue'

const router = useRouter()
const homePageScrollStore = useHomePageScrollStore()
const recommendStore = useRecommendStore()
const api = useApiStore()

const recommends = recommendStore.recommends

const isLoaded = ref(Boolean(recommends))

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
		mduiSnackbar('滑动到底部了')
		fetchRecommend()
	}
}, 500)

onMounted(async () =>{
	nextTick(async () => {
		window.scrollTo(0, homePageScrollStore.getPosition('recommend'))
		await fetchRecommend()
		isLoaded.value = true
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
		<mdui-card v-for="item in recommends" :key="item.postId">
			<div v-if="item.title" style="font-size: 2em; margin: 10px" @click="router.push(`/post?postId=${item.postId}`)"><strong>{{ item.title }}</strong></div>
			<AccountBar :avatarUrl="item.avatar" :name="escapeAndFormatText(item.authorInfo.nickName)"  @click="router.push(`/user?userId=${item.authorInfo.userId}`)"/>
			<div style="text-indent: 0em; margin: 10px;" @click="router.push(`/post?postId=${item.postId}`)">
				<div style="white-space: pre-wrap;" v-html="escapeAndFormatText(item.content)"></div>
			</div>
		</mdui-card>
	</div><div v-else style="margin: 10px">
		加载中
		<mdui-linear-progress></mdui-linear-progress>
	</div>
</template>

<style scope>

</style>
