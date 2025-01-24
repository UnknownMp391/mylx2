<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'

import 'mdui/components/text-field.js';
import 'mdui/components/collapse.js';
import 'mdui/components/collapse-item.js';
import 'mdui/components/list-item.js';
import 'mdui/components/divider.js';
import 'mdui/components/linear-progress.js';

import '@mdui/icons/upload.js';
//import '@mdui/icons/near-me.js';
import '@mdui/icons/auto-awesome-motion.js';
import '@mdui/icons/check.js';
import '@mdui/icons/close.js';

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
var linearProgress = ref(0);
const fileInput = ref(null);
const selectedFiles = ref([]);


function onSelectCollection(target) {
	if ( target == collectionSelect.value ) {
		collectionSelect.value = 0
	} else {
		collectionSelect.value = target
	}
}

async function post() {
	isPosting.value = true
	var imageList = []
	if (selectedFiles.value)  {
		let imageIndex = 0;
		const imageCount = selectedFiles.value.length
		for (const image of selectedFiles.value) {
			const imageStatus = await api.uploadImage(image.file, (progressEvent) => {
				const imageProgress = progressEvent.loaded / progressEvent.total
				linearProgress.value = (imageIndex + imageProgress) / imageCount
			})
			switch (imageStatus.status) {
				case 1: {
					imageList.push(imageStatus.id);
					imageIndex += 1;
					break;
				}
				default: {
					mduiAlert('发布失败!',`错误码 ${imageStatus.status}`)
					isPosting.value = false;
					return;
				}
			}
		}
	}
	const result = await api.postNew(editTemp.content, editTemp.title, collectionSelect.value,imageList)
	if ( result.code == 1 && result.status == 1 ) {
		mduiSnackbar('发布成功')
		var avatar = ''
		if ( api.accountInfo.avatar ) {
			avatar = `${api.config.ossEndpoint}/${api.accountInfo.avatar}`
		} else {
			avatar = `${api.config.ossEndpoint}/${api.config.defaultAvatarID}`
		}
		console.log(result.createdAt)
		recommends.recommends.splice(0, 0, {
			postId: result.postId,
			title: editTemp.title,
			content: editTemp.content,
			authorInfo: api.accountInfo,
			avatar: avatar,
			createdAt: result.createdAt
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

function uploadImages() {
	fileInput.value.click();
}

function onImagesChange(event) {
	const files = Array.from(event.target.files);
	const newFiles = files.map(file => ({
		file,
		url: URL.createObjectURL(file) // 创建每个文件的预览 URL
	}));
	selectedFiles.value = [...selectedFiles.value, ...newFiles]; // 追加新文件到末尾
}

function removeImage(index) {
	selectedFiles.value.splice(index, 1); // 删除指定索引的图片
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
	<input 
		type="file" 
		ref="fileInput" 
		style="display: none" 
		@change="onImagesChange"
		multiple
	/>
	<mdui-button style="margin: 10px 0px;" variant="elevated" @click="uploadImages()">上传图片</mdui-button>
		<!-- 预览图片区域 -->
		<div v-if="selectedFiles.length">
			<div v-for="(file, index) in selectedFiles" :key="index" style="display: flex; justify-content: center; align-items: center; position: relative; margin-bottom: 10px;"
>
				<!-- 图片预览 -->
				<img :src="file.url" alt="Image Preview" style="border-radius: 8px;" class="choose-image" />
				<!-- 删除按钮 -->
				<mdui-icon-close style="color: rgb(var(--mdui-color-error));position: absolute; top: 5px; right: 5px; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer;" @click="removeImage(index)"></mdui-icon-close>
			</div>
		</div>
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
	<mdui-linear-progress v-model="linearProgress" value="0" style="margin: 15px 0px 0px;"></mdui-linear-progress>
	<div class="bar" style="margin: 16px 0px">
		<mdui-button variant="tonal" @click="mduiSnackbar('功能未实现')">存草稿 (未实现)</mdui-button>
		<div style="flex-grow: 1;"/>
		<mdui-button @click="post()" :loading="isPosting"><mdui-icon-upload slot="icon"></mdui-icon-upload>发布</mdui-button>
	</div>
</template>
	
<style scope>
.choose-image {
    width: auto;
    max-height: 200px;
    border-radius: 8px;
    display: block;
    max-width: 100%;
    max-height: 300px;
}
</style>
