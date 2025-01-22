<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'

import { throttle } from 'mdui/functions/throttle.js';
import { confirm } from 'mdui/functions/confirm.js';
import 'mdui/components/card.js';
import 'mdui/components/button.js';
import 'mdui/components/collapse.js';
import 'mdui/components/collapse-item.js';
import 'mdui/components/linear-progress.js';
import 'mdui/components/divider.js';

import ProfileCard from '@/components/me/ProfileCard.vue'
import { useApiStore } from '@/stores/api.js'
import { mduiSnackbar, mduiAlert, escapeAndFormatText, getQueryVariable, formatUnixTimestamp } from '@/utils.js'

const router = useRouter()
const api = useApiStore()

const isLoaded = ref(false)
const isPostLoaded = ref(false)

const nickName = ref('')
const avatarUrl = ref('')

const postCount = ref(0)
const followCount = ref(0)
const followerCount = ref(0)

const posts = ref([])
const last = ref(0)
const more = ref(false)

var userInfo = null
var userCount = null


const userId = getQueryVariable('userId')

async function fetchPost() {
	const result = await api.getUserPost(userId);
	if (result.code == 1 && result.status == 1) {
		last.value = result.last
		more.value = result.more
		result.posts.forEach((post) => {
			posts.value.push(post);
		})
	} else {
		mduiAlert("错误",`${result.code} ${result.status}`)
	}
}

const onScroll = throttle(() => {
	const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	const scrollHeight = document.documentElement.scrollHeight;
	const clientHeight = document.documentElement.clientHeight;
	if (Math.abs(scrollTop + clientHeight - scrollHeight) < 1) {
		fetchPost()
	}
}, 500)

onMounted(async () => {
	if (userId) {
		var result = await api.getUserInfo(userId, true)
		if (result.code == 1 && result.status == 1) {
			userInfo = result.userInfo
			userCount = result.userCount
			nickName.value = userInfo.nickName
			avatarUrl.value = await api.getAvatarUrl(userInfo.avatar)
			postCount.value = userCount.postCount
			isLoaded.value = true
			result = await api.getUserPost(userInfo.userId, null, last.value);
			if (result.code == 1 && result.status == 1) {
				last.value = result.last
				more.value = result.more
				result.posts.forEach((post) => {
					posts.value.push(post);
				})
			} else {
				mduiAlert("错误",`${result.code} ${result.status}`)
			}
		} else {
			if (result.status) {
				mduiAlert("找不到用户",`ID: ${userId} 请检查链接是不是没复制完全?`,() => router.back())
			} else {
				mduiAlert("错误",`${result.code} ${result.status}`)
			}
		}
	} else {
		mduiAlert("错误","未提供userID参数",() => router.back())
	}
	window.addEventListener('scroll', onScroll)
})


onBeforeUnmount(() => {
	window.removeEventListener('scroll', onScroll)
    //homePageScrollStore.savePosition('post', window.scrollY);
})

</script>

<template>
	<div v-if="isLoaded">
		<ProfileCard :avatarUrl="avatarUrl" :name="nickName" :loading="!isLoaded" />
		<mdui-card>
			<!--<p><span style="font-size: 1.5em"><strong>喜欢,收藏</strong></span></p>-->
			<div class="toolbar">
				<div class="toolitem">
					{{ postCount }}
					<br/>文章
				</div>
				<div class="toolitem">
					0
					<br/>粉丝
				</div>
				<div class="toolitem">
					0
					<br/>合集
				</div>
			</div>
		</mdui-card>
		<mdui-divider style="margin: 0px auto 2px;"></mdui-divider>
		<mdui-card v-for="(item, index) in posts" :key="item.postId">
			<div v-if="item.title" style="font-size: 1.3em; margin: 10px" @click="router.push(`/post?postId=${item.postId}`)"><strong>{{ item.title }}</strong></div>
			<div class="typescale-label-small" style="margin: 6px 10px 0px; color: rgb(var(--mdui-color-on-surface-variant));" @click="router.push(`/post?postId=${item.postId}`)">{{ formatUnixTimestamp(item.createdAt) }}</div>
			<div style="text-indent: 0em; margin: 10px;" @click="router.push(`/post?postId=${item.postId}`)">
				<div style="white-space: pre-wrap;" v-html="escapeAndFormatText(item.content)"></div>
			</div>
		</mdui-card>
	</div><div v-else class="load-progress">
		加载中
		<mdui-linear-progress></mdui-linear-progress>
	</div>
</template>

<style scope>

</style>
