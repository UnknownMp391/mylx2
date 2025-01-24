import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import { setTheme } from 'mdui/functions/setTheme.js'
import { setColorScheme } from 'mdui/functions/setColorScheme.js'
import { useAppSettingsStore } from '@/stores/appSettings.js'

export const useThemeStore = defineStore('homePage', () => {
	const appSettings = useAppSettingsStore()
	const mode = ref('auto')
	// 定义响应式状态
	if (appSettings.autoDarkMode) {
		mode.value = 'auto'
	} else {
		if (appSettings.darkMode) {
			mode.value = 'dark'
		} else {
			mode.value = 'light'
		}
	}
	const color = ref('#7F3C5C70') // 默认颜色

	// 定义 actions
	function setMode(target) {
		if (mode.value != target) {
			mode.value = target
		}
		setTheme(mode.value)
	}

	function switchMode(callback) {
		if (mode.value === 'auto' || mode.value === 'light') {
			mode.value = 'dark'
		} else {
			mode.value = 'light'
		}
		setMode(mode.value)
		if (callback) {
			callback(mode.value)
		}
	}

	function applyTheme() {
		setColorScheme(color.value)
		setTheme(mode.value)
	}

	// 返回状态和方法
	return { mode, color, setMode, switchMode, applyTheme }
})
