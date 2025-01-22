<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import 'mdui/components/text-field.js';
import 'mdui/components/divider.js';

import { mduiSnackbar, mduiAlert } from '@/utils.js'
import ProfileCard from '@/components/me/ProfileCard.vue'
import { useApiStore } from '@/stores/api.js'

const router = useRouter()
const api = useApiStore()

const isLoaded = ref(false)
const isApplying = ref(false)
const nickName = ref('')
const bio = ref('')
const avatarUrl = ref('/favicon.png')
const editNickName = ref('')
const editBio = ref('')

function onRestore() {
	editNickName.value = nickName.value
	//editBio.value = bio.value
}

async function onApply() {
	isApplying.value = true
	const result = await api.setAccountProfile(nickName.value, bio.value)
	if ( result.code == 1 && result.status == 1 ) {
		mduiSnackbar('修改成功')
		nickName.value = editNickName.value
		api.accountInfo.nickName = editNickName.value
	} else {
		mduiAlert("错误",`${result.code} ${result.status}`)
	}
	isApplying.value = false
}

onMounted(async () => {
	isLoaded.value = false
	await api.init()
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
		<mdui-text-field label="昵称" v-model="editNickName" maxlength="50" counter :disabled="isApplying"></mdui-text-field>
		<mdui-text-field label="个人介绍" v-model="bio" autosize min-row="1" max-row="4" maxlength="500" counter :disabled="isApplying"></mdui-text-field>
		<div class="toolbar">
			<mdui-button class="toolitem" variant="tonal" :disabled="isApplying">恢复</mdui-button>
			<div style="flex: 1;" />
			<mdui-button class="toolitem" @click.prevent="onApply" :loading="isApplying">应用</mdui-button>
		</div>
	</div><div v-else class="load-progress">
		加载中
		<mdui-linear-progress></mdui-linear-progress>
	</div>
</template>

<style scope>

</style>
