<script setup>
import { ref, onMounted, defineAsyncComponent, nextTick, onActivated } from 'vue'
import { useRouter, onBeforeRouteUpdate } from 'vue-router'

import { confirm } from 'mdui/functions/confirm.js';
import 'mdui/components/card.js';
import 'mdui/components/linear-progress.js';
import 'mdui/components/divider.js';
import 'mdui/components/button.js';
import 'mdui/components/dropdown.js';
import 'mdui/components/menu.js';
import 'mdui/components/menu-item.js';

import '@mdui/icons/history.js';
import '@mdui/icons/bookmarks.js';
import '@mdui/icons/favorite.js'
import '@mdui/icons/edit.js';
import '@mdui/icons/auto-awesome-motion.js';
import '@mdui/icons/comment.js';
import '@mdui/icons/dashboard.js';
import '@mdui/icons/logout.js';

import { mduiSnackbar, mduiAlert } from '@/utils.js'
import ProfileCard from '../me/ProfileCard.vue'
import AboutProject from '@/components/project/AboutProject.vue'
import { useHomePageStore } from '@/stores/homePage.js'
import { useApiStore } from '@/stores/api.js'
const api = useApiStore()
const router = useRouter()
const homePage = useHomePageStore()

const isLoaded = ref(false)
var nickName = ref('')
const avatarUrl = ref('/favicon.png')
const showAccountCard = ref(false)

function redirectLogin() {
	if(isLoaded && !api.isLogin) {
		router.push('/login')
	}
}

async function logout() {
	confirm({
		headline: "确认",
		description: "你确定要退出登录吗",
		confirmText: "退!",
		cancelText: "算了",
		closeOnOverlayClick: true,
		closeOnEsc: true,
		onConfirm: async () => {
			const result = await api.accountLogout()
			if (result.code == 1) {
				mduiSnackbar('退出成功')
				router.replace({ path: '/' });
				api.reInit()
				loadProfile()
			}
		}
	});
}

async function loadProfile() {
	isLoaded.value = false
	showAccountCard.value = api.isLogin
	if (api.isLogin) {
		if (api.accountInfo.avatar) {
			avatarUrl.value = `${api.config.ossEndpoint}/${api.config.accountInfo.avatar}`
		} else {
			avatarUrl.value = `${api.config.ossEndpoint}/${api.config.defaultAvatarID}`
		}
		nickName.value = api.config.accountInfo.nickName
	} else {
		nickName.value = "点击登录"
		avatarUrl.value = `${api.config.ossEndpoint}/${api.config.defaultAvatarID}`
	}
	isLoaded.value = true
}

onMounted(async () => {
	await api.init()
	await loadProfile()
	nextTick(async () => {
		window.scrollTo(0, 0)
	})
})

</script>

<template>
	<ProfileCard :name="nickName" :avatarUrl="avatarUrl" :loading="!isLoaded" @click="redirectLogin()"/>
	<div v-if="showAccountCard">
		<mdui-card style="margin: 0px" class="rendered-card">
			<!--<p><span style="font-size: 1.5em"><strong>喜欢,收藏</strong></span></p>-->
			<div class="toolbar">
				<div class="toolitem">
					<mdui-icon-favorite></mdui-icon-favorite>
					<br/>我的喜欢
				</div>
				<div class="toolitem">
					<mdui-icon-history></mdui-icon-history>
					<br/>历史游览
				</div>
				<div class="toolitem">
					<mdui-icon-bookmarks></mdui-icon-bookmarks>
					<br/>我的收藏
				</div>
			</div>
			<mdui-divider style="margin: 10px"></mdui-divider>
			<div class="toolbar">
				<div class="toolitem" @click="router.push('/post/new')">
					<mdui-icon-edit></mdui-icon-edit>
					<br/>立即创作
				</div>
				<div class="toolitem" @click="router.push('/post/account')">
					<mdui-icon-dashboard></mdui-icon-dashboard>
					<br/>我的文章
				</div>
				<div class="toolitem">
					<mdui-icon-auto-awesome-motion></mdui-icon-auto-awesome-motion>
					<br/>我的合集
				</div>
			</div>
		</mdui-card>
		<mdui-card class="rendered-card">
			<p><span style="font-size: 1.5em"><strong>账号管理</strong></span></p>
			<mdui-button class="tool-button" variant="filled" full-width @click="router.push('/account/profile')">个人资料编辑</mdui-button>
			<mdui-divider></mdui-divider>
			<mdui-button class="tool-button" variant="filled" full-width>修改密码</mdui-button>
			<mdui-dropdown trigger="contextmenu">
				<mdui-button slot="trigger" class="tool-button" variant="text" full-width @click="logout">
					<mdui-icon-logout slot="icon"></mdui-icon-logout>
					退出登录
				</mdui-button>
				<mdui-menu>
					<mdui-menu-item @click="mduiAlert('不是老弟','你还真想删除啊?')">删除账号</mdui-menu-item>
				</mdui-menu>
			</mdui-dropdown>
		</mdui-card>
	</div>
	<mdui-card >
		<p><span style="font-size: 1.5em"><strong>关于本 项目 & 站点</strong></span></p>
		<AboutProject />
	</mdui-card>
	<mdui-card>
		<p><span style="font-size: 1.5em"><strong>开发路线 Road Map</strong></span></p>
		<ul class="road-map">
			<li>账号登录<div style="flex: 1;"/>已完成✅</li>
			<li>个人信息页面<div style="flex: 1;"/>已完成✅</li>
			<li>文章发布<div style="flex: 1;"/>已完成✅</li>
			<li>文章查看<div style="flex: 1;"/>已完成✅</li>
			<li>主页推荐<div style="flex: 1;"/>已完成✅</li>
			<li>发布评论<div style="flex: 1;"/>已完成✅</li>
			<li>查看评论<div style="flex: 1;"/>已完成✅</li>
			<li>删除评论<div style="flex: 1;"/>已完成✅</li>
			<li>个人主页<div style="flex: 1;"/>已完成✅</li>
			<li>个人资料编辑<div style="flex: 1;"/>已完成✅</li>
			<li>文章编辑<div style="flex: 1;"/>已计划😋</li>
			<li>合集<div style="flex: 1;"/>已计划😋</li>
			<li>合集主页<div style="flex: 1;"/>已计划😋</li>
			<li>评论编辑<div style="flex: 1;"/>未计划😱</li>
			<li></li>
		</ul>
	</mdui-card>
	<mdui-card>
		<p><span style="font-size: 1.5em"><strong>贡献列表</strong></span></p>
		<p>项目规划: <a target="_blank" href="https://www.unknownmp.lol">UnknownMp</a></p>
		<p>起名: <a target="_blank" href="https://youyutou94776.lofter.com">北海</a></p>
		<p>图片提供: 
			<a target="_blank" href="https://qutamadexuexiao.lofter.com">琪琪</a> (网站图标)
			<a target="_blank" href="https://youyutou94776.lofter.com">北海</a> (默认用户头像)
		</p>
		<p>其他贡献者:</p>
		<ul>
			<li><a target="_blank" href="https://songtang02582.lofter.com">锤子</a></li>
			<li><a target="_blank" href="https://xinjinjumin386390323485.lofter.com">怜晨</a></li>
			<li><a target="_blank" href="https://qin6151702.lofter.com">兮月</a></li>
		</ul>
		还有很多在背后默默支持开发的人
	</mdui-card>
	<div style="display: flex; justify-content: center; margin: 20px 0 0 0;">
		Powered&nbsp;by&nbsp; 
		<a target="_blank" href="https://cn.vuejs.org/">Vue.js</a>&nbsp;&&nbsp;
		<a target="_blank" href="https://www.mdui.org/zh-cn/">MDUI</a>&nbsp;&&nbsp;
		<a target="_blank" href="https://www.locyanfrp.cn">LocyanFrp</a>
	</div>
	<br/><br/><br/><br/><br/><br/>
</template>

<style scope>
.road-map {
	list-style-type: none;
}
.road-map li{
	margin: 10px 0px;
	display: flex;
}
.rendered-card {
	background-color: rgb(var(--mdui-color-secondary-container))
}
</style>
