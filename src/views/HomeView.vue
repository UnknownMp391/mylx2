<script setup>
import { ref, onMounted, onBeforeUnmount, defineAsyncComponent, nextTick } from 'vue'
import { useRouter } from 'vue-router'

import { observeResize } from '@mdui/shared/helpers/observeResize.js'
import { breakpoint } from 'mdui/functions/breakpoint.js'
//import { throttle } from 'mdui/functions/throttle.js'

import 'mdui/components/navigation-bar.js'
import 'mdui/components/navigation-bar-item.js'
import 'mdui/components/menu.js';
import 'mdui/components/menu-item.js';
import 'mdui/components/dropdown.js';
import 'mdui/components/fab.js';
//import '@mdui/icons/menu.js'
import '@mdui/icons/edit.js';

import '@mdui/icons/home.js'
import '@mdui/icons/home--outlined.js'
import '@mdui/icons/favorite.js'
import '@mdui/icons/favorite-border.js'
import '@mdui/icons/person.js'
import '@mdui/icons/person--outlined.js'

import { getQueryVariable, mduiSnackbar } from '@/utils.js'
import { useApiStore } from '@/stores/api.js'
import { useHomePageStore, useRecommendStore } from '@/stores/homePage.js'
const pages = {
	home: defineAsyncComponent(() => import('../components/home/Recommend.vue')),
	favorite: defineAsyncComponent(() => import('../components/home/Favorite.vue')),
	me: defineAsyncComponent(() => import('../components/home/Me.vue')),
	'null': defineAsyncComponent(() => import('../components/Null.vue'))
}

const router = useRouter()
const api = useApiStore()
const homeDropdown = ref(null)
const fabExtended = ref(false)
const queryVar = getQueryVariable('page')

const recommendStore = useRecommendStore()
const currentPage = useHomePageStore()
const breakpointCondition = breakpoint();
var observer = null;

if (!currentPage.value) {
	currentPage.value = 'home'
}

if (queryVar) {
	currentPage.value = queryVar
	window.history.replaceState(null, null, '/')
}

function switchPage(target) {
	if (target != currentPage.value) {
		currentPage.value = target
	}
}

function refreshRecommends() {
	console.log(recommendStore.recommends)
	recommendStore.recommends = []
	console.log(recommendStore.recommends)
	const temp = currentPage.value
	currentPage.value = 'null'
	nextTick(() => {
		currentPage.value = temp
	})
}

observer = observeResize(document.body, function(entry, observer) {
	fabExtended.value = breakpoint().up('md')
})

onMounted(async () => {
	await api.init()
})

onBeforeUnmount(() => {
	if (observer) observer.unobserve();
})
</script>

<template>
	<div>
		<div class="content">
			<component :is="pages[currentPage.value]"></component>
		</div>
		<mdui-fab class="mdui-fab" v-if="api.isLogin" variant="tertiary" :extended="fabExtended" @click="router.push('/post/new')">立即创作<mdui-icon-edit slot="icon"></mdui-icon-edit></mdui-fab>
		<mdui-navigation-bar class="navigation-bar smooth-mode-switch" v-model="currentPage.value">
			<mdui-navigation-bar-item value="home" @click="switchPage('home')" @contextmenu.prevent="homeDropdown.open = true">	
				<mdui-dropdown ref="homeDropdown" trigger="manual" placement="top-start">
					<div slot="trigger" />
			  		<mdui-menu open-on-pointer>
						<mdui-menu-item @click="refreshRecommends">刷新</mdui-menu-item>
					</mdui-menu>
				</mdui-dropdown>
				<mdui-icon-home slot="active-icon"></mdui-icon-home>
				<mdui-icon-home--outlined slot="icon"></mdui-icon-home--outlined>
				主页
			</mdui-navigation-bar-item>
			<mdui-navigation-bar-item value="favorite" @click="switchPage('favorite')">
				<mdui-icon-favorite slot="active-icon"></mdui-icon-favorite>
				<mdui-icon-favorite-border slot="icon"></mdui-icon-favorite-border>
				订阅
			</mdui-navigation-bar-item>
			<mdui-navigation-bar-item value="me" @click="switchPage('me')">
				<mdui-icon-person slot="active-icon"></mdui-icon-person>
				<mdui-icon-person--outlined slot="icon"></mdui-icon-person--outlined>
				个人
			</mdui-navigation-bar-item>
		</mdui-navigation-bar>
	</div>
</template>

<style scope>

.navigation-bar {
	background-color: rgb(var(--mdui-color-primary-container));
    position: fixed; /* 固定导航栏 */
    width: 100%; /* 水平充满屏幕 */
    z-index: 999; /* 确保导航栏在其他内容上方 */
}

.mdui-fab {
    position: fixed;
    bottom: 90px; /* 调整垂直位置 */
    right: 10px; /* 调整水平位置 */
    z-index: 1000; /* 确保悬浮按钮在其他内容上方 */
}

</style>
