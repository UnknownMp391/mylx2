<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

import 'mdui/components/top-app-bar.js'
import 'mdui/components/top-app-bar-title.js'
import 'mdui/components/button-icon.js'

import '@mdui/icons/arrow-back.js';

import '@mdui/icons/light-mode.js'

import { mduiSnackbar } from '@/utils.js'

import { useThemeStore } from '@/stores/themeScheme.js'
import { useApiStore } from '@/stores/api.js'
const api = useApiStore()

const themeScheme = useThemeStore()


function switchTheme() {
	themeScheme.switchMode((mode) => {
		if (mode == 'dark') {
			mduiSnackbar('启用黑暗模式')
		} else {
			mduiSnackbar('禁用黑暗模式')
		}
	})
}

onMounted(async () => {
	themeScheme.applyTheme()
	await api.init()
})

</script>

<template>
	<header></header>
	<main class="smooth-mode-switch">
		<mdui-top-app-bar class="top-bar" style="background-color: rgb(var(--mdui-color-primary-container));" scroll-behavior="shrink elevate">
			<mdui-button-icon @click="$router.back()">
				<mdui-icon-arrow-back></mdui-icon-arrow-back>
			</mdui-button-icon>
			<img class="responsive-image" src="/favicon.png" @click="$router.push('/')"/>
			<mdui-top-app-bar-title style="color: rgb(var(--mdui-color-on-surface-variant))"><strong>墨宇留香</strong></mdui-top-app-bar-title>
			<div style="flex-grow: 1"></div>
			<mdui-button-icon @click="switchTheme()">
				<mdui-icon-light-mode class="child" style="color: rgb(var(--mdui-color-on-surface-variant))"></mdui-icon-light-mode>
			</mdui-button-icon>
		</mdui-top-app-bar>
		<RouterView />
	</main>
	<footer></footer>
</template>

<style scope>

main {
	height: 100%;
	margin: 0;
	display: flex;
	flex-direction: column;
}

</style>

