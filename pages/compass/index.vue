<template>
  <view class="container">
    <view class="compass">
      <view class="dial" :style="{ transform: `rotate(${-rotation}deg)` }">
        <text class="direction">北</text>
        <text class="direction secondary east">东</text>
        <text class="direction secondary south">南</text>
        <text class="direction secondary west">西</text>
        <view class="pointer"></view>
      </view>
      <view class="degree">{{ formattedDegree }}</view>
    </view>
    <view class="tip">请保持手机水平放置</view>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const rotation = ref(0)
let prevRotation = 0
const formattedDegree = ref('0°')
let compassListener = null

const handleOrientation = (res) => {
  let newRotation = res.direction % 360
  let delta = newRotation - prevRotation
  
  if (Math.abs(delta) > 180) {
    newRotation += delta > 0 ? -360 : 360
  }
  
  prevRotation = newRotation
  rotation.value = newRotation
  formattedDegree.value = `${Math.round(res.direction)}°`
}

onMounted(() => {
  // 微信小程序环境
  if (typeof wx !== 'undefined' && wx.onCompassChange) {
    wx.startCompass()
    compassListener = wx.onCompassChange(handleOrientation)
  } 
  // H5/App环境
  else if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', (e) => {
      if(e.webkitCompassHeading) {
        handleOrientation({ direction: e.webkitCompassHeading })
      } else if(e.alpha) {
        handleOrientation({ direction: 360 - e.alpha })
      }
    }, true)
  } else {
    uni.showToast({
      title: '您的设备不支持指南针',
      icon: 'none'
    })
  }
})

onUnmounted(() => {
  if (compassListener) {
    compassListener.stop()
    wx.stopCompass()
  }
})
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f7;
}

.compass {
  position: relative;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  border: 2px solid #f0f0f0;
  background-image: 
    repeating-conic-gradient(
      transparent 0 5deg,
      #e5e5ea 5deg 5.5deg
    );
}

.dial {
  position: absolute;
  width: 100%;
  height: 100%;
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.direction {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 28px;
  color: #ff3b30;
  font-weight: bold;
  z-index: 1;
}

.secondary {
  font-size: 18px;
  color: #86868b;
  font-weight: normal;
}

.east {
  top: 50%;
  left: 80%;
  transform: translate(-50%, -50%);
}

.south {
  top: 80%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.west {
  top: 50%;
  left: 20%;
  transform: translate(-50%, -50%);
}

.pointer {
  position: absolute;
  bottom: 20px;
  left: 50%;
  width: 4px;
  height: 40px;
  background: #ff3b30;
  transform: translateX(-50%);
  border-radius: 2px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.degree {
  margin-top: 30px;
  font-size: 32px;
  color: #1d1d1f;
  font-weight: 500;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.tip {
  position: absolute;
  bottom: 50px;
  color: #86868b;
  font-size: 14px;
  background: rgba(255,255,255,0.9);
  padding: 8px 16px;
  border-radius: 20px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}
</style> 