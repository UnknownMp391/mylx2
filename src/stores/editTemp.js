import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useEditTemp = defineStore('editTemp', () => {
	// 定义响应式状态
	const title = ref('')
	const content = ref('')

	// 返回状态和方法
	return { title, content }
})
