<template>
  <view v-if="visible" class="popup-mask">
    <view class="popup-container">
      <view class="popup-content">
        <slot></slot>
      </view>
      <button class="close-button" @click="close">关闭</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)

const open = () => {
  visible.value = true
}

const close = () => {
  visible.value = false
}

defineExpose({
  open,
  close
})
</script>

<style scoped>
.popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  touch-action: none; /* 禁止触摸滚动 */
}

.popup-container {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  width: 80%;
  max-width: 300px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.popup-content {
  margin-bottom: 20px;
}

.close-button {
  width: 100%;
  height: 50px;
  background: #007AFF;
  color: #ffffff;
  border-radius: 12px;
  font: 600 17px/1 "SF Pro Display";
  margin-top: 24px;
  transition: all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

</style> 