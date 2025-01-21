<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'

import 'mdui/components/circular-progress.js';
import 'mdui/components/avatar.js';

const router = useRouter()

const props = defineProps({
	name: String,
	avatarUrl: String,
	loading: Boolean,
});

onMounted(async () =>{
})
</script>

<template>
	<div class="account-bar">
		<mdui-avatar :src="props.avatarUrl"></mdui-avatar>
		<div class="name">{{ props.name }}</div>
	</div>
</template>

<style scope>
.account-bar {
	display: flex;
	flex-direction: row;
	align-items: center; /* 确保子元素垂直居中 */
}

.name {
	margin-left: 6px; /* 添加适当的间距 */
}

mdui-avatar {
	margin: 6px;
}
</style>
