<template>
  <view class="container">
    <!-- 时间显示 -->
    <view class="time-display">
      <text class="time">{{ formattedTime }}</text>
    </view>

    <!-- 控制按钮 -->
    <view class="button-group">
      <view 
        class="button" 
        :class="{ active: isCounting, disabled: totalSeconds <= 0 }" 
        @click="toggleTimer"
      >
        <text class="button-text">{{ isCounting ? '暂停' : '开始' }}</text>
      </view>
      <view class="button reset" @click="resetTimer">
        <text class="button-text">重置</text>
      </view>
    </view>

    <!-- 时间设置 -->
    <view class="time-picker">
      <picker-view 
        :value="timeSelection" 
        @change="timeChange"
        indicator-style="height: 50px;"
        style="width: 100%; height: 100%;"
      >
        <picker-view-column>
          <view 
            v-for="h in 24" 
            :key="h" 
            class="picker-item"
            :style="h === 1 ? 'color: #ff3b30' : ''"
          >
            {{ h - 1 }}时
          </view>
        </picker-view-column>
        <picker-view-column>
          <view 
            v-for="m in 60" 
            :key="m" 
            class="picker-item"
            :style="m === 1 ? 'color: #ff3b30' : ''"
          >
            {{ m - 1 }}分
          </view>
        </picker-view-column>
        <picker-view-column>
          <view 
            v-for="s in 60" 
            :key="s" 
            class="picker-item"
            :style="s === 1 ? 'color: #ff3b30' : ''"
          >
            {{ s - 1 }}秒
          </view>
        </picker-view-column>
      </picker-view>
    </view>
  </view>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'

const totalSeconds = ref(0)
const isCounting = ref(false)
const timeSelection = ref([0, 0, 0])
const formattedTime = ref('00:00:00')
let timer = null

// 格式化时间显示
const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return [h, m, s]
    .map(v => v.toString().padStart(2, '0'))
    .join(':')
}

// 时间选择变化
const timeChange = (e) => {
  timeSelection.value = e.detail.value
  const [h, m, s] = e.detail.value.map(v => {
    const num = parseInt(v)
    return isNaN(num) ? 0 : num
  })
  totalSeconds.value = h * 3600 + m * 60 + s
  formattedTime.value = formatTime(totalSeconds.value)
}

// 切换计时器状态
const toggleTimer = () => {
  if (totalSeconds.value <= 0) return
  
  isCounting.value = !isCounting.value
  if (isCounting.value) {
    timer = setInterval(() => {
      if (totalSeconds.value > 0) {
        totalSeconds.value--
        formattedTime.value = formatTime(totalSeconds.value)
      } else {
        clearInterval(timer)
        isCounting.value = false
        uni.showToast({
          title: '时间到！',
          icon: 'none'
        })
      }
    }, 1000)
  } else {
    clearInterval(timer)
  }
}

// 重置计时器
const resetTimer = () => {
  clearInterval(timer)
  isCounting.value = false
  totalSeconds.value = 0
  timeSelection.value = [0, 0, 0]
  formattedTime.value = '00:00:00'
}

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.container {
  padding: 30px;
  height: 100vh;
  background-color: #f5f5f7;
}

.time-display {
  background: #fff;
  border-radius: 20px;
  padding: 30px;
  margin: 20px 0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.time {
  font-size: 48px;
  color: #1d1d1f;
  font-family: monospace;
  text-align: center;
  display: block;
}

.button-group {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin: 30px 0;
}

.button {
  background: #007aff;
  border-radius: 25px;
  padding: 15px 30px;
  min-width: 100px;
  text-align: center;
  transition: all 0.2s;
  user-select: none;
}

.button.active {
  background: #34c759;
}

.button.reset {
  background: #ff3b30;
}

.button:active {
  transform: scale(0.95);
}

.button-text {
  color: white;
  font-size: 16px;
  font-weight: 500;
}

.time-picker {
  height: 300px;
  background: #fff;
  border-radius: 20px;
  margin-top: 20px;
  overflow: hidden;
}

.picker-item {
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 18px;
  color: #1d1d1f;
  transition: all 0.2s;
}

.picker-item.selected {
  color: #007aff;
  font-weight: bold;
  transform: scale(1.1);
}

.button.disabled {
  background: #e5e5ea !important;
  opacity: 0.6;
  pointer-events: none;
}
</style> 