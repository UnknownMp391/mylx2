<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'

import { confirm } from 'mdui/functions/confirm.js'
import 'mdui/components/divider.js';
import 'mdui/components/linear-progress.js';
import 'mdui/components/card.js'
import 'mdui/components/button.js'
import 'mdui/components/text-field.js';
import 'mdui/components/button-icon.js';
import 'mdui/components/menu.js';
import 'mdui/components/menu-item.js';
import 'mdui/components/dropdown.js';
import '@mdui/icons/arrow-forward.js';

import { mduiSnackbar, mduiAlert, escapeAndFormatText, getQueryVariable, formatUnixTimestamp } from '@/utils.js'
import { useApiStore } from '@/stores/api.js'
const api = useApiStore()

import AccountBar from '@/components/AccountBar.vue'

const router = useRouter()

const emoji = [
	'👍',
	'👎',
	'😱',
	'😋',
]

const isLoaded = ref(false)
const isCommentLoaded = ref(false)
const isCommenting = ref(false)
const authorAvatarUrl = ref('')
const authorName = ref('')
const authorId = ref(0)
const createdAt = ref(0)
const content = ref('')
const title = ref('')

const comment = ref('')
const comments = ref([])
const lastComment = ref(0)
const moreComment = ref(true)

const postId = getQueryVariable('postId')

async function onComment() {
	if ( comment.value == '' ) { return }
	isCommenting.value = true
	const result = await api.putComment(postId, comment.value)
	if ( result.code == 1 && result.status == 1 ) {
		mduiSnackbar('发布成功')
		comments.value.splice(0, 0, {
			commentId: result.commentId,
			content: comment.value,
			userInfo: api.config.accountInfo,
			avatar: `${api.config.ossEndpoint}/${api.config.accountInfo.avatar || api.config.defaultAvatarID}`
		})
		comment.value = ''
	} else {
		mduiAlert("错误",`${result.code} ${result.status}`)
	}
	isCommenting.value = false
}

async function loadComment() {
	const comment = await api.getComment(postId, api.config.postCommentPerLoad, lastComment.value)
	if (comment.code == 1 && comment.status == 1) {
		lastComment.value = comment.last
		moreComment.value = comment.more
		comment.comments.forEach((comment) => {
			if ( comment.userInfo.avatar ) {
				comment.avatar = `${api.config.ossEndpoint}/${comment.userInfo.avatar}`
			} else {
				comment.avatar = `${api.config.ossEndpoint}/${api.config.defaultAvatarID}`
			}
			comments.value.push(comment);
		})
	} else {
		mduiAlert("错误",`${comment.code} ${comment.status}`)
	}
}

async function onCommentDelete(index, commentId) {
	confirm({
		headline: "警告!",
		description: `你确定要删除这条评论吗?`,
		confirmText: "删掉",
		cancelText: "算了",
		closeOnOverlayClick: true,
		closeOnEsc: true,
		onConfirm: async () => {
			const result = await api.deleteComment(commentId)
			if ( result.code == 1 && result.status == 1 ) {
				mduiSnackbar("删除成功")
				comments.value.splice(index, 1)
			}
		}
	});

}

onMounted(async () => {
	if (postId) {
		const post = await api.getPostDetail(postId)
		if (post.code == 1 && post.status == 1) {
			content.value = post.content
			title.value = post.title
			authorName.value = post.authorInfo.nickName
			authorId.value = post.authorInfo.userId
			createdAt.value = post.createdAt
			if ( post.authorInfo.avatar ) {
				authorAvatarUrl.value = `${api.config.ossEndpoint}/${post.authorInfo.avatar}`
			} else {
				authorAvatarUrl.value = `${api.config.ossEndpoint}/${api.config.defaultAvatarID}`
			}
			isLoaded.value = true
			await loadComment()
			isCommentLoaded.value = true
		} else {
			if (post.status) {
				mduiAlert("找不到文章",`文章ID: ${postId} 请检查链接是不是没复制完全?`,() => router.replace('/'))
			} else {
				mduiAlert("错误",`${post.code} ${post.status}`)
			}
		}
	} else {
		mduiAlert("错误","未提供postID参数",() => router.replace(''))
	}
})

</script>

<template>
	<div v-if="isLoaded">
		<div v-if="title" style="font-size: 2em; margin: 10px"><strong>{{ title }}</strong></div>
		<mdui-divider v-if="title"></mdui-divider>
		<AccountBar :avatarUrl="authorAvatarUrl" :name="authorName" @click="router.push(`/user?userId=${authorId}`)"/>
		<div class="typescale-label-small" style="margin: 6px 10px 10px; color: rgb(var(--mdui-color-on-surface-variant));">{{ formatUnixTimestamp(createdAt) }}</div>
		<mdui-divider></mdui-divider>
		<div style="text-indent: 0em; margin: 10px;">
			<div style="white-space: pre-wrap;" v-html="content"></div>
		</div><br/>
		<mdui-card v-if="api.config.isLogin">
			<mdui-text-field v-model="comment" autosize min-rows="1" max-rows="4" label="来条评论吧😋" maxlength="500" counter :disabled="isCommenting"></mdui-text-field>
			<div class="bar" style="margin: 10px 0px;">
				<div v-for="item in emoji">
					<mdui-button-icon @mousedown.prevent="comment += item">{{ item }}</mdui-button-icon>
				</div>
				<div style="flex-grow: 1;" />
				<mdui-button :loading="isCommenting" :disabled='!comment' @click="onComment()">
					<mdui-icon-arrow-forward slot="end-icon"></mdui-icon-arrow-forward>
					发布
				</mdui-button>
			</div>
		</mdui-card>
		<div v-if="isCommentLoaded">
			<div v-for="(item, index) in comments" :key="item.commentId">
				<mdui-dropdown trigger="contextmenu">
					<mdui-card slot="trigger">
						<div v-if="item.title" style="font-size: 2em; margin: 10px"><strong>{{ item.title }}</strong></div>
						<AccountBar :avatarUrl="item.avatar" :name="escapeAndFormatText(item.userInfo.nickName)" @click="router.push(`/user?userId=${item.userInfo.userId}`)" />
						<div style="text-indent: 0em; margin: 10px;">
							<div style="white-space: pre-wrap;" v-html="escapeAndFormatText(item.content)"></div>
						</div>
					</mdui-card>
					<mdui-menu>
						<mdui-menu-item v-if="item.userInfo.userId == api.accountInfo.userId || authorId == api.accountInfo.userId" @click="onCommentDelete(index, item.commentId)">删除评论</mdui-menu-item>
						<mdui-menu-item>回复</mdui-menu-item>
					</mdui-menu>
				</mdui-dropdown>
			</div>
		</div><div v-else class="load-progress">
			评论加载中
			<mdui-linear-progress></mdui-linear-progress>
		</div>
	</div><div v-else class="load-progress">
		加载中
		<mdui-linear-progress></mdui-linear-progress>
	</div>
</template>


<style scope>

</style>
