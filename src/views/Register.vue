<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import 'mdui/components/card.js'
import 'mdui/components/text-field.js'
import 'mdui/components/button.js'

import { mduiSnackbar, mduiAlert } from '@/utils.js'

const router = useRouter()

const userName = ref('')
const password = ref('')
const isRegistering = ref(false)

async function register() {
	if (isRegistering.value) return
	if (userName.value == '' || password.value == '') {
		mduiAlert('警告', '用户名和密码不能为空')
		return;
	}
	isRegistering.value = true
	const result = await accountRegister(userName.value, password.value)
	isRegistering.value = false
	if (result.status == 1) {
		mduiSnackbar('注册成功')
		setTimeout(() => {
			router.replace("/login")
		}, 800)
	} else {
		mduiAlert('注册失败','未知错误,请联系管理员')
	}
}

onMounted(async () => {
	
})
</script>

<template>
	<div class="container">
		<img class="avatar" src="/favicon.png">
		<div class="title">注册账号</div>
	</div>
	<mdui-card style="padding: 10px; width: 100%;">
		<mdui-text-field label="用户名" type="text" v-model="userName" clearable :disabled="isRegistering"></mdui-text-field><br/><br/>
		<mdui-text-field label="密码" type="password" v-model="password" toggle-password clearable :disabled="isRegistering"></mdui-text-field><br/><br/>
		<div class="bar">
			<mdui-button variant="tonal" @click="router.replace('/login')">登录</mdui-button>
			<div style="flex-grow: 1;"/>
			<mdui-button @click="register()" :loading="isRegistering">注册</mdui-button>
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
.bar {
	display: flex;
	flex-direction: row;
}
</style>
