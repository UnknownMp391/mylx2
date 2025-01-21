import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useHomePageStore = defineStore('homePage', () => {
	page = ref('')
	return { page }
})

export const useHomePageScrollStore = defineStore('homeScroll', () => {
	scroll = ref({})
	function savePosition(key, position) {
		return scroll[key] = position
	}
	function getPosition(key) {
		return scroll[key] || 0
	}
	return { scroll, savePosition, getPosition }
})

export const useRecommendStore = defineStore('recommendData', () => {
	const recommends = ref([])
	const lastRecommend = ref(0)
	const moreRecommend = ref(true)
	return { recommends, lastRecommend, moreRecommend }
})


