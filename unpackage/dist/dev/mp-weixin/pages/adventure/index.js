"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const adventures = [
      "用奇怪的声音朗读一段课文",
      '给通讯录第5个人打电话说"我知道你的秘密"',
      "模仿一种动物直到有人猜对",
      "用非惯用手写自己的名字并拍照",
      "向陌生人请求拥抱",
      "在公共场合跳15秒舞",
      '用三种语言说"我爱你"',
      "发一条只有表情的朋友圈",
      "倒立喝一口水（注意安全）",
      "模仿一位名人的招牌动作",
      "用方言唱一首流行歌",
      "蒙眼原地转5圈后走直线",
      '给父母发"我恋爱了"然后解释是游戏',
      "用口红在脸上画图案并保持1小时",
      "模仿雕像静止3分钟",
      '用五种语气说"你好"',
      "把袜子套在手上直到下一轮",
      "用屁股写自己的名字",
      "和下一通来电者用说唱对话",
      "用滤镜自拍并设为临时头像",
      "把第一眼看到的红色物品顶在头上",
      "用播音腔朗读广告词",
      "模仿服务员给家人端茶倒水",
      "用微信翻译功能说一段绕口令",
      "把头发弄成夸张造型并拍照",
      "用五种表情说同一句话",
      "给最好的朋友发土味情话",
      "用手机前置摄像头拍一段鬼脸视频",
      "把此刻所想用倒序文字发出",
      "用左手吃饭持续下一餐",
      "模仿电影经典片段台词",
      "用三种方言自我介绍",
      "把此刻桌面拍成抽象艺术照",
      "用外语点一份虚拟外卖",
      "模仿婴儿说话10句话",
      "用便利贴贴满左手",
      "倒着念一段新闻稿",
      "用手机灯光营造舞台效果",
      "给最近联系人发谜语消息",
      "用书搭一座小塔并拍照",
      "模仿新闻主播播报天气",
      "用身边物品制作帽子佩戴",
      "把微信头像换成童年照",
      '用五种方式说"再见"',
      "模仿机器人动作跳舞",
      "用表情包编一个故事",
      "把手机壁纸换成随机颜色",
      "用软件合成自己的老年照",
      "模仿老师上课的神态动作"
    ];
    const currentTask = common_vendor.ref("点击按钮开始冒险");
    const history = common_vendor.ref([]);
    const animate = common_vendor.ref(false);
    const getRandomTask = () => {
      animate.value = true;
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * adventures.length);
        currentTask.value = adventures[randomIndex];
        history.value.unshift(currentTask.value);
        if (history.value.length > 5)
          history.value.pop();
        animate.value = false;
      }, 300);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(currentTask.value),
        b: animate.value ? 1 : "",
        c: common_vendor.o(getRandomTask),
        d: history.value.length > 0
      }, history.value.length > 0 ? {
        e: common_vendor.f(history.value, (item, index, i0) => {
          return {
            a: common_vendor.t(index + 1),
            b: common_vendor.t(item),
            c: index
          };
        })
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b8c68906"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/adventure/index.js.map
