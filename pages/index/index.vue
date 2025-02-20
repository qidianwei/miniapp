<template>
  <view class="container">
    <scroll-view 
      class="scroll-content" 
      scroll-y 
      :show-scrollbar="false"
    >
      <view class="grid">
        <navigator 
          v-for="(item, index) in features" 
          :key="index" 
          :url="item.path"
          class="card"
        >
          <text class="icon">{{ item.icon }}</text>
          <text class="title">{{ item.title }}</text>
        </navigator>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const features = ref([
  { icon: '🎲', title: '随机骰子', path: '/pages/dice/index' },
  { icon: '🫧', title: '压力泡泡工厂', path: '/pages/stress-bubbles/index' },
  { icon: '🎲', title: '喝酒骰子', path: '/pages/drinking-dice/index' },
  { icon: '🚀', title: '随机大冒险', path: '/pages/adventure/index' },
  { icon: '🔬', title: '人格实验室', path: '/pages/personality-lab/index' },
  { icon: '🧭', title: '指南针', path: '/pages/compass/index' },
  { icon: '🤔', title: '决策抽签', path: '/pages/decision-draw/index' },
  { icon: '💖', title: '随机真心话', path: '/pages/truth/index' },
  { icon: '🧮', title: '计算器', path: '/pages/calculator/index' },
  { icon: '⏱️', title: '计时器', path: '/pages/timer/index' },
  { icon: '📐', title: '单位换算', path: '/pages/converter/index' },
])
</script>
<style scoped>
.container {
  height: 100vh;
  box-sizing: border-box;
}

.scroll-content {
  height: 100%;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  padding: 20px;
  padding-bottom: 40px;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.card:active {
  transform: scale(0.98);
}

.icon {
  font-size: 40px;
  margin-bottom: 10px;
}

.title {
  font-size: 14px;
  color: #333;
}
</style>

