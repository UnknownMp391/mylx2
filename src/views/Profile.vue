<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import 'mdui/components/text-field.js';
import 'mdui/components/divider.js';

import ProfileCard from '@/components/me/ProfileCard.vue'
import { useApiStore } from '@/stores/api.js'

const router = useRouter()
const api = useApiStore()

const isLoaded = ref(false)
const nickName = ref('')
const avatarUrl = ref('/favicon.png')
const editNickName = ref('')


onMounted(async () => {
	isLoaded.value = false
	if (api.isLogin) {
		avatarUrl.value = await api.getAvatarUrl(api.accountInfo.avatar)
		editNickName.value = nickName.value = api.accountInfo.nickName
	} else {
		router.replace('/login')
	}
	isLoaded.value = true
	
})


</script>

<template>
	<div v-if="isLoaded">
		<ProfileCard :avatarUrl="avatarUrl" :name="nickName" :loading="!isLoaded" />
		<mdui-divider></mdui-divider>
		<mdui-text-field label="昵称"></mdui-text-field>
		<div class="toolbar">
			<mdui-button class="toolitem" variant="tonal">恢复</mdui-button>
			<div style="flex: 1;" />
			<mdui-button class="toolitem" @click.prevent="onDelete(index, item)">应用</mdui-button>
		</div>
	</div><div v-else class="load-progress">
		加载中
		<mdui-linear-progress></mdui-linear-progress>
	</div>
</template>

<style scope>

</style>
