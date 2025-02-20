<template>
  <view class="container">
    <!-- 摇骰子按钮 -->
    <button class="shake-btn" @click="startShake">摇！</button>

    <!-- 骰子容器 -->
    <view class="dice-container">
      <!-- 骰子杯 -->
      <view 
        class="dice-cup" 
        :class="{ shaking: isShaking }"
        :style="{ transform: `translateX(-50%) translateY(${slideY}rpx)` }"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      >
        <view class="cup-body">
          <view class="cup-hole"></view>
          <!-- 提示文字 -->
          <view class="hint-text" :class="{ close: isOpen }">
            {{ isOpen ? '↓ 向下滑动关闭' : '↑ 向上滑动打开' }}
          </view>
        </view>
      </view>

      <!-- 底部圆盘 -->
      <view class="dice-plate">
        <!-- 骰子列表 -->
        <view class="dice-list" :style="{ opacity: diceOpacity }">
          <view v-for="(dice, index) in dices" 
                :key="index" 
                class="dice"
                :style="diceStyles[index]"
          >
            <!-- 六个面 -->
            <view class="dice-face front">
              <view class="dot-container">
                <view v-for="n in 9" :key="n" 
                      class="dot" 
                      :class="{ active: isDotActive(dice, n) }"
                ></view>
              </view>
            </view>
            <view class="dice-face back"></view>
            <view class="dice-face right"></view>
            <view class="dice-face left"></view>
            <view class="dice-face top"></view>
            <view class="dice-face bottom"></view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// 使用 npm 包代替本地文件
import { Engine, World, Bodies } from 'matter-js'

export default {
  data() {
    return {
      isShaking: false,
      isOpen: false,
      diceOpacity: 0,
      dices: [1, 1, 1, 1, 1],
      touchStartY: 0,
      currentY: 0,
      slideY: 0,
      diceStyles: Array(5).fill().map(() => ({
        transform: 'rotate3d(0, 0, 0, 0deg)',
        transition: 'transform 0.3s'
      }))
    }
  },
  methods: {
    async startShake() {
      if (this.isShaking) return
      
      // 1. 开始摇动
      this.isShaking = true
      this.isOpen = false
      this.diceOpacity = 0
      this.slideY = 0
      
      // 2. 持续1秒
      await new Promise(resolve => setTimeout(resolve, 1000))
      this.isShaking = false
      
      // 3. 生成新的骰子点数
      this.dices = Array(5).fill().map(() => Math.ceil(Math.random() * 6))
      
      // 4. 自动向上滑动打开（修改目标值为-240）
      this.animateSlide(-240)  // 恢复为-240
    },
    
    handleTouchStart(e) {
      if (this.isShaking) return
      this.touchStartY = e.touches[0].clientY
      this.currentY = this.slideY
    },
    
    handleTouchMove(e) {
      if (this.isShaking) return
      const deltaY = e.touches[0].clientY - this.touchStartY
      
      // 限制滑动范围
      let newY = this.currentY + deltaY
      newY = Math.max(-240, Math.min(0, newY))  // 恢复为-240
      
      this.slideY = newY
      this.diceOpacity = Math.abs(newY) / 240  // 恢复为240
      
      // 根据滑动位置更新骰子的3D旋转
      this.updateDiceRotation(newY)
    },
    
    handleTouchEnd() {
      if (this.isShaking) return
      
      // 根据位置决定开合状态（修改判断条件为-120）
      if (this.slideY > -120) {  // 恢复为-120
        this.animateSlide(0)
      } else {
        this.animateSlide(-240)  // 恢复为-240
      }
    },
    
    animateSlide(target) {
      this.slideY = target
      this.isOpen = target === -240  // 恢复为-240
      this.diceOpacity = Math.abs(target) / 240  // 恢复为240
      
      // 更新骰子旋转
      this.updateDiceRotation(target)
    },
    
    updateDiceRotation(slideY) {
      const progress = Math.abs(slideY) / 240  // 恢复为240
      this.diceStyles = this.diceStyles.map((_, index) => ({
        transform: `rotate3d(
          ${Math.sin(index * 1.2)}, 
          ${Math.cos(index * 1.2)}, 
          1, 
          ${progress * 360}deg
        )`,
        transition: 'transform 0.3s'
      }))
    },
    
    isDotActive(number, position) {
      const dotMap = {
        1: [5],
        2: [1, 9],
        3: [1, 5, 9],
        4: [1, 3, 7, 9],
        5: [1, 3, 5, 7, 9],
        6: [1, 3, 4, 6, 7, 9]
      }
      return dotMap[number]?.includes(position) || false
    },

    createPhysics() {
      const engine = Engine.create()
      const world = engine.world
      
      // 创建物理边界
      World.add(world, [
        Bodies.rectangle(200, 610, 400, 20, { isStatic: true }),
        // ...其他边界
      ])
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  background: linear-gradient(180deg, #F6F7FF, #EDEFFF);
  padding: 40rpx 0 80rpx;
}

.shake-btn {
  margin-bottom: 100rpx;
  padding: 24rpx 60rpx;
  font-size: 36rpx;
  background: linear-gradient(145deg, #6C8CD5, #4A6CD4);
  border: none;
  border-radius: 50rpx;
  color: white;
  box-shadow: 0 8rpx 24rpx rgba(76,108,212,0.3);
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  font-weight: 500;
}

.shake-btn:active {
  transform: scale(0.96);
  box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.1);
}

.dice-container {
  position: relative;
  width: 560rpx;
  height: 640rpx;
  perspective: 1000px;
  margin-top: 80rpx;
}

.dice-cup {
  position: absolute;
  top: 60rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 400rpx;
  height: 500rpx;
}

.dice-cup.shaking {
  animation: shake 0.15s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
}

.dice-plate {
  position: absolute;
  bottom: 60rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 480rpx;
  height: 20rpx;
  background: linear-gradient(145deg, #5A7CE4, #4A6CD4);
  border-radius: 50%;
  box-shadow: 
    0 10rpx 30rpx rgba(0,0,0,0.3),
    inset 0 2rpx 10rpx rgba(255,255,255,0.2);
}

.dice {
  width: 88rpx;
  height: 88rpx;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.3s;
}

.dice .dice-face {
  position: absolute;
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 16rpx;
  box-shadow: 
    inset 0 0 15rpx rgba(0,0,0,0.1),
    0 0 5rpx rgba(0,0,0,0.2);
}

.dice .front {
  transform: translateZ(44rpx);
}

.dice .back {
  transform: rotateY(180deg) translateZ(44rpx);
}

.dice .right {
  transform: rotateY(90deg) translateZ(44rpx);
}

.dice .left {
  transform: rotateY(-90deg) translateZ(44rpx);
}

.dice .top {
  transform: rotateX(90deg) translateZ(44rpx);
}

.dice .bottom {
  transform: rotateX(-90deg) translateZ(44rpx);
}

.dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: transparent;
  
  &.active {
    background: linear-gradient(145deg, #ff4444, #ff0000);
    box-shadow: 0 0 5rpx rgba(255,0,0,0.3);
  }
}

/* 修改摇动动画，只使用旋转，不使用位移 */
@keyframes shake {
  0% { transform: translateX(-50%) rotate(-5deg); }
  33% { transform: translateX(-50%) rotate(5deg); }
  66% { transform: translateX(-50%) rotate(-3deg); }
  100% { transform: translateX(-50%) rotate(0deg); }
}

/* 修改骰子杯的样式，确保和底部圆盘对齐 */
.cup-body {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(145deg, #6C8CD5, #4A6CD4);
  border-radius: 40rpx 40rpx 0 0; /* 修改底部为直角 */
  transform: perspective(1000px) rotateX(10deg);
  box-shadow: 
    inset 0 10rpx 30rpx rgba(255,255,255,0.3),
    0 10rpx 20rpx rgba(0,0,0,0.2);
  
  &::before {
    content: '';
    position: absolute;
    top: -20rpx;
    left: 0;
    width: 100%;
    height: 40rpx;
    background: linear-gradient(145deg, #7C9CE5, #5A7CE4);
    border-radius: 20rpx;
  }
}

.cup-hole {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 240rpx;
  height: 280rpx;
  background: #2A4CD4;
  border-radius: 120rpx;
  opacity: 0.8;
}

/* 添加骰子点样式 */
.dot-container {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  padding: 8rpx;
  gap: 2rpx;
}

/* 新增提示文字样式 */
.hint-text {
  position: absolute;
  bottom: 20rpx;
  left: 50%;
  transform: translateX(-50%);
  font-size: 24rpx;
  color: rgba(255,255,255,0.9);
  background: rgba(74,108,212,0.7);
  padding: 8rpx;
  border-radius: 30rpx;
  transition: all 0.3s;
}

.hint-text.close {
  background: rgba(255,255,255,0.9);
  color: rgba(74,108,212,0.8);
}

.dice-list {
  position: absolute;
  bottom: 40rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  display: flex;
  justify-content: space-around;
  transition: opacity 0.3s;
}
</style>
