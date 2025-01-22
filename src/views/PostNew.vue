<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'

import 'mdui/components/text-field.js';
import 'mdui/components/collapse.js';
import 'mdui/components/collapse-item.js';
import 'mdui/components/list-item.js';
import 'mdui/components/divider.js';

import '@mdui/icons/upload.js';
//import '@mdui/icons/near-me.js';
import '@mdui/icons/auto-awesome-motion.js';
import '@mdui/icons/check.js';

import { mduiSnackbar, mduiAlert } from '@/utils.js'
import { useApiStore } from '@/stores/api.js'
const api = useApiStore()
import { useEditTemp } from '@/stores/editTemp.js'
import { useRecommendStore } from '@/stores/homePage.js'

const router = useRouter()
const recommends = useRecommendStore()
const editTemp = useEditTemp()

const isPosting = ref(false)
const collectionReady = ref(false)
const collectionSelect = ref(0)
const collections = ref({
	1: '人渣反派自救系统',
	2: '魔道祖师',
	3: '天官赐福',
})

function onSelectCollection(target) {
	if ( target == collectionSelect.value ) {
		collectionSelect.value = 0
	} else {
		collectionSelect.value = target
	}
}

async function post() {
	isPosting.value = true
	const result = await api.postNew(editTemp.content, editTemp.title, collectionSelect.value)
	if ( result.code == 1 && result.status == 1 ) {
		mduiSnackbar('发布成功')
		var avatar = ''
		if ( api.accountInfo.avatar ) {
			avatar = `${api.config.ossEndpoint}/${api.accountInfo.avatar}`
		} else {
			avatar = `${api.config.ossEndpoint}/${api.config.defaultAvatarID}`
		}
		recommends.recommends.splice(0, 0, {
			postId: result.postId,
			title: editTemp.title,
			content: editTemp.content,
			authorInfo: api.accountInfo,
			avatar: avatar
		})
		setTimeout(() => {
			router.replace(`/post?postId=${result.postId}`)
			editTemp.content = ''
			editTemp.title = ''
		}, 500) 
	} else {
		mduiSnackbar(`发布失败 ${result.code} ${result.status}`)
	}
	isPosting.value = false
}

onMounted(async () => {
	if ( !api.config.isLogin ) {
		mduiSnackbar("需要登录")
		router.replace('/login')
	}
	collectionReady.value = true
})
</script>

<template>
	<mdui-text-field variant="outlined" v-model="editTemp.title" label="文章标题" :disabled="isPosting" maxlength="80" counter></mdui-text-field>
	<mdui-divider></mdui-divider>
	<mdui-text-field variant="filled" label="正文" v-model="editTemp.content" autosize min-rows="2" max-rows="8" :disabled="isPosting"></mdui-text-field>
	<!--<mdui-button class="button" variant="elevated" :disabled="isPosting">选择合集</mdui-button>-->
	<mdui-divider></mdui-divider>
	<mdui-collapse>
		<mdui-collapse-item :disabled="!collectionReady">
			<mdui-list-item slot="header" icon="near_me">
				<mdui-icon-auto-awesome-motion slot="icon"></mdui-icon-auto-awesome-motion>
				{{ collectionSelect != 0 ? collections[collectionSelect] : '选择合集' }}
			</mdui-list-item>
			<div style="margin-left: 2.5rem">
				<div v-for="(name, id) in collections" :key="id">
					<mdui-list-item @click="onSelectCollection(id)">
						<mdui-icon-check slot="end-icon" v-if="id == collectionSelect"></mdui-icon-check>
						{{ name }}
					</mdui-list-item>
				</div>
			</div>
		</mdui-collapse-item>
	</mdui-collapse>
	<mdui-divider></mdui-divider>
	<div class="bar" style="margin: 16px 0px">
		<mdui-button variant="tonal" @click="mduiSnackbar('功能未实现')">存草稿 (未实现)</mdui-button>
		<div style="flex-grow: 1;"/>
		<mdui-button @click="post()" :loading="isPosting"><mdui-icon-upload slot="icon"></mdui-icon-upload>发布</mdui-button>
	</div>
</template>
	
<style scope>

</style>
