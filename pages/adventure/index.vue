<template>
  <view class="container">
    <!-- 当前任务 -->
    <view class="card" :class="{ 'card-animate': animate }">
      <text class="task-text">{{ currentTask }}</text>
    </view>

    <!-- 随机按钮 -->
    <view class="button" @click="getRandomTask">
      <text class="button-text">随机大冒险</text>
    </view>

    <!-- 历史记录 -->
    <view class="history" v-if="history.length > 0">
      <text class="history-title">最近挑战</text>
      <view class="history-item" v-for="(item, index) in history" :key="index">
        <text class="history-index">{{ index + 1 }}.</text>
        <text class="history-text">{{ item }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const adventures = [
  '用奇怪的声音朗读一段课文',
  '给通讯录第5个人打电话说"我知道你的秘密"',
  '模仿一种动物直到有人猜对',
  '用非惯用手写自己的名字并拍照',
  '向陌生人请求拥抱',
  '在公共场合跳15秒舞',
  '用三种语言说"我爱你"',
  '发一条只有表情的朋友圈',
  '倒立喝一口水（注意安全）',
  '模仿一位名人的招牌动作',
  '用方言唱一首流行歌',
  '蒙眼原地转5圈后走直线',
  '给父母发"我恋爱了"然后解释是游戏',
  '用口红在脸上画图案并保持1小时',
  '模仿雕像静止3分钟',
  '用五种语气说"你好"',
  '把袜子套在手上直到下一轮',
  '用屁股写自己的名字',
  '和下一通来电者用说唱对话',
  '用滤镜自拍并设为临时头像',
  '把第一眼看到的红色物品顶在头上',
  '用播音腔朗读广告词',
  '模仿服务员给家人端茶倒水',
  '用微信翻译功能说一段绕口令',
  '把头发弄成夸张造型并拍照',
  '用五种表情说同一句话',
  '给最好的朋友发土味情话',
  '用手机前置摄像头拍一段鬼脸视频',
  '把此刻所想用倒序文字发出',
  '用左手吃饭持续下一餐',
  '模仿电影经典片段台词',
  '用三种方言自我介绍',
  '把此刻桌面拍成抽象艺术照',
  '用外语点一份虚拟外卖',
  '模仿婴儿说话10句话',
  '用便利贴贴满左手',
  '倒着念一段新闻稿',
  '用手机灯光营造舞台效果',
  '给最近联系人发谜语消息',
  '用书搭一座小塔并拍照',
  '模仿新闻主播播报天气',
  '用身边物品制作帽子佩戴',
  '把微信头像换成童年照',
  '用五种方式说"再见"',
  '模仿机器人动作跳舞',
  '用表情包编一个故事',
  '把手机壁纸换成随机颜色',
  '用软件合成自己的老年照',
  '模仿老师上课的神态动作'
]

const currentTask = ref('点击按钮开始冒险')
const history = ref([])
const animate = ref(false)

const getRandomTask = () => {
  animate.value = true
  setTimeout(() => {
    const randomIndex = Math.floor(Math.random() * adventures.length)
    currentTask.value = adventures[randomIndex]
    history.value.unshift(currentTask.value)
    if (history.value.length > 5) history.value.pop()
    animate.value = false
  }, 300)
}
</script>

<style scoped>
.container {
  padding: 25px;
  background-color: #f5f5f7;
  min-height: 100vh;
}

.card {
  background: #fff;
  border-radius: 20px;
  padding: 30px;
  margin: 20px 0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.card-animate {
  transform: scale(0.95);
  opacity: 0.5;
}

.task-text {
  font-size: 20px;
  color: #1d1d1f;
  text-align: center;
  line-height: 1.5;
}

.button {
  background: #007aff;
  border-radius: 25px;
  padding: 18px 40px;
  margin: 30px auto;
  width: fit-content;
  box-shadow: 0 4px 6px rgba(0,122,255,0.2);
  transition: transform 0.1s;
}

.button:active {
  transform: scale(0.95);
}

.button-text {
  color: white;
  font-size: 18px;
  font-weight: 500;
}

.history {
  background: #fff;
  border-radius: 18px;
  padding: 20px;
  margin-top: 30px;
}

.history-title {
  display: block;
  color: #86868b;
  font-size: 15px;
  margin-bottom: 15px;
}

.history-item {
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
}

.history-index {
  color: #007aff;
  font-size: 14px;
  margin-right: 10px;
}

.history-text {
  color: #1d1d1f;
  font-size: 15px;
  flex: 1;
}
</style> 