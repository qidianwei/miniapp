<template>
  <view class="chat-container">
    <!-- 聊天记录区域 -->
    <scroll-view class="chat-messages" scroll-y="true" :scroll-into-view="'msg-' + (messages.length-1)">
      <view v-for="(msg, index) in messages" :key="index" :id="'msg-' + index" 
            class="message" :class="msg.role">
        <text class="content">{{ msg.content }}</text>
        <text class="time">{{ msg.time }}</text>
      </view>
      <view v-if="loading" class="loading">
        <text class="dot">●</text>
        <text class="dot">●</text>
        <text class="dot">●</text>
      </view>
    </scroll-view>

    <!-- 输入区域 -->
    <view class="input-area">
      <input class="input" v-model="inputText" placeholder="向DeepSeek提问..." 
             @confirm="sendMessage" :disabled="loading"/>
      <button class="send-btn" @tap="sendMessage" :disabled="loading">
        {{ loading ? '思考中...' : '发送' }}
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import lottie from 'lottie-web/build/player/lottie_light'

const API_KEY = 'sk-0bec3188a06c4c499f74fb7c426ce027'
const messages = ref([])
const inputText = ref('')
const loading = ref(false)

const formatTime = () => {
  const now = new Date()
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
}

const sendMessage = async () => {
  if (!inputText.value.trim() || loading.value) return

  const userMessage = {
    role: 'user',
    content: inputText.value,
    time: formatTime()
  }
  
  messages.value.push(userMessage)
  inputText.value = ''
  loading.value = true

  try {
    const res = await uni.request({
      url: 'https://api.deepseek.com/v1/chat/completions',
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      data: {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "你是一个乐于助人的AI助手，用中文回答，保持回答简洁"
          },
          ...messages.value.map(m => ({ role: m.role, content: m.content }))
        ],
        temperature: 0.7
      }
    })

    if (res.statusCode === 200) {
      messages.value.push({
        role: 'assistant',
        content: res.data.choices[0].message.content,
        time: formatTime()
      })
    }
  } catch (err) {
    console.error('API Error:', err)
    messages.value.push({
      role: 'assistant',
      content: '抱歉，暂时无法处理您的请求，请稍后再试',
      time: formatTime()
    })
  } finally {
    loading.value = false
  }
}

const initLottieAnimation = () => {
  // ... existing code ...
  // Add this line to suppress warnings
  rendererSettings: {
    suppressWarnings: true,
    // ... other settings
  }
}
</script>

<style>
.chat-container {
  position: fixed;
  bottom: 100rpx;
  right: 30rpx;
  width: 700rpx;
  height: 900rpx;
  background: rgba(255,255,255,0.95);
  border-radius: 20rpx;
  box-shadow: 0 10rpx 30rpx rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
}

.chat-messages {
  flex: 1;
  padding: 30rpx;
  overflow-y: auto;
}

.message {
  margin: 20rpx 0;
  padding: 20rpx;
  border-radius: 15rpx;
  max-width: 80%;
}

.message.user {
  background: #e3f2fd;
  margin-left: auto;
}

.message.assistant {
  background: #f5f5f5;
  margin-right: auto;
}

.content {
  font-size: 28rpx;
  line-height: 1.5;
}

.time {
  display: block;
  font-size: 24rpx;
  color: #666;
  margin-top: 10rpx;
  text-align: right;
}

.input-area {
  border-top: 1rpx solid #eee;
  padding: 20rpx;
  display: flex;
  gap: 20rpx;
}

.input {
  flex: 1;
  padding: 15rpx 20rpx;
  border: 1rpx solid #ddd;
  border-radius: 10rpx;
  font-size: 28rpx;
}

.send-btn {
  background: #4CAF50;
  color: white;
  padding: 0 40rpx;
  border-radius: 10rpx;
  font-size: 28rpx;
}

.loading {
  padding: 20rpx;
  text-align: center;
}

.dot {
  color: #4CAF50;
  margin: 0 10rpx;
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10rpx); }
}
</style> 