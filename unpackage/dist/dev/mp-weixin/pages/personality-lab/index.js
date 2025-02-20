"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const dynamicDescription = common_vendor.ref("");
    const currentStep = common_vendor.ref("select");
    const currentTest = common_vendor.reactive({
      id: null,
      name: "",
      totalQuestions: 0,
      questions: [],
      dimensions: []
    });
    const currentQuestionIndex = common_vendor.ref(0);
    const selectedOptions = common_vendor.ref([]);
    const questionBank = common_vendor.reactive({
      1: [
        // 恋爱人格检测题库
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
      2: [
        // 职场生存指数题库
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
      3: [
        // 隐藏天赋探测题库
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
    });
    const availableTests = [
      {
        id: 1,
        name: "恋爱人格检测",
        questionCount: 12,
        questions: questionBank[1],
        dimensions: ["A", "B", "C", "D"]
      },
      {
        id: 2,
        name: "职场生存指数",
        questionCount: 8,
        questions: questionBank[2],
        dimensions: ["E", "F", "G", "H"]
      },
      {
        id: 3,
        name: "隐藏天赋探测",
        questionCount: 7,
        questions: questionBank[3],
        dimensions: ["I", "J", "K", "L"]
      }
    ];
    const userScores = common_vendor.reactive({
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      E: 0,
      F: 0,
      G: 0,
      H: 0,
      I: 0,
      J: 0,
      K: 0,
      L: 0
    });
    const getRandom = (arr) => {
      if (!arr.length)
        return null;
      return arr[Math.floor(Math.random() * arr.length)];
    };
    const startTest = (testId) => {
      const selectedTest = availableTests.find((t) => t.id === testId);
      if (!selectedTest)
        return;
      Object.assign(currentTest, {
        id: selectedTest.id,
        name: selectedTest.name,
        totalQuestions: selectedTest.questions.length,
        questions: shuffleQuestions([...selectedTest.questions]),
        dimensions: selectedTest.dimensions
      });
      currentQuestionIndex.value = 0;
      userScores.value = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0, I: 0, J: 0, K: 0, L: 0 };
      currentStep.value = "testing";
      selectedOptions.value = new Array(currentTest.totalQuestions).fill(null);
    };
    const selectOption = (option) => {
      common_vendor.index.__f__("log", "at pages/personality-lab/index.vue:444", "当前题目索引：", currentQuestionIndex.value);
      common_vendor.index.__f__("log", "at pages/personality-lab/index.vue:445", "总题数：", currentTest.totalQuestions);
      Object.entries(option.scores).forEach(([dimension, value]) => {
        userScores[dimension] += value;
      });
      if (!currentTest.questions[currentQuestionIndex.value]) {
        common_vendor.index.__f__("error", "at pages/personality-lab/index.vue:452", "题目索引越界");
        return;
      }
      selectedOptions.value[currentQuestionIndex.value] = option;
      if (currentQuestionIndex.value < currentTest.totalQuestions - 1) {
        currentQuestionIndex.value++;
      } else {
        const totalPossibleMap = {
          1: { A: 15, B: 20, C: 18, D: 16 },
          // 恋爱测试
          2: { E: 36, F: 27, G: 30, H: 39 },
          // 职场测试
          3: { I: 36, J: 30, K: 36, L: 42 }
          // 天赋测试
        };
        const totalPossible = totalPossibleMap[currentTest.id] || {};
        Object.keys(totalPossible).reduce((acc, dimension) => {
          acc[dimension] = Math.min(100, Math.max(
            0,
            userScores[dimension] / totalPossible[dimension] * 100
          ));
          return acc;
        }, {});
        generateReport();
        currentStep.value = "result";
      }
    };
    const generateReport = (scores) => {
      dynamicDescription.value = generateDynamicDescription();
    };
    const calculateDimensionScores = () => {
      const scores = { A: 0, B: 0, C: 0, D: 0 };
      selectedOptions.value.forEach((option) => {
        if (option) {
          Object.entries(option.scores).forEach(([dim, value]) => {
            scores[dim] += value;
          });
        }
      });
      return Object.entries(scores).map(([dimension, score]) => ({
        dimension,
        score: Math.max(0, score)
      }));
    };
    const generateDynamicDescription = (scores) => {
      const dimensionScores = calculateDimensionScores();
      let analysis = [];
      dimensionScores.forEach(({ dimension, score }) => {
        const descriptors = {
          A: {
            high: [
              { metaphor: "磁铁型", advice: "发展个人兴趣" },
              { metaphor: "连体婴型", advice: "安排独处时间" },
              { metaphor: "树獭型", advice: "拓展社交圈" }
            ],
            low: [
              { metaphor: "独立型", advice: "主动表达关心" },
              { metaphor: "风筝型", advice: "定期联络习惯" },
              { metaphor: "旅行者型", advice: "建立纪念日仪式" }
            ]
          },
          B: {
            high: [
              { metaphor: "火山型", advice: "冷静三分钟" },
              { metaphor: "烟花型", advice: "每日情绪记录" },
              { metaphor: "过山车型", advice: "事前深呼吸" }
            ],
            low: [
              { metaphor: "温泉型", advice: "每天说句心里话" },
              { metaphor: "春风型", advice: "每周惊喜计划" },
              { metaphor: "含羞草型", advice: "主动拥抱练习" }
            ]
          },
          C: {
            high: [
              { metaphor: "计算机型", advice: "写心情日记" },
              { metaphor: "分析仪型", advice: "看浪漫电影" },
              { metaphor: "侦探型", advice: "尝试即兴活动" }
            ],
            low: [
              { metaphor: "变色龙型", advice: "列出底线清单" },
              { metaphor: "自由派型", advice: "制定小目标" },
              { metaphor: "蒲公英型", advice: "每日反思笔记" }
            ]
          },
          D: {
            high: [
              { metaphor: "童话型", advice: "定期现实检查" },
              { metaphor: "魔术师型", advice: "朋友意见征询" },
              { metaphor: "诗人型", advice: "落地计划表" }
            ],
            low: [
              { metaphor: "工匠型", advice: "尝试说走就走" },
              { metaphor: "务实派型", advice: "每月小浪漫" },
              { metaphor: "园丁型", advice: "接受不完美练习" }
            ]
          }
        };
        const templatePool = descriptors[dimension][score >= getThreshold(dimension) ? "high" : "low"];
        const { metaphor, advice } = getRandom(templatePool);
        analysis.push(
          `✨ ${metaphor}特质（${score}分）：你的情感模式呈现${["心有灵犀", "自然流动", "默契十足"][Math.floor(Math.random() * 3)]}特征。建议通过${advice}进行动态平衡。`
        );
      });
      const totalScore = dimensionScores.reduce((sum, { score }) => sum + score, 0);
      const modelType = totalScore > 60 ? getRandom(["活力四射型", "全心投入型", "激情澎湃型"]) : getRandom(["稳定成长型", "细水长流型", "从容发展型"]);
      analysis.push(`❤️ 综合类型：${modelType}，建议${getRandom([
        "每月情感小体检",
        "季度关系优化",
        "年度亲密升级"
      ])}`);
      return analysis.join("\n\n");
    };
    const getThreshold = (dim) => ({ A: 15, B: 18, C: 12, D: 20 })[dim];
    common_vendor.onShareAppMessage(() => {
      return {
        title: "🔍发现你的隐藏人格特质",
        path: "/pages/personality-lab/index",
        imageUrl: "https://your-domain.com/static/share-card.jpg"
      };
    });
    const shuffleQuestions = (questions) => {
      if (!Array.isArray(questions))
        return [];
      for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
      }
      return questions;
    };
    const currentQuestion = common_vendor.computed(() => {
      return currentTest.questions[currentQuestionIndex.value] || {};
    });
    return (_ctx, _cache) => {
      var _a, _b, _c;
      return common_vendor.e({
        a: currentStep.value === "select"
      }, currentStep.value === "select" ? {
        b: common_vendor.f(availableTests, (test, k0, i0) => {
          return {
            a: common_vendor.t(["💘", "💼", "✨"][test.id - 1]),
            b: common_vendor.t(test.name),
            c: common_vendor.t(test.questionCount),
            d: common_vendor.t(["5-7", "7-10", "10-15"][test.id - 1]),
            e: common_vendor.t(["解析你的情感模式与依恋风格", "评估职场竞争力与发展潜力", "发掘未被察觉的潜能特质"][test.id - 1]),
            f: test.id,
            g: common_vendor.n(`type-${test.id}`),
            h: common_vendor.o(($event) => startTest(test.id), test.id)
          };
        })
      } : currentStep.value === "testing" ? common_vendor.e({
        d: common_vendor.t(currentQuestionIndex.value),
        e: common_vendor.t(currentTest.totalQuestions),
        f: `${currentQuestionIndex.value / currentTest.totalQuestions * 100}%`,
        g: common_vendor.t(currentTest.name),
        h: common_vendor.t(currentQuestionIndex.value + 1),
        i: common_vendor.t((_a = currentQuestion.value) == null ? void 0 : _a.text),
        j: (_b = currentQuestion.value) == null ? void 0 : _b.options
      }, ((_c = currentQuestion.value) == null ? void 0 : _c.options) ? {
        k: common_vendor.f(currentQuestion.value.options, (option, oIndex, i0) => {
          return {
            a: common_vendor.t(option.text),
            b: oIndex,
            c: String.fromCharCode(65 + oIndex),
            d: common_vendor.o(($event) => selectOption(option), oIndex)
          };
        })
      } : {}) : {
        l: common_vendor.t(_ctx.userNickname),
        m: common_vendor.t((/* @__PURE__ */ new Date()).toLocaleDateString()),
        n: common_vendor.t(dynamicDescription.value)
      }, {
        c: currentStep.value === "testing"
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e34642a6"]]);
_sfc_main.__runtimeHooks = 2;
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/personality-lab/index.js.map
