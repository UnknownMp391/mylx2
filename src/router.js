import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'Home',
			component: () => import('./views/HomeView.vue')
		},
		{
			path: '/login',
			name: 'AccountLogin',
			component: () => import('./views/Login.vue')
		},
		{
			path: '/register',
			name: 'AccountRegister',
			component: () => import('./views/Register.vue')
		},
		{
			path: '/post/new',
			name: 'PostNew',
			component: () => import('./views/PostNew.vue')
		},
		{
			path: '/post',
			name: 'PostDetail',
			component: () => import('./views/Post.vue')
		},
		{
			path: '/post/account',
			name: 'AccountPost',
			component: () => import('./views/AccountPost.vue')
		},
		{
			path: '/user',
			name: 'User',
			component: () => import('./views/User.vue')
		},
		{
			path: '/account/profile',
			name: 'Profile',
			component: () => import('./views/Profile.vue')
		},
		{
			path: '/:catchAll(.*)',
			component: () => import('./views/NotFound.vue'),
			meta: {
				title: "页面未找到"
			}
		}
	]
})

export default router
