<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { throttle } from 'mdui/functions/throttle.js';
import { confirm } from 'mdui/functions/confirm.js';
import 'mdui/components/card.js';
import 'mdui/components/button.js';
import 'mdui/components/collapse.js';
import 'mdui/components/collapse-item.js';

import { useApiStore } from '@/stores/api.js'
import { mduiSnackbar, mduiAlert, escapeAndFormatText } from '@/utils.js'

const router = useRouter()
const api = useApiStore()

const posts = ref([])
const last = ref(0)
const more = ref(false)

async function fetchPost() {
	const result = await api.getAccountPost(null, last.value);
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

function onDelete(index, item) {
	//mduiSnackbar(`${index} ${item.postId}`)
	confirm({
		headline: "警告!",
		description: `你确定要删除 ${item.title} 吗?`,
		confirmText: "删掉",
		cancelText: "算了",
		closeOnOverlayClick: true,
		closeOnEsc: true,
		onConfirm: async () => {
			const result = await api.deletePost(item.postId)
			if (result.code == 1 && result.status == 1) {
				mduiSnackbar('删除成功')
				posts.value.splice(index, 1);
			}
		}
	});
}

const onScroll = throttle(() => {
	const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	const scrollHeight = document.documentElement.scrollHeight;
	const clientHeight = document.documentElement.clientHeight;
	if (Math.abs(scrollTop + clientHeight - scrollHeight) < 1) {
		fetchPost()
	}
}, 500)

onMounted(async () =>{
	nextTick(async () => {
		//window.scrollTo(0, homePageScrollStore.getPosition('post'))
		await fetchPost()
	})
	window.addEventListener('scroll', onScroll)
})


onBeforeUnmount(() => {
	window.removeEventListener('scroll', onScroll)
    //homePageScrollStore.savePosition('post', window.scrollY);
})

</script>

<template>
	<div>
		<mdui-card v-for="(item, index) in posts" :key="item.postId">
			<div v-if="item.title" style="font-size: 1.3em; margin: 0px 10px" @click="router.push(`/post?postId=${item.postId}`)"><strong>{{ item.title }}</strong></div>
			<div style="text-indent: 0em; margin: 10px;" @click="router.push(`/post?postId=${item.postId}`)">
				<div style="white-space: pre-wrap;" v-html="escapeAndFormatText(item.content)"></div>
			</div>
			<div class="toolbar">
				<mdui-button class="toolitem">编辑</mdui-button>
				<div style="flex: 1;" />
				<mdui-button class="toolitem warn" @click.prevent="onDelete(index, item)">删除</mdui-button>
			</div>
		</mdui-card>
	</div>
</template>

<style scope>

</style>
