<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'

import 'mdui/components/card.js'
import 'mdui/components/text-field.js'
import 'mdui/components/button.js'

import { mduiSnackbar, mduiAlert } from '@/utils.js'
import { useApiStore } from '@/stores/api.js'
import { useHomePageStore, useRecommendStore } from '@/stores/homePage.js'
const api = useApiStore()
const homePage = useHomePageStore()
const router = useRouter()

const userName = ref('')
const password = ref('')
const isLogging = ref(false)

async function login() {
	if (isLogging.value) return
	if (userName.value == '' || password.value == '') {
		mduiAlert('警告', '用户名和密码不能为空')
		return;
	}
	isLogging.value = true
	const result = await api.accountLogin(userName.value, password.value)
	isLogging.value = false
	if (result.status == 1) {
		mduiSnackbar('登录成功')
		router.replace({ path: '/' })
		setTimeout(() => {
			window.location.href = '/'
		})
	} else {
		mduiAlert('登录失败','用户名或者密码错误')
	}
}

onMounted(async () => {
	
})


</script>

<template>
	<div class="container">
		<img class="avatar" src="/favicon.png">
		<div class="title">登录到 墨宇留香</div>
	</div>
	<mdui-card style="padding: 10px; width: 100%;">
		<mdui-text-field label="用户名" type="text" v-model="userName" clearable :disabled="isLogging" maxlength="64" counter></mdui-text-field><br/><br/>
		<mdui-text-field label="密码" type="password" v-model="password" toggle-password clearable :disabled="isLogging"></mdui-text-field><br/><br/>
		<div class="bar">
			<mdui-button variant="tonal" @click="router.replace('/register')">注册</mdui-button>
			<div style="flex-grow: 1;"/>
			<mdui-button @click="login()" :loading="isLogging">登录</mdui-button>
		</div>
	</mdui-card>
</template>

<style scope>
.container {
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 300px;	
}
.avatar {
	width: 100px;
	height: 100px;
	object-fit: cover;
	margin-bottom: 20px;
}
.title {
	font-size: 1.6rem;
	font-weight: bold;
	color: rgb(var(--mdui-color-on-surface));
}

</style>
