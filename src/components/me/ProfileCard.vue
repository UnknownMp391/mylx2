<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'

import 'mdui/components/card.js';
import 'mdui/components/circular-progress.js';

const router = useRouter()

const props = defineProps({
	name: String,
	avatarUrl: String,
	loading: Boolean,
});

onMounted(async () => {
})
</script>

<template>
	<mdui-card style="padding: 10px; width: 100%;">
		<div class="profile-container">
			<div v-if="props.loading">
				<mdui-circular-progress></mdui-circular-progress>
			</div><div v-else>
				<img class="avatar" :src="props.avatarUrl" alt="头像">
				<div class="nickname">{{ props.name }}</div>
			</div>
		</div>
	</mdui-card>
</template>

<style scope>

.profile-container {
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 200px;	
}
.avatar {
	width: 100px;
	height: 100px;
	border-radius: 50%;
	object-fit: cover;
	margin-bottom: 20px;
}
.nickname {
	font-size: 1.6rem;
	font-weight: bold;
	color: rgb(var(--mdui-color-on-surface));
}
</style>
