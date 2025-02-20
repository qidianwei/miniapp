<template>
  <view class="container">
    <!-- 问题卡片 -->
    <view class="card" :class="{ 'card-shake': animate }">
      <text class="question-text">{{ currentQuestion }}</text>
    </view>

    <!-- 操作按钮 -->
    <view class="button-group">
      <view class="button skip" @click="getRandomQuestion">
        <text class="button-text">换一个问题</text>
      </view>
      <view class="button truth" @click="$refs.answerPopup.open()">
        <text class="button-text">查看参考答案</text>
      </view>
    </view>

    <!-- 参考答案弹窗 -->
    <CustomPopup ref="answerPopup">
      <view class="modal-content">
        <text class="answer-title">参考答案</text>
        <scroll-view scroll-y class="answer-scroll">
          <text class="answer-text">{{ currentAnswer }}</text>
        </scroll-view>
      </view>
    </CustomPopup>

    <!-- 历史记录 -->
    <view class="history" v-if="history.length > 0">
      <text class="history-title">历史问题</text>
      <view class="history-item" v-for="(item, index) in history" :key="index">
        <text class="history-index">{{ index + 1 }}.</text>
        <text class="history-text">{{ item.question }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import CustomPopup from '@/components/CustomPopup.vue'

const questions = [
  {
    question: '你最后悔的一件事是什么？',
    answer: '这个问题没有标准答案，建议真诚分享自己的经历，同时注意保护隐私'
  },
  {
    question: '如果必须删除一个记忆，你会选哪个？',
    answer: '参考答案：可能会选择某次尴尬的经历，或者某段不愉快的回忆'
  },
  {
    question: '你心中最理想的伴侣是什么样？',
    answer: '参考答案：注重性格三观契合，能互相理解支持，有共同生活目标'
  },
  {
    question: '你最害怕别人知道你的什么秘密？',
    answer: '参考答案：可以分享一个无伤大雅的小秘密，或表示每个人都有隐私需要保护'
  },
  {
    question: '如果明天是世界末日，你会做什么？',
    answer: '参考答案：可能会与家人朋友相聚，完成最想做的事，表达真实情感'
  },
  {
    question: '你曾经撒过最离谱的谎是什么？',
    answer: '参考答案：可以分享一个有趣的经历，注意不要涉及敏感话题'
  },
  {
    question: '你手机里最羞于见人的照片是什么？',
    answer: '参考答案：可以说某个搞怪自拍，或者宠物有趣的照片'
  },
  {
    question: '你做过最疯狂的事是什么？',
    answer: '参考答案：可以说一次说走就走的旅行，或某个突破自我的经历'
  },
  {
    question: '你暗恋过的人现在怎么样了？',
    answer: '参考答案：可以说现在还是朋友，或者已经失去联系'
  },
  {
    question: '你手机里存着前任的联系方式吗？',
    answer: '参考答案：根据实际情况回答，可以说已经删除或还有保留'
  },
  {
    question: '你收到过最特别的礼物是什么？',
    answer: '参考答案：可以是手作礼物，或有特殊纪念意义的物品'
  },
  {
    question: '你做过最浪漫的事是什么？',
    answer: '参考答案：可以是精心准备的惊喜，或日常的贴心举动'
  },
  {
    question: '你相信一见钟情还是日久生情？',
    answer: '参考答案：可以说更相信两者结合，需要感觉也需要相处'
  },
  {
    question: '你手机里最常用的三个APP是什么？',
    answer: '参考答案：根据实际情况回答，如微信、支付宝、抖音等'
  },
  {
    question: '你最近一次哭是因为什么？',
    answer: '参考答案：可以说因为感动、压力或看影视作品'
  },
  {
    question: '你手机相册最新五张照片是什么？',
    answer: '参考答案：根据实际情况描述，可以是截图、随手拍等'
  },
  {
    question: '你最喜欢的电影是哪部？为什么？',
    answer: '参考答案：可以说《肖申克的救赎》因为充满希望，或其他喜欢的电影'
  },
  {
    question: '你手机里最舍不得删的聊天记录是什么？',
    answer: '参考答案：可以说家人祝福、朋友鼓励或重要工作记录'
  },
  {
    question: '你人生中最重要的转折点是什么？',
    answer: '参考答案：可以是升学、工作选择、遇到某人等'
  },
  {
    question: '你手机里最常听的歌曲是哪首？',
    answer: '参考答案：根据实际情况回答当前循环的歌曲'
  },
  {
    question: '你觉得自己最大的缺点是什么？',
    answer: '参考答案：可以说追求完美、有时急躁等无伤大雅的小缺点'
  },
  {
    question: '你最近一次说谎是什么时候？',
    answer: '参考答案：可以说善意的谎言，比如对家人报喜不报忧'
  },
  {
    question: '你手机里最贵的购物记录是什么？',
    answer: '参考答案：可以说电子产品、课程培训或给家人的礼物'
  },
  {
    question: '你做过最冒险的决定是什么？',
    answer: '参考答案：可以是换工作、创业、去陌生城市发展等'
  },
  {
    question: '你手机里最久远的照片是什么时候的？',
    answer: '参考答案：可以说童年照、毕业照或某个纪念日照片'
  },
  {
    question: '你觉得自己最像哪种动物？为什么？',
    answer: '参考答案：可以说猫（独立）、狗（忠诚）等，说明原因'
  },
  {
    question: '你手机里最特别的备注是谁的？',
    answer: '参考答案：可以说家人、伴侣或好友的趣味备注'
  },
  {
    question: '你学生时代最遗憾的事是什么？',
    answer: '参考答案：可以说没好好读书、没把握某个机会等'
  },
  {
    question: '你手机里最常用的表情包是什么类型？',
    answer: '参考答案：可以说猫狗、搞笑文字或影视截图类'
  },
  {
    question: '你最近一次心动是因为什么？',
    answer: '参考答案：可以说看到温馨场景、遇到优秀的人等'
  },
  {
    question: '你手机里最特别的APP是什么？',
    answer: '参考答案：可以说小众工具类、学习类或纪念日APP'
  },
  {
    question: '你觉得自己最大的优点是什么？',
    answer: '参考答案：可以说责任心强、善于沟通、学习能力强等'
  },
  {
    question: '你手机里最常点的外卖是什么？',
    answer: '参考答案：根据实际情况回答常点的餐饮类型'
  },
  {
    question: '你最近一次帮助别人是什么时候？',
    answer: '参考答案：可以说让座、工作协助或生活小事'
  },
  {
    question: '你手机里最常用的支付方式是什么？',
    answer: '参考答案：可以说微信支付、支付宝或刷脸支付'
  },
  {
    question: '你最近一次旅行去了哪里？',
    answer: '参考答案：根据实际情况回答最近去过的城市或景点'
  },
  {
    question: '你手机里最常用的导航软件是什么？',
    answer: '参考答案：可以说高德地图、百度地图或腾讯地图'
  },
  {
    question: '你最近一次熬夜到几点？为什么？',
    answer: '参考答案：可以说工作加班、追剧或与朋友聊天'
  },
  {
    question: '你手机里最常用的购物软件是什么？',
    answer: '参考答案：可以说淘宝、京东、拼多多等'
  },
  {
    question: '你最近一次运动是什么时候？',
    answer: '参考答案：可以说昨天散步、上周打球等实际情况'
  },
  {
    question: '你手机里最常用的视频平台是什么？',
    answer: '参考答案：可以说抖音、B站、腾讯视频等'
  },
  {
    question: '你最近一次生气是因为什么？',
    answer: '参考答案：可以说工作问题、生活琐事或他人行为'
  },
  {
    question: '你手机里最常用的社交软件是什么？',
    answer: '参考答案：可以说微信、QQ、微博等'
  },
  {
    question: '你最近一次被感动是什么时候？',
    answer: '参考答案：可以说家人关怀、朋友帮助或影视情节'
  },
  {
    question: '你手机里最常用的拍照滤镜是什么？',
    answer: '参考答案：可以说原相机、美颜相机或特定APP滤镜'
  },
  {
    question: '你最近一次大笑是因为什么？',
    answer: '参考答案：可以说搞笑视频、朋友趣事或段子'
  },
  {
    question: '你手机里最常用的笔记软件是什么？',
    answer: '参考答案：可以说备忘录、印象笔记或Notion等'
  },
  {
    question: '你最近一次网购是什么东西？',
    answer: '参考答案：根据实际情况回答最近购买的商品'
  },
  {
    question: '你手机里最常用的音乐软件是什么？',
    answer: '参考答案：可以说网易云音乐、QQ音乐或Apple Music'
  },
  {
    question: '你最近一次下厨做了什么？',
    answer: '参考答案：可以说简单料理、尝试新菜或外卖'
  },
  {
    question: '你手机里最常用的修图软件是什么？',
    answer: '参考答案：可以说美图秀秀、醒图或Lightroom'
  },
  {
    question: '你最近一次学习新技能是什么？',
    answer: '参考答案：可以说编程、烹饪、运动等新尝试'
  }
]

const currentQuestion = ref('点击按钮获取问题')
const currentAnswer = ref('')
const history = ref([])
const animate = ref(false)

const getRandomQuestion = () => {
  animate.value = true
  setTimeout(() => {
    const randomIndex = Math.floor(Math.random() * questions.length)
    const { question, answer } = questions[randomIndex]
    currentQuestion.value = question
    currentAnswer.value = answer
    
    history.value.unshift({ question, answer })
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

.card-shake {
  animation: shake 0.4s;
}

@keyframes shake {
  0% { transform: translateX(0) }
  25% { transform: translateX(-8px) }
  50% { transform: translateX(8px) }
  75% { transform: translateX(-4px) }
  100% { transform: translateX(0) }
}

.question-text {
  font-size: 20px;
  color: #1d1d1f;
  text-align: center;
  line-height: 1.5;
}

.button-group {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin: 30px 0;
}

.button {
  border-radius: 25px;
  padding: 15px 30px;
  min-width: 120px;
  text-align: center;
  transition: transform 0.1s;
}

.button:active {
  transform: scale(0.95);
}

.skip {
  background: #34c759;
}

.truth {
  background: #007aff;
}

.button-text {
  color: white;
  font-size: 16px;
  font-weight: 500;
}

.modal-content {
  background: #fff;
  width: 80%;
  max-width: 500px;
  border-radius: 20px;
  padding: 25px;
}

.answer-title {
  font-size: 18px;
  color: #1d1d1f;
  display: block;
  text-align: center;
  margin-bottom: 15px;
}

.answer-scroll {
  max-height: 60vh;
}

.answer-text {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
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