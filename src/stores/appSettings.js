import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

//import axios from 'axios'
//import {  } from '@/utils.js'

export const useAppSettingsStore = defineStore('appSettings', () => {
	const settingsKey = 'appSettings'
	var defaultSettings = {
		showFab: true,
		darkMode: false,
		autoDarkMode: true,
	}
	var settings = { ...defaultSettings }
	const settingsStored = localStorage.getItem(settingsKey)
	if ( settingsStored ) {
		try {
			const parsedData = JSON.parse(settingsStored)
			settings = { ...settings, ...parsedData }
		} catch {
		}
	}
	const showFab = ref(settings.showFab)
	const darkMode = ref(settings.darkMode)
	const autoDarkMode = ref(settings.autoDarkMode)
	const changed = ref(false)
	function apply() {
		changed.value = false
		settings.showFab = showFab.value
		settings.darkMode = darkMode.value
		settings.autoDarkMode = autoDarkMode.value
		localStorage.setItem(settingsKey,JSON.stringify(settings))
	}
	apply()
	return {
		showFab,
		darkMode,
		autoDarkMode,
		apply,
	}
})
