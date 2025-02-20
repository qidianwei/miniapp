<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	/* 全局样式 */
	body.popup-open {
		overflow: hidden;
		position: fixed;
		width: 100%;
		height: 100%;
	}

	/* 添加全局页面样式 */
	page {
		height: 100%;
		overflow: hidden !important;
	}

	/* 确保容器样式 */
	.container {
		box-sizing: border-box;
		width: 100%;
		max-width: 600px;
		margin: 0 auto;
		padding: 0 10px;
		min-height: 100vh;
		overflow-x: hidden;
	}

	/* 隐藏所有滚动条 (仅保留Webkit方案) */
	::-webkit-scrollbar {
		display: none;
		width: 0;
		height: 0;
		background: transparent;
	}
</style>
