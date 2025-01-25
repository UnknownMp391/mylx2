import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		vue({
			template: {
				compilerOptions: {
					isCustomElement: (tag) => tag.startsWith('mdui')
				}
			}
		}),
		vueJsx(),
		vueDevTools(),
		VitePWA({
			name: '墨宇留香 - 渐进式 Web App 版本',
			short_name: '墨宇留香',
			start_url: '/index.html',
			display: 'standalone',
			"background_color": "#808080",
			"theme_color": "#7F3C5C70",
			"icons": [
				{
					"src": "/favicon.png",
					"sizes": "507x580",
					"type": "image/png"
		}]})
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	},
	build: {
		rollupOptions: {
			output: {
				/*manualChunks(id) {
					if (id.includes('node_modules')) {
						return 'vendor';
					}
				}*/
				manualChunks(id) {
					if (id.includes('node_modules')) {
						const modules = id.toString().split('node_modules/')[1];
						const moduleName = modules.split('/')[0];
						return `vendor/${moduleName}`;
					}
				}
			}
		},
		minify: true,
		assetsInlineLimit: 0,
		reportCompressedSize: false
	},
	server: {
		host: '0.0.0.0'
	},
})
