import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

import axios from 'axios'

import { objectToQueryString, getCookie, setCookie } from '@/utils.js'

export const useApiStore = defineStore('api', () => {
	const tokenName = "mylxToken"
	var endpoint = "http://36.50.226.120:10097/"
	if (import.meta.env.MODE === 'development') {
		console.log('开发模式')
		endpoint = "http://10.0.0.2:35501/"
	}
	var inited = false
	var initializing = false
	var token = ''
	const config = ref({})
	const accountInfo = ref({})
	const isLogin = ref(null)
	async function apiGet(url, data) {
		const realURL = data 
			? `${endpoint}${url}?${objectToQueryString(data)}`
			: `${endpoint}${url}`
		const response = await axios.get(realURL, {headers: { token }})
		return response.data
	}
	async function apiPost(url, data) {
		const realURL = `${endpoint}${url}`;
		const response = await axios.post(realURL, data, {
			headers: {
				'Content-Type': 'application/json',
				token
			}
		});
		return response.data;
	}
	async function loadConfig() {
		config.value = await apiGet("config")
	}
	async function init() {
		if (inited) return
		if (initializing) {
			while (initializing) {
				await new Promise((resolve) => setTimeout(resolve, 100))
			}
			return
		}
		initializing = true
		token = getCookie(tokenName)
		if (!token) {
			const resp = await apiGet("token")
			token = resp.token
		}
		await loadConfig()
		isLogin.value = config.value.isLogin
		accountInfo.value = config.value.accountInfo
		setCookie(tokenName, token)
		inited = true
		initializing = false
		console.log(`[MYLX] Token is ${token}`)
		console.log(`[MYLX] OSS endpoint id ${config.value.ossEndpoint}`)
	}
	async function reInit(){
		inited = false
		await init()
	}
	async function getAvatarUrl(avatar) {
		if (avatar) {
			return `${config.value.ossEndpoint}/${avatar}`
		} else {
			return `${config.value.ossEndpoint}/${config.value.defaultAvatarID}`
		}
	}
	async function accountLogin(userName, password) {
		await init();
		var data = { status : 0 }
		try {
			data = await apiPost("account/login", { userName, password })
			if (result.status == 1) {
				isLogin.value = true
				config.value.accountInfo = data.userInfo
				config.value = loadConfig()
			}
			return data
		} catch (error) {
			if (error.response && error.response.status === 401) {
				data.status = 2
			}
		}
		return data
	}
	async function accountLogout() {
		await init();
		var data = {
			status: 0,
			code: 0,
		}
		try {
			const result = await apiPost("account/logout")
			data.status = result.status
			data.code = 1
			if (result.status == 1) {
				isLogin.value = false
				config.value.accountInfo = {}
			}
		} catch (error) {
			if (error.name == 'AxiosError') {
				data.code = 2
				data.status = error.response && error.response.status
			} else {
				throw error
			}
		}
		return data
	}
	async function postNew(content, title, collectionId) {
		await init()
		var data = {
			status: 0,
			code: 0,
		}
		try {
			const result = await apiPost("post/new",{
				title, content, collectionId
			})
			data.status = result.status
			data.code = 1
			if (result.status == 1) {
				data.postId = result.postId
			}
		} catch (error) {
			if (error.name == 'AxiosError') {
				data.code = 2
				data.status = error.response && error.response.status
			} else {
				throw error
			}
		}
		return data
	}
	async function deletePost(postId) {
		await init()
		var data = {
			status: 0,
			code: 0,
		}
		if ( !isLogin.value ) {
			data.code = 3
			return data
		}
		try {
			const result = await apiGet("post/delete",{
				postId
			})
			data.status = result.status
			data.code = 1
		} catch (error) {
			if (error.name == 'AxiosError') {
				data.code = 2
				data.status = error.response && error.response.status
			} else {
				throw error
			}
		}
		return data
	}
	async function deleteComment(commentId) {
		await init()
		var data = {
			status: 0,
			code: 0,
		}
		if ( !isLogin.value ) {
			data.code = 3
			return data
		}
		try {
			const result = await apiGet("comment/delete",{
				commentId
			})
			data.status = result.status
			data.code = 1
		} catch (error) {
			if (error.name == 'AxiosError') {
				data.code = 2
				data.status = error.response && error.response.status
			} else {
				throw error
			}
		}
		return data
	}
	async function getPostDetail(postId) {
		await init()
		var data = {
			status: 0,
			code: 0,
		}
		try {
			const result = await apiGet("post/detail",{
				postId
			})
			data.status = result.status
			data.code = 1
			if (result.status == 1) {
				data.content = result.content
				data.title = result.title
				data.createdAt = result.createdAt
				data.authorInfo = result.authorInfo
			}
		} catch (error) {
			if (error.name == 'AxiosError') {
				data.code = 2
				data.status = error.response && error.response.status
			} else {
				throw error
			}
		}
		return data
	}
	async function getComment(postId, count, last) {
		await init()
		const rdata = last != null 
		    ? { postId, count, last } 
		    : { postId, count }
		var data = {
			status: 0,
			code: 0,
		}
		try {
			const result = await apiGet("comment/1", rdata);
			data.status = result.status
			data.code = 1
			if (result.status == 1) {
				data.comments = result.comments
				data.last = result.last
				data.more = result.more
			}
		} catch (error) {
			if (error.name == 'AxiosError') {
				data.code = 2
				data.status = error.response && error.response.status
			} else {
				throw error
			}
		}
		return data
	}
	async function getRecommend(count, last) {
		await init()
		if ( count === null ) {
			count = config.value.recommendPostPerLoad
		}
		const rdata = last != null 
		    ? { count, last, contentLimit: config.value.recommendContentLimit } 
		    : { count, contentLimit: config.value.recommendContentLimit };
		var data = {
			status: 0,
			code: 0,
		}
		try {
			const result = await apiGet("recommend/1", rdata);
			data.status = result.status	 
			data.code = 1
			if (result.status == 1) {
				data.recommends = result.recommends
				data.last = result.last
				data.more = result.more
			}
		} catch (error) {
			if (error.name == 'AxiosError') {
				data.code = 2
				data.status = error.response && error.response.status
			} else {
				throw error
			}
		}
		return data
	}
	async function getAccountPost(count, last) {
		await init()
		if ( count === null ) {
			count = config.value.myPostPerLoad
		}
		const rdata = last != null 
		    ? { count, last, contentLimit: config.value.myPostContentLimit } 
		    : { count, contentLimit: config.value.myPostContentLimit };
		var data = {
			status: 0,
			code: 0,
		}
		if ( !isLogin.value ) {
			data.code = 3
			return data
		}
		try {
			const result = await apiGet("post/account", rdata);
			data.status = result.status
			data.code = 1
			if (result.status == 1) {
				data.posts = result.posts
				data.last = result.last
				data.more = result.more
			}
		} catch (error) {
			if (error.name == 'AxiosError') {
				data.code = 2
				data.status = error.response && error.response.status
			} else {
				throw error
			}
		}
		return data
	}
	async function putComment(postId, content) {
		await init()
		var data = {
			status: 0,
			code: 0,
		}
		try {
			const result = await apiPost("comment/new", {
				postId, content
			})
			data.status = result.status
			data.code = 1
			if (result.status == 1) {
				data.commentId = result.commentId
			}
		} catch (error) {
			if (error.name == 'AxiosError') {
				data.code = 2
				data.status = error.response && error.response.status
			} else {
				throw error
			}
		}
		return data
	}
	async function getUserInfo(userId, accountCount = false) {
		await init()
		var data = {
			status: 0,
			code: 0,
		}
		try {
			const result = await apiGet("user/info",{
				userId, accountCount
			})
			data.status = result.status
			data.code = 1
			if (result.status == 1) {
				data.userInfo = result.userInfo
				data.userCount = result.userCount
			}
		} catch (error) {
			if (error.name == 'AxiosError') {
				data.code = 2
				data.status = error.response.status
			} else {
				throw error
			}
		}
		return data
	}
	async function getUserPost(userId, count, last) {
		await init()
		if ( count === null ) {
			count = config.value.myPostPerLoad
		}
		const rdata = last != null 
		    ? { userId, count, last, contentLimit: config.value.myPostContentLimit } 
		    : { userId, count, contentLimit: config.value.myPostContentLimit };
		var data = {
			status: 0,
			code: 0,
		}
		try {
			const result = await apiGet("post/user", rdata);
			data.status = result.status
			data.code = 1
			if (result.status == 1) {
				data.posts = result.posts
				data.last = result.last
				data.more = result.more
			}
		} catch (error) {
			if (error.name == 'AxiosError') {
				data.code = 2
				data.status = error.response && error.response.status
			} else {
				throw error
			}
		}
		return data
	}
	async function setAccountProfile(nickName, bio) {
		await init()
		var data = {
			status: 0,
			code: 0,
		}
		if ( !isLogin.value ) {
			data.code = 3
			return data
		}
		try {
			const result = await apiPost("account/profile", {
				nickName, bio
			})
			data.status = result.status
			data.code = 1
			return data
		} catch (error) {
			if (error.name == 'AxiosError') {
				data.code = 2
				data.status = error.response && error.response.status
			} else {
				throw error
			}
		}
		return data
	}
	return {
		config,
		accountInfo,
		isLogin,
		init,
		reInit,
		getAvatarUrl,
		accountLogin,
		accountLogout,
		postNew,
		getPostDetail,
		getRecommend,
		getComment,
		putComment,
		getAccountPost,
		deletePost,
		deleteComment,
		getUserInfo,
		getUserPost,
		setAccountProfile
	}
})
