<template>
  <view class="container">
    <!-- 测试选择界面 -->
    <view class="test-select-container" v-if="currentStep === 'select'">
      <view class="test-select">
        <div class="section-title">
          <div class="title-text">🔍 选择你的探索方向</div>
          <div class="title-sub">通过专业量表发现未知自我</div>
        </div>

        <div class="test-grid">
          <div 
            v-for="test in availableTests" 
            :key="test.id"
          class="test-card"
            :class="`type-${test.id}`"
          @click="startTest(test.id)"
        >
            <div class="card-bg"></div>
            <div class="card-content">
              <div class="test-meta">
                <div class="test-icon">{{ ['💘', '💼', '✨'][test.id-1] }}</div>
                <div class="test-name">{{ test.name }}</div>
                <div class="test-stats">
                  <span>📝 {{ test.questionCount }}题</span>
                  <span>⏱ {{ ['5-7', '7-10', '10-15'][test.id-1] }}分钟</span>
                </div>
              </div>
              <div class="test-desc">
                {{ [
                  '解析你的情感模式与依恋风格',
                  '评估职场竞争力与发展潜力',
                  '发掘未被察觉的潜能特质'
                ][test.id-1] }}
              </div>
            </div>
          </div>
        </div>

        <div class="disclaimer">
          * 本测试基于心理学量表开发，结果仅供参考
        </div>
      </view>
    </view>

    <!-- 测试进行界面 -->
    <view v-else-if="currentStep === 'testing'" class="test-process">
      <view class="progress-container">
        <text class="progress-text">
          {{ currentQuestionIndex }}/{{ currentTest.totalQuestions }}
        </text>
        <view class="progress-bar">
          <view 
            class="progress-fill"
            :style="{ width: `${(currentQuestionIndex / currentTest.totalQuestions) * 100}%` }"
          ></view>
        </view>
      </view>
      
      <view class="question-box">
        <view class="question-header">
          <text class="question-tag">{{ currentTest.name }}</text>
          <text class="question-number">第{{ currentQuestionIndex + 1 }}题</text>
        </view>
        <text class="question-text">{{ currentQuestion?.text }}</text>
        
        <block v-if="currentQuestion?.options">
          <view 
            v-for="(option, oIndex) in currentQuestion.options" 
            :key="oIndex"
            class="option-card"
            :data-index="String.fromCharCode(65 + oIndex)"
            @click="selectOption(option)"
          >
            <text class="option-text">{{ option.text }}</text>
          </view>
        </block>
        <view v-else class="error-tip">题目加载异常，请返回重试</view>
      </view>
    </view>

    <!-- 测试结果界面 -->
    <view v-else class="test-result">
      <view class="result-header">
        <text class="result-title">🔬 你的实验报告</text>
        <text class="result-subtitle">{{ userNickname }} · {{ new Date().toLocaleDateString() }}</text>
      </view>


      <view class="personality-description">
        {{ dynamicDescription }}
      </view>

      <button 
        class="share-button"
        open-type="share"
      >
        <text class="icon">📤</text>
        <text>生成分享卡片</text>
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed, nextTick } from 'vue'
import { onShareAppMessage } from '@dcloudio/uni-app'

// 添加dynamicDescription声明
const dynamicDescription = ref('')

// 测试流程状态
const currentStep = ref('select')
const currentTest = reactive({
  id: null,
  name: '',
  totalQuestions: 0,
  questions: [],
  dimensions: []
})
const currentQuestionIndex = ref(0)

// 添加已选选项的响应式变量
const selectedOptions = ref([])

// 修复题库初始化问题
const questionBank = reactive({
  1: [ // 恋爱人格检测题库
    {
      text: "初次约会通常如何开启话题？",
      options: [
        { text: "提前准备有趣话题", scores: { B: 3 } },
        { text: "自然聊到哪算哪", scores: { A: 2 } },
        { text: "等对方先开口", scores: { C: 1 } },
        { text: "用玩笑缓解紧张", scores: { D: 2 } }
      ]
    },
    {
      text: "发现对方忘记纪念日时？",
      options: [
        { text: "直接表达不满", scores: { B: 2 } },
        { text: "猜测对方是否变心", scores: { A: -1 } },
        { text: "理性分析可能原因", scores: { C: 3 } },
        { text: "自己准备惊喜补偿", scores: { D: 2 } }
      ]
    },
    {
      text: "争吵后的处理方式",
      options: [
        { text: "主动道歉缓和关系", scores: { B: 3 } },
        { text: "需要时间自我平复", scores: { A: 1 } },
        { text: "分析问题逻辑", scores: { C: 2 } },
        { text: "用亲密举动化解", scores: { D: 2 } }
      ]
    },
    {
      text: "恋人查看你手机时的反应",
      options: [
        { text: "主动说明聊天对象", scores: { B: 2, A: 1 } },
        { text: "觉得被冒犯但不说", scores: { A: -1 } },
        { text: "要求同等查看权限", scores: { C: 1 } },
        { text: "用玩笑转移注意力", scores: { D: 2 } }
      ]
    },
    {
      text: "纪念日礼物的选择倾向",
      options: [
        { text: "实用型（如充电宝）", scores: { C: 3 } },
        { text: "手工制作礼物", scores: { D: 3 } },
        { text: "直接询问对方需求", scores: { B: 2 } },
        { text: "不刻意准备", scores: { A: 1 } }
      ]
    },
    {
      text: "发现对方撒谎时的处理",
      options: [
        { text: "收集证据再对质", scores: { C: 3 } },
        { text: "立即情绪爆发", scores: { B: 1, A: -2 } },
        { text: "观察后续表现", scores: { A: 2 } },
        { text: "用温情方式引导坦白", scores: { D: 2 } }
      ]
    },
    {
      text: "是否常担心被抛弃",
      options: [
        { text: "几乎不会", scores: { A: 3 } },
        { text: "经常担心", scores: { A: -2 } },
        { text: "取决于对方表现", scores: { C: 1 } },
        { text: "用更粘人来应对", scores: { D: 1 } }
      ]
    },
    {
      text: "对方临时取消约会的反应",
      options: [
        { text: "追问真实原因", scores: { B: 2 } },
        { text: "怀疑自己不够重要", scores: { A: -1 } },
        { text: "重新安排自己的时间", scores: { C: 2 } },
        { text: "准备意外惊喜补偿", scores: { D: 2 } }
      ]
    },
    {
      text: "社交媒体互动偏好",
      options: [
        { text: "每天分享日常", scores: { B: 3 } },
        { text: "只发重要时刻", scores: { C: 2 } },
        { text: "发仅对方可见的内容", scores: { D: 2 } },
        { text: "几乎不主动发动态", scores: { A: 1 } }
      ]
    },
    {
      text: "未来规划出现分歧时",
      options: [
        { text: "制作利弊分析表", scores: { C: 3 } },
        { text: "坚持自己想法", scores: { B: 1 } },
        { text: "优先对方需求", scores: { A: 2 } },
        { text: "创造第三选择", scores: { D: 1 } }
      ]
    },
    {
      text: "身体不适时期待对方",
      options: [
        { text: "立即过来照顾", scores: { B: 3 } },
        { text: "担心成为负担", scores: { A: -1 } },
        { text: "明确说明需要什么", scores: { C: 2 } },
        { text: "用撒娇表达需求", scores: { D: 2 } }
      ]
    },
    {
      text: "发现理想型出现时",
      options: [
        { text: "主动制造接触机会", scores: { B: 3 } },
        { text: "担心现有关系动摇", scores: { A: -1 } },
        { text: "评估现实可能性", scores: { C: 3 } },
        { text: "保持暧昧享受心动", scores: { D: 2 } }
      ]
    }
  ],
  2: [ // 职场生存指数题库
    {
      text: "面对突发项目截止日提前时？",
      options: [
        { text: "立即制定应急计划", scores: { E: 3, G: 2 } },
        { text: "先安抚团队情绪", scores: { F: 3 } },
        { text: "要求额外资源支持", scores: { G: 2 } },
        { text: "寻找流程优化方案", scores: { H: 3 } }
      ]
    },
    {
      text: "同事经常推诿责任时？",
      options: [
        { text: "明确划分职责范围", scores: { E: 2 } },
        { text: "主动承担并影响他人", scores: { F: 2, G: 1 } },
        { text: "设计协作激励机制", scores: { H: 3 } },
        { text: "观察上级处理方式", scores: { F: 1 } }
      ]
    },
    {
      text: "获得晋升机会但需异地工作时？",
      options: [
        { text: "果断接受挑战", scores: { E: 3 } },
        { text: "评估家庭影响", scores: { F: 2 } },
        { text: "协商远程方案", scores: { H: 3 } },
        { text: "推荐合适人选", scores: { G: 2 } }
      ]
    },
    {
      text: "团队出现意见分歧时通常？",
      options: [
        { text: "用数据说服他人", scores: { E: 2, H: 1 } },
        { text: "寻找折中方案", scores: { F: 3 } },
        { text: "争取决策主导权", scores: { G: 2 } },
        { text: "提出创新视角", scores: { H: 3 } }
      ]
    },
    {
      text: "遇到不熟悉的工作任务时？",
      options: [
        { text: "快速学习必要技能", scores: { E: 3 } },
        { text: "寻求同事指导", scores: { F: 2 } },
        { text: "分解任务分配", scores: { G: 2 } },
        { text: "尝试新方法解决", scores: { H: 3 } }
      ]
    },
    {
      text: "季度目标超额完成时？",
      options: [
        { text: "立即设定更高目标", scores: { E: 2 } },
        { text: "保持现有节奏", scores: { F: 1 } },
        { text: "争取团队奖励", scores: { G: 3 } },
        { text: "优化工作流程", scores: { H: 2 } }
      ]
    },
    {
      text: "发现同事工作失误时？",
      options: [
        { text: "直接指出错误", scores: { E: 3 } },
        { text: "私下委婉提醒", scores: { F: 2 } },
        { text: "报告上级处理", scores: { G: 1 } },
        { text: "提供改进方案", scores: { H: 2 } }
      ]
    },
    {
      text: "面对跨部门协作困难时？",
      options: [
        { text: "明确责任边界", scores: { E: 2 } },
        { text: "建立沟通渠道", scores: { F: 3 } },
        { text: "争取高层支持", scores: { G: 2 } },
        { text: "设计协作工具", scores: { H: 3 } }
      ]
    }
  ],
  3: [ // 隐藏天赋探测题库
    {
      text: "面对未知领域时通常？",
      options: [
        { text: "系统学习基础知识", scores: { L: 3 } },
        { text: "凭直觉快速尝试", scores: { J: 3 } },
        { text: "联想类似领域经验", scores: { I: 2 } },
        { text: "观察他人如何处理", scores: { K: 2 } }
      ]
    },
    {
      text: "看到云朵形状最先联想到？",
      options: [
        { text: "动物形象", scores: { I: 2 } },
        { text: "天气变化", scores: { L: 3 } },
        { text: "童年回忆", scores: { K: 3 } },
        { text: "抽象艺术", scores: { J: 2 } }
      ]
    },
    {
      text: "解决复杂问题时倾向于？",
      options: [
        { text: "绘制思维导图", scores: { L: 3 } },
        { text: "咨询他人感受", scores: { K: 2 } },
        { text: "等待灵感闪现", scores: { J: 3 } },
        { text: "尝试非常规方案", scores: { I: 3 } }
      ]
    },
    {
      text: "听到陌生音乐时的反应？",
      options: [
        { text: "分析乐器组成", scores: { L: 2 } },
        { text: "想象对应场景", scores: { I: 3 } },
        { text: "感知情绪基调", scores: { K: 3 } },
        { text: "身体自然律动", scores: { J: 2 } }
      ]
    },
    {
      text: "看到废弃工厂时的联想？",
      options: [
        { text: "建筑结构分析", scores: { L: 2 } },
        { text: "未来艺术空间构想", scores: { I: 3 } },
        { text: "过往工人生活场景", scores: { K: 3 } },
        { text: "能量流动感知", scores: { J: 2 } }
      ]
    },
    {
      text: "解决人际矛盾时通常？",
      options: [
        { text: "建立沟通流程", scores: { L: 2 } },
        { text: "设计和解仪式", scores: { I: 3 } },
        { text: "感知情绪根源", scores: { K: 3 } },
        { text: "相信时间化解", scores: { J: 2 } }
      ]
    },
    {
      text: "学习新技能时的表现？",
      options: [
        { text: "系统分解步骤", scores: { L: 3 } },
        { text: "创造个人风格", scores: { I: 2 } },
        { text: "关注学习体验", scores: { K: 2 } },
        { text: "依赖顿悟时刻", scores: { J: 3 } }
      ]
    }
  ]
})

// 确保在availableTests之前定义题库
const availableTests = [
  {
    id: 1,
    name: '恋爱人格检测',
    questionCount: 12,
    questions: questionBank[1],
    dimensions: ['A','B','C','D']
  },
  {
    id: 2,
    name: '职场生存指数',
    questionCount: 8,
    questions: questionBank[2],
    dimensions: ['E','F','G','H']
  },
  {
    id: 3,
    name: '隐藏天赋探测',
    questionCount: 7,
    questions: questionBank[3],
    dimensions: ['I','J','K','L']
  }
]

// 用户得分存储
const userScores = reactive({
  A:0, B:0, C:0, D:0,
  E:0, F:0, G:0, H:0,
  I:0, J:0, K:0, L:0
})

// 在现有代码中找到已有的getRandom函数定义并合并
const getRandom = (arr) => {
  if (!arr.length) return null
  return arr[Math.floor(Math.random()*arr.length)]
}

// 修复测试启动逻辑
const startTest = (testId) => {
  const selectedTest = availableTests.find(t => t.id === testId)
  if (!selectedTest) return

  // 正确更新响应式对象
  Object.assign(currentTest, {
    id: selectedTest.id,
    name: selectedTest.name,
    totalQuestions: selectedTest.questions.length,
    questions: shuffleQuestions([...selectedTest.questions]),
    dimensions: selectedTest.dimensions
  })

  // 强制视图更新
  currentQuestionIndex.value = 0
  userScores.value = { A:0, B:0, C:0, D:0, E:0, F:0, G:0, H:0, I:0, J:0, K:0, L:0 }
  
  // 直接切换状态（移除nextTick）
  currentStep.value = 'testing'

  // 在开始测试时初始化
  selectedOptions.value = new Array(currentTest.totalQuestions).fill(null)
}

// 选择答案
const selectOption = (option) => {
  console.log('当前题目索引：', currentQuestionIndex.value)
  console.log('总题数：', currentTest.totalQuestions)
  // 处理得分
  Object.entries(option.scores).forEach(([dimension, value]) => {
    userScores[dimension] += value
  })

  if (!currentTest.questions[currentQuestionIndex.value]) {
    console.error('题目索引越界')
    return
  }

  // 在选择选项时更新
  selectedOptions.value[currentQuestionIndex.value] = option

  if(currentQuestionIndex.value < currentTest.totalQuestions - 1) {
    currentQuestionIndex.value++
  } else {
    // 根据测试类型获取对应的总分配置
    const totalPossibleMap = {
      1: { A: 15, B: 20, C: 18, D: 16 }, // 恋爱测试
      2: { E: 36, F: 27, G: 30, H: 39 }, // 职场测试
      3: { I: 36, J: 30, K: 36, L: 42 }  // 天赋测试
    }

    // 获取当前测试的分数配置
    const totalPossible = totalPossibleMap[currentTest.id] || {}
    
    // 仅计算当前测试相关的维度
    const finalScores = Object.keys(totalPossible).reduce((acc, dimension) => {
      acc[dimension] = Math.min(100, Math.max(0, 
        (userScores[dimension] / totalPossible[dimension]) * 100
      ))
      return acc
    }, {})

    generateReport(finalScores)
    currentStep.value = 'result'
  }
}

// 生成报告
const generateReport = (scores) => {
  // 根据当前测试类型生成描述
  dynamicDescription.value = generateDynamicDescription(scores)
}

// 添加分数计算函数
const calculateDimensionScores = () => {
  const scores = { A: 0, B: 0, C: 0, D: 0 }
  
  selectedOptions.value.forEach(option => {
    if (option) {
      Object.entries(option.scores).forEach(([dim, value]) => {
        scores[dim] += value
      })
    }
  })

  return Object.entries(scores).map(([dimension, score]) => ({
    dimension,
    score: Math.max(0, score)
  }))
}

// 修改结果生成函数参数
const generateDynamicDescription = (scores) => {
  const dimensionScores = calculateDimensionScores()
  let analysis = []
  
  // 为每个维度生成独特描述
  dimensionScores.forEach(({ dimension, score }) => {
    const descriptors = {
      A: {
        high: [
          { metaphor: '磁铁型', advice: '发展个人兴趣' },
          { metaphor: '连体婴型', advice: '安排独处时间' },
          { metaphor: '树獭型', advice: '拓展社交圈' }
        ],
        low: [
          { metaphor: '独立型', advice: '主动表达关心' },
          { metaphor: '风筝型', advice: '定期联络习惯' },
          { metaphor: '旅行者型', advice: '建立纪念日仪式' }
        ]
      },
      B: {
        high: [
          { metaphor: '火山型', advice: '冷静三分钟' },
          { metaphor: '烟花型', advice: '每日情绪记录' },
          { metaphor: '过山车型', advice: '事前深呼吸' }
        ],
        low: [
          { metaphor: '温泉型', advice: '每天说句心里话' },
          { metaphor: '春风型', advice: '每周惊喜计划' },
          { metaphor: '含羞草型', advice: '主动拥抱练习' }
        ]
      },
      C: {
        high: [
          { metaphor: '计算机型', advice: '写心情日记' },
          { metaphor: '分析仪型', advice: '看浪漫电影' },
          { metaphor: '侦探型', advice: '尝试即兴活动' }
        ],
        low: [
          { metaphor: '变色龙型', advice: '列出底线清单' },
          { metaphor: '自由派型', advice: '制定小目标' },
          { metaphor: '蒲公英型', advice: '每日反思笔记' }
        ]
      },
      D: {
        high: [
          { metaphor: '童话型', advice: '定期现实检查' },
          { metaphor: '魔术师型', advice: '朋友意见征询' },
          { metaphor: '诗人型', advice: '落地计划表' }
        ],
        low: [
          { metaphor: '工匠型', advice: '尝试说走就走' },
          { metaphor: '务实派型', advice: '每月小浪漫' },
          { metaphor: '园丁型', advice: '接受不完美练习' }
        ]
      }
    }

    const templatePool = descriptors[dimension][score >= getThreshold(dimension) ? 'high' : 'low']
    const { metaphor, advice } = getRandom(templatePool)
    
    analysis.push(
      `✨ ${metaphor}特质（${score}分）：` +
      `你的情感模式呈现${['心有灵犀','自然流动','默契十足'][Math.floor(Math.random()*3)]}特征。` +
      `建议通过${advice}进行动态平衡。`
    )
  })

  // 随机化综合评估
  const totalScore = dimensionScores.reduce((sum, { score }) => sum + score, 0)
  const modelType = totalScore > 60 ? 
    getRandom(['活力四射型','全心投入型','激情澎湃型']) : 
    getRandom(['稳定成长型','细水长流型','从容发展型'])
  
  analysis.push(`❤️ 综合类型：${modelType}，建议${
    getRandom([
      '每月情感小体检',
      '季度关系优化',
      '年度亲密升级'
    ])
  }`)

  return analysis.join('\n\n')
}

// 添加工具函数
const getThreshold = (dim) => ({A:15, B:18, C:12, D:20}[dim])

// 新增职场评分工具函数
const getWorkplaceLevel = (score, fullMark) => {
  const percentage = (score / fullMark) * 100
  return percentage >= 85 ? '★★★★★' :
         percentage >= 70 ? '★★★★' :
         percentage >= 55 ? '★★★' : '★★'
}

const getWorkplaceDesc = (dim, score) => {
  const descriptors = {
    E: ['执行力', '任务分解能力', '目标达成效率'],
    F: ['适应力', '压力管理', '环境融入'],
    G: ['领导力', '决策能力', '团队激励'],
    H: ['创新力', '问题重构', '方案优化']
  }
  const level = score > 30 ? '卓越' : score > 20 ? '良好' : '待提升'
  return `${getRandom(descriptors[dim])}${level}`
}

// 新增职场建议生成
const getWorkplaceAdvice = (scores) => {
  const advice = []
  if(scores.E < 15) advice.push('⏰ 使用任务清单管理每日工作')
  if(scores.F < 12) advice.push('🌍 多参与跨部门协作锻炼适应力')
  if(scores.G > 20) advice.push('👥 可以尝试带领小型项目')
  if(scores.H < 15) advice.push('💡 每周记录三个改进想法')
  
  return advice.length ? 
    '📌 发展建议：\n' + advice.join('\n') : 
    '🎉 各项能力均衡发展，继续保持！'
}

// 新增天赋结果生成
const getTalentResult = (scores) => {
  const talentData = {
    I: { icon: '🎨', name: '创造力', max: 36 },
    J: { icon: '🔮', name: '直觉力', max: 30 },
    K: { icon: '❤️', name: '共情力', max: 36 },
    L: { icon: '🧩', name: '系统思维', max: 42 }
  }

  let result = ''
  Object.entries(talentData).forEach(([key, info]) => {
    const percent = ((scores[key]/info.max)*100).toFixed(0)
    result += `${info.icon} ${info.name}：${percent}%\n`
  })

  const maxTalent = Object.entries(scores)
    .filter(([k]) => ['I','J','K','L'].includes(k))
    .sort((a,b) => b[1]-a[1])[0]

  result += `\n 最突出天赋：${talentData[maxTalent[0]].icon} ${talentData[maxTalent[0]].name}\n`
  result += getTalentAdvice(scores)
  
  return result
}

// 新增天赋建议生成
const getTalentAdvice = (scores) => {
  const advice = []
  if(scores.I < 12) advice.push('每天记录一个创意点子')
  if(scores.J < 10) advice.push('尝试先做直觉判断再验证')
  if(scores.K < 12) advice.push('多观察他人的情绪反应')
  if(scores.L < 15) advice.push('用思维导图分析问题')
  
  return advice.length ? 
    '📌 培养建议：\n' + advice.join('\n') : 
    '🎉 各项天赋均衡发展，潜力无限！'
}

// 添加小程序分享生命周期
onShareAppMessage(() => {
  return {
    title: '🔍发现你的隐藏人格特质',
    path: '/pages/personality-lab/index',
    imageUrl: 'https://your-domain.com/static/share-card.jpg'
  }
})

// 加强shuffleQuestions的容错
const shuffleQuestions = (questions) => {
  if (!Array.isArray(questions)) return []
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }
  return questions;
}

// 在script中添加currentQuestion计算属性
const currentQuestion = computed(() => {
  return currentTest.questions[currentQuestionIndex.value] || {}
})
</script>

<style scoped>
/* 基础字号设置 */
:root {
  font-size: calc(14px + 0.2vw); /* 14-16px */
}

.container {
  position: static;
  min-height: auto;
  background: linear-gradient(135deg, #6B8DD6 0%, #8E37D7 100%);
  max-width: 600px; /* 大屏最大宽度 */
  margin: 0 auto; /* 居中显示 */
  padding: 0 15px;
  padding-bottom: env(safe-area-inset-bottom); /* 底部安全间距 */
  overflow: visible; /* 允许内容溢出 */
}

/* 测试选择样式 */
.test-select-container {
  height: 100vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: env(safe-area-inset-bottom);
  display: flex;
  flex-direction: column;
}

.test-select {
  flex: 1;
  padding: 20px 15px 100px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: min-content;
  overflow-y: auto;
}

.section-title {
  text-align: center;
  margin-bottom: 30px;
}

.title-text {
  font-size: 22px;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.title-sub {
  color: rgba(255,255,255,0.9);
  font-size: 14px;
  margin-top: 8px;
}

.test-grid {
  display: grid;
  gap: 20px;
}

.test-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s ease;
  cursor: pointer;
  padding: clamp(15px, 2vw, 20px);
}

.test-card:hover {
  transform: translateY(-5px);
}

.test-card:hover .card-bg {
  opacity: 0.9;
}

.card-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, 
    rgba(107, 141, 214, 0.9) 0%,
    rgba(142, 55, 215, 0.9) 100%
  );
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.test-card.type-1 .card-bg {
  background: linear-gradient(145deg, #FFB8B8, #FF6B6B);
}

.test-card.type-2 .card-bg {
  background: linear-gradient(145deg, #A8D8FF, #6B8DD6);
}

.test-card.type-3 .card-bg {
  background: linear-gradient(145deg, #C2A1FF, #8E37D7);
}

.card-content {
  position: relative;
  padding: 20px;
  color: white;
}

.test-meta {
  margin-bottom: 15px;
}

.test-icon {
  font-size: 40px;
  margin-bottom: 10px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.test-name {
  font-size: clamp(16px, 2vw, 20px);
  font-weight: 500;
  margin-bottom: 8px;
}

.test-stats {
  display: flex;
  gap: 15px;
  font-size: 13px;
  opacity: 0.9;
}

.test-desc {
  font-size: clamp(12px, 1.6vw, 14px);
  line-height: 1.6;
  opacity: 0.95;
}

.disclaimer {
  text-align: center;
  margin-top: 25px;
  font-size: 12px;
  color: rgba(255,255,255,0.8);
}

/* 测试进行样式 */
.test-process {
  padding: 0 15px;
  padding-top: 20px;
  padding-bottom: 30px;
  min-height: 100vh;
  box-sizing: border-box;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.progress-container {
  margin: 0 15px 25px;
}

.progress-text {
  display: block;
  text-align: right;
  color: #FF4757;
  font-size: 14px;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(255,71,87,0.15);
  margin-bottom: 8px;
}

.progress-bar {
  height: 8px;
  background: rgba(107,141,214,0.15);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(
    90deg,
    #FF4757 0%,
    #FF6B6B 50%,
    #FFA502 100%
  );
  box-shadow: 
    0 4px 15px rgba(255,71,87,0.3),
    inset 0 3px 6px rgba(255,255,255,0.4);
  position: relative;
  overflow: hidden;
  transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0.4) 25%,
    transparent 50%,
    rgba(255,255,255,0.2) 75%
  );
  background-size: 200% 100%;
  animation: progress-glow 1.2s infinite linear;
}

@keyframes progress-glow {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.question-box {
  background: #fff;
  border-radius: 20px;
  padding: 25px;
  margin: 25px 15px 50px;
  box-shadow: 0 10px 30px rgba(107,141,214,0.15);
  position: relative;
}

.question-header {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #EEE;
  padding-bottom: 15px;
  margin-bottom: 20px;
}

.question-tag {
  background: linear-gradient(135deg, #6B8DD6 0%, #8E37D7 100%);
  color: white;
  padding: 6px 18px;
  border-radius: 25px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.question-number {
  color: #6B8DD6;
  font-weight: 600;
}

.question-text {
  color: #2A2A2A;
  font-weight: 600;
}

.option-card {
  background: linear-gradient(145deg, #FFFFFF 0%, #F8F9FF 100%);
  border: none;
  border-radius: 15px;
  margin: 15px 0;
  padding: clamp(12px, 1.5vw, 15px) clamp(15px, 2vw, 20px);
  box-shadow: 0 4px 12px rgba(107,141,214,0.1);
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  word-break: break-word;
  hyphens: auto;
}

.option-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(107,141,214,0.2);
}

.option-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(107,141,214,0.05) 0%, rgba(142,55,215,0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s;
}

.option-card:hover::before {
  opacity: 1;
}

.option-text {
  color: #444;
  font-weight: 500;
}

.option-card::after {
  content: attr(data-index);
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(107,141,214,0.3);
  font-size: 24px;
  font-weight: 700;
  font-family: Arial;
}

/* 结果页样式 */
.result-header {
  text-align: center;
  margin-bottom: 20px;
}

.result-title {
  font-size: clamp(20px, 3vw, 24px);
}

.personality-description {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  line-height: 1.6;
  margin: 20px 0;
  font-size: clamp(14px, 1.8vw, 16px);
}

.share-button {
  background: linear-gradient(135deg, #6B8DD6, #8E37D7);
  color: white;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

/* 添加加载动画 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 添加题目编号样式 */
.question-text::before {
  content: '';
  display: inline-block;
  width: 24px;
  height: 24px;
  background: #FFD700;
  border-radius: 50%;
  text-align: center;
  line-height: 24px;
  color: white;
  margin-right: 10px;
  font-size: 14px;
}

/* 移动端优化 */
@media (max-width: 480px) {
  .test-grid { gap: 15px; }
  .question-number { font-size: 14px; }
  .option-text { font-size: 14px; }
}

/* 极端小屏适配 */
@media (max-width: 320px) {
  :root {
    font-size: 13px;
  }
  
  .test-icon {
    font-size: 32px;
  }
}

/* 结果页底部间距 */
.test-result {
  padding: 20px 15px;
  min-height: 100vh;
  box-sizing: border-box;
}

/* 测试进行界面底部间距 */
.test-process {
  padding-bottom: 30px;
}

/* 修复iOS弹性滚动 */
@supports (-webkit-overflow-scrolling: touch) {
  .test-select {
    -webkit-overflow-scrolling: touch;
  }
}

/* 适配全面屏 */
@supports (padding-top: env(safe-area-inset-top)) {
  .test-process {
    padding-top: calc(20px + env(safe-area-inset-top));
    padding-bottom: calc(30px + env(safe-area-inset-bottom));
  }
}

/* 修复键盘弹出时的布局 */
@media (max-height: 500px) {
  .question-text {
    font-size: 16px;
  }
  .option-card {
    padding: 10px 15px;
  }
}

/* 添加背景纹理 */
.question-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 10% 10%, rgba(107,141,214,0.03) 0%, transparent 30%),
    radial-gradient(circle at 90% 90%, rgba(142,55,215,0.03) 0%, transparent 30%);
  pointer-events: none;
}
</style> 