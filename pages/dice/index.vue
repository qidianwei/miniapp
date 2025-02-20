<template>
  <view class="container">
    <view class="cube" :animation="animationData">
      <!-- 前面：1点 -->
      <view class="face front">
        <view class="dot center"></view>
      </view>
      <!-- 后面：6点 -->
      <view class="face back">
        <view class="column">
          <view class="dot"></view>
          <view class="dot"></view>
          <view class="dot"></view>
        </view>
        <view class="column">
          <view class="dot"></view>
          <view class="dot"></view>
          <view class="dot"></view>
        </view>
      </view>
      <!-- 右面：3点 -->
      <view class="face right">
        <view class="dot top-left"></view>
        <view class="dot center"></view>
        <view class="dot bottom-right"></view>
      </view>
      <!-- 左面：4点 -->
      <view class="face left">
        <view class="dot top-left"></view>
        <view class="dot top-right"></view>
        <view class="dot bottom-left"></view>
        <view class="dot bottom-right"></view>
      </view>
      <!-- 顶面：2点 -->
      <view class="face top">
        <view class="dot top-left"></view>
        <view class="dot bottom-right"></view>
      </view>
      <!-- 底面：5点 -->
      <view class="face bottom">
        <view class="dot top-left"></view>
        <view class="dot top-right"></view>
        <view class="dot center"></view>
        <view class="dot bottom-left"></view>
        <view class="dot bottom-right"></view>
      </view>
    </view>
    <button class="control-button" @click="startRoll">
      {{ isRolling ? '旋转中...' : '开始旋转' }}
    </button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isRolling: false,
      result: null,
      animationData: null,
      timer: null
    };
  },
  methods: {
    startRoll() {
      if (this.isRolling) return;
      
      this.isRolling = true;
      this.result = null;

      // 立即调用 calculateResult 开始旋转
      this.calculateResult();

      // 5秒后停止旋转并显示结果
      this.timer = setTimeout(() => {
        this.isRolling = false;
      }, 2000);
    },
    calculateResult() {
      const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];
      const randomIndex = Math.floor(Math.random() * faces.length);
      this.result = faces[randomIndex];

      // 创建动画实例，设置5秒的旋转
      const animation = wx.createAnimation({
        duration: 1000,
        timingFunction: 'ease-out',
        delay: 0
      });

      // 生成随机旋转角度
      const x = Math.random() * 3600; // 0到3600度
      const y = Math.random() * 3600; // 0到3600度
      const z = Math.random() * 3600; // 0到3600度

      // 设置旋转动画
      animation.rotateX(x).rotateY(y).rotateZ(z).step();

      // 应用动画
      this.animationData = animation.export();

      // 在5秒后调整到最终角度
      setTimeout(() => {
        const finalAnimation = wx.createAnimation({
          duration: 1000, // 1秒的调整时间
          timingFunction: 'ease-out',
          delay: 0
        });

        // 根据结果调整最终角度
        switch (this.result) {
          case 'front':
            finalAnimation.rotateX(0).rotateY(0).rotateZ(0).step();
            break;
          case 'back':
            finalAnimation.rotateX(0).rotateY(180).rotateZ(0).step();
            break;
          case 'right':
            finalAnimation.rotateX(0).rotateY(90).rotateZ(0).step();
            break;
          case 'left':
            finalAnimation.rotateX(0).rotateY(-90).rotateZ(0).step();
            break;
          case 'top':
            finalAnimation.rotateX(90).rotateY(0).rotateZ(0).step();
            break;
          case 'bottom':
            finalAnimation.rotateX(-90).rotateY(0).rotateZ(0).step();
            break;
        }

        // 应用最终动画
        this.animationData = finalAnimation.export();
      }, 1000);
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  perspective: 1500px;
  background-color: #f0f0f0;
}

.cube {
  position: relative;
  width: 200px;
  height: 200px;
  transform-style: preserve-3d;
}

.face {
  position: absolute;
  width: 200px;
  height: 200px;
  border: 2px solid #333;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40px;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  padding: 15px;
  backface-visibility: hidden;
  box-sizing: border-box;
}

/* 调整面位置 */
.front { transform: translateZ(100px); }       /* 前面：1点 */
.back { transform: translateZ(-100px) rotateY(180deg); } /* 后面：6点 */
.right { transform: translateX(100px) rotateY(90deg); }  /* 右面：3点 */
.left { transform: translateX(-100px) rotateY(-90deg); } /* 左面：4点 */
.top { transform: translateY(-100px) rotateX(90deg); }   /* 顶面：2点 */
.bottom { transform: translateY(100px) rotateX(-90deg); } /* 底面：5点 */

/* 添加控制按钮样式 */
.control-button {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.control-button:hover {
  background-color: #45a049;
}

.dot {
  width: 24px;
  height: 24px;
  background-color: #333;
  border-radius: 50%;
  margin: 4px;
}

.center {
  align-self: center;
  justify-self: center;
}

.top-left { align-self: flex-start; justify-self: flex-start; }
.top-right { align-self: flex-start; justify-self: flex-end; }
.bottom-left { align-self: flex-end; justify-self: flex-start; }
.bottom-right { align-self: flex-end; justify-self: flex-end; }

.bottom {
  display: flex;
  justify-content: space-between;
  gap: 30px;
}
.column {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
}

/* 优化5点面布局 */
.face.bottom {
  padding: 20px; /* 增加内边距 */
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
}

.face.bottom .dot {
  margin: 0; /* 移除默认margin */
}

.face.bottom .top-left {
  grid-column: 1;
  grid-row: 1;
}

.face.bottom .top-right {
  grid-column: 3;
  grid-row: 1;
}

.face.bottom .center {
  grid-column: 2;
  grid-row: 2;
}

.face.bottom .bottom-left {
  grid-column: 1;
  grid-row: 3;
}

.face.bottom .bottom-right {
  grid-column: 3;
  grid-row: 3;
}

/* 优化2点面布局 */
.face.top {
  padding: 20px; /* 增加内边距 */
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
}

.face.top .dot {
  margin: 0;
}

.face.top .top-left {
  grid-column: 1;
  grid-row: 1;
}

.face.top .bottom-right {
  grid-column: 2;
  grid-row: 2;
}

/* 优化4点面布局 */
.face.left {
  padding: 20px; /* 增加内边距 */
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
}

.face.left .dot {
  margin: 0; /* 移除默认margin */
}

.face.left .top-left {
  grid-column: 1;
  grid-row: 1;
}

.face.left .top-right {
  grid-column: 2;
  grid-row: 1;
}

.face.left .bottom-left {
  grid-column: 1;
  grid-row: 2;
}

.face.left .bottom-right {
  grid-column: 2;
  grid-row: 2;
}

/* 优化6点面布局 */
.face.back {
  padding: 20px; /* 增加内边距 */
  display: flex;
  justify-content: space-between;
  gap: 30px;
}

.face.back .dot {
  margin: 0; /* 移除默认margin */
}
</style>