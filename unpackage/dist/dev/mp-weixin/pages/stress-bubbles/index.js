"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const engine = common_vendor.matterExports.Engine.create();
    let render;
    const GAME_CONFIG = {
      DURATION: 15,
      // 游戏时长(秒)
      SPAWN_INTERVAL: 3,
      // 泡泡生成间隔(秒)
      BATCH_COUNT: 10,
      // 每次生成10个
      BUBBLE: {
        MIN_SIZE: 40,
        MAX_SIZE: 80,
        LIFETIME: 8
        // 泡泡存活时间(秒)
      }
    };
    const gameState = common_vendor.reactive({
      score: 0,
      timeLeft: GAME_CONFIG.DURATION,
      isPlaying: false,
      bubbles: /* @__PURE__ */ new Set()
      // 使用Set存储当前泡泡
    });
    const sounds = {
      pop: () => common_vendor.index.createInnerAudioContext({ src: "/static/pop.mp3" }).play(),
      coin: () => common_vendor.index.createInnerAudioContext({ src: "/static/coin.mp3" }).play(),
      explosion: () => common_vendor.index.createInnerAudioContext({ src: "/static/explosion.mp3" }).play()
    };
    common_vendor.computed(() => {
      if (gameState.stressLevel <= 30) {
        return { count: 3, speed: 1, type: "NORMAL" };
      } else if (gameState.stressLevel <= 60) {
        return { count: 6, speed: 1.5, type: "SPIKY" };
      } else {
        return { count: 10, speed: 2, type: "COMPLEX" };
      }
    });
    common_vendor.computed(() => ({
      background: `linear-gradient(to right, #89C4F4, ${getStressColor()})`,
      opacity: gameState.stressLevel / 100 * 0.8 + 0.2
    }));
    const getStressColor = () => {
      if (gameState.stressLevel <= 30)
        return "#89C4F4";
      if (gameState.stressLevel <= 60)
        return "#FFA500";
      return "#E74C3C";
    };
    const PARTICLE_CONFIG = {
      TYPES: [
        { sides: 5, size: 8, color: "#FF6B6B" },
        // 星形
        { sides: 6, size: 10, color: "#4ECDC4" },
        // 六边形
        { sides: 8, size: 12, color: "#45B7D1" },
        // 八边形
        { sides: 3, size: 6, color: "#FFE66D" }
        // 三角形
      ],
      POOL_SIZE: 100,
      particles: []
    };
    const windowInfo = common_vendor.ref(common_vendor.index.getWindowInfo());
    let canvas = null;
    let renderId = null;
    const renderLoop = () => {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#89C4F4");
      gradient.addColorStop(1, "#6C8CD5");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      common_vendor.matterExports.Composite.allBodies(engine.world).forEach((body) => {
        if (body.circleRadius) {
          const ctx2 = canvas.getContext("2d");
          const gradient2 = ctx2.createRadialGradient(
            body.position.x - body.circleRadius / 5,
            body.position.y - body.circleRadius / 5,
            body.circleRadius * 0.15,
            body.position.x,
            body.position.y,
            body.circleRadius * 1.1
          );
          gradient2.addColorStop(0, "rgba(255,255,255,0.95)");
          gradient2.addColorStop(0.4, "rgba(137,196,244,0.3)");
          gradient2.addColorStop(0.8, "rgba(108,140,213,0.2)");
          gradient2.addColorStop(1, "rgba(255,255,255,0)");
          ctx2.beginPath();
          ctx2.arc(body.position.x, body.position.y, body.circleRadius, 0, Math.PI * 2);
          ctx2.fillStyle = gradient2;
          ctx2.fill();
          ctx2.beginPath();
          ctx2.arc(body.position.x, body.position.y, body.circleRadius * 0.8, 0, Math.PI * 2);
          ctx2.fillStyle = "rgba(255,255,255,0.15)";
          ctx2.fill();
          ctx2.beginPath();
          ctx2.arc(
            body.position.x - body.circleRadius / 4,
            body.position.y - body.circleRadius / 4,
            body.circleRadius / 4,
            0,
            Math.PI * 2
          );
          ctx2.fillStyle = "rgba(255,255,255,0.5)";
          ctx2.fill();
          ctx2.beginPath();
          ctx2.arc(
            body.position.x + body.circleRadius / 2,
            body.position.y + body.circleRadius / 2,
            body.circleRadius / 8,
            0,
            Math.PI * 2
          );
          ctx2.fillStyle = "rgba(255,255,255,0.2)";
          ctx2.fill();
          ctx2.beginPath();
          ctx2.arc(body.position.x, body.position.y, body.circleRadius * 0.9, 0, Math.PI * 2);
          ctx2.shadowColor = "rgba(0,0,0,0.15)";
          ctx2.shadowBlur = 12;
          ctx2.shadowOffsetY = 2;
          ctx2.fillStyle = "rgba(0,0,0,0.1)";
          ctx2.fill();
          ctx2.shadowBlur = 0;
          ctx2.shadowOffsetY = 0;
          ctx2.beginPath();
          ctx2.arc(
            body.position.x + Math.cos(Date.now() / 800) * body.circleRadius / 2,
            body.position.y + Math.sin(Date.now() / 800) * body.circleRadius / 2,
            body.circleRadius / 8,
            0,
            Math.PI * 2
          );
          ctx2.fillStyle = "rgba(255,255,255,0.25)";
          ctx2.fill();
        } else {
          ctx.beginPath();
          body.vertices.forEach((vertex) => {
            ctx.lineTo(vertex.x, vertex.y);
          });
          ctx.closePath();
          ctx.fillStyle = "#4CAF50";
          ctx.fill();
        }
      });
      common_vendor.matterExports.Composite.allBodies(engine.world).forEach((body) => {
        var _a;
        if ((_a = body.plugin) == null ? void 0 : _a.isParticle) {
          ctx.beginPath();
          ctx.arc(body.position.x, body.position.y, body.circleRadius, 0, Math.PI * 2);
          ctx.fillStyle = body.render.fillStyle;
          ctx.shadowColor = body.render.fillStyle;
          ctx.shadowBlur = 15;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });
      common_vendor.matterExports.Composite.allBodies(engine.world).forEach((body) => {
        var _a;
        if ((_a = body.plugin) == null ? void 0 : _a.isParticle) {
          ctx.beginPath();
          ctx.moveTo(body.position.x, body.position.y);
          ctx.lineTo(
            body.position.x - body.velocity.x * 2,
            body.position.y - body.velocity.y * 2
          );
          ctx.strokeStyle = body.render.fillStyle;
          ctx.lineWidth = 3;
          ctx.stroke();
        }
      });
      renderId = setTimeout(renderLoop, 1e3 / 60);
    };
    const getBubbleAtPosition = (pos) => {
      return common_vendor.matterExports.Query.point(common_vendor.matterExports.Composite.allBodies(engine.world), pos).find((body) => gameState.bubbles.has(body));
    };
    const handleCanvasTouch = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const canvasRect = await new Promise((resolve) => {
        common_vendor.index.createSelectorQuery().select("#gameCanvas").boundingClientRect((rect) => resolve(rect)).exec();
      });
      const touch = e.touches[0];
      const pos = {
        x: (touch.x - canvasRect.left) * (canvas.width / canvasRect.width),
        y: (touch.y - canvasRect.top) * (canvas.height / canvasRect.height)
      };
      const clickedBubble = getBubbleAtPosition(pos);
      if (clickedBubble) {
        common_vendor.matterExports.World.remove(engine.world, clickedBubble);
        gameState.bubbles.delete(clickedBubble);
        sounds.pop();
        createParticleExplosion(pos.x, pos.y);
        const sizeBonus = Math.floor(clickedBubble.circleRadius / 10);
        gameState.score += 10 + sizeBonus;
        gameState.comboCount = (gameState.comboCount || 0) + 1;
        setTimeout(() => gameState.comboCount--, 2e3);
      }
    };
    const startGame = () => {
      gameState.isPlaying = true;
      gameState.score = 0;
      gameState.timeLeft = GAME_CONFIG.DURATION;
      const spawnInterval = setInterval(() => {
        if (gameState.isPlaying) {
          for (let i = 0; i < GAME_CONFIG.BATCH_COUNT; i++) {
            createBubble(i, GAME_CONFIG.BATCH_COUNT);
          }
        }
      }, GAME_CONFIG.SPAWN_INTERVAL * 1e3);
      const timer = setInterval(() => {
        if (--gameState.timeLeft <= 0) {
          gameState.isPlaying = false;
          clearInterval(spawnInterval);
          clearInterval(timer);
        }
      }, 1e3);
    };
    const createParticleExplosion = (x, y) => {
      const origin = {
        x: x || windowInfo.value.windowWidth / 2,
        y: y || windowInfo.value.windowHeight / 2
      };
      const availableParticles = PARTICLE_CONFIG.particles.filter((p) => !p.plugin.active).slice(0, 10);
      availableParticles.forEach((p) => {
        common_vendor.matterExports.Body.setPosition(p, origin);
        common_vendor.matterExports.Body.setVelocity(p, { x: 0, y: 0 });
        common_vendor.matterExports.Body.setAngularVelocity(p, 0);
        p.plugin.active = true;
        p.render.fillStyle = common_vendor.matterExports.Common.choose(["#FF6B6B", "#FFE66D", "#89C4F4", "#4ECDC4"]);
        p.circleRadius = common_vendor.matterExports.Common.random(4, 8);
        p.restitution = 0.9;
        const angle = Math.random() * Math.PI * 2;
        const force = 0.15 + Math.random() * 0.1;
        common_vendor.matterExports.Body.applyForce(p, origin, {
          x: Math.cos(angle) * force,
          y: Math.sin(angle) * force
        });
        common_vendor.matterExports.Body.setAngularVelocity(p, common_vendor.matterExports.Common.random(-0.2, 0.2));
        setTimeout(() => {
          p.plugin.active = false;
          common_vendor.matterExports.Body.setPosition(p, { x: -100, y: -100 });
        }, 1e3);
      });
      sounds.explosion();
      const ctx = render.context;
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, 40, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 40);
      gradient.addColorStop(0, "rgba(255,255,255,0.8)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.restore();
      availableParticles.forEach((p) => {
        p.render.strokeStyle = `rgba(255,255,255,${common_vendor.matterExports.Common.random(0.3, 0.7)})`;
        p.render.lineWidth = 2;
      });
    };
    common_vendor.onMounted(() => {
      const instance = common_vendor.getCurrentInstance();
      const query = common_vendor.index.createSelectorQuery().in(instance.proxy);
      query.select("#gameCanvas").fields({ node: true, size: true }).exec((res) => {
        canvas = res[0].node;
        const dpr = common_vendor.index.getWindowInfo().pixelRatio;
        canvas.width = windowInfo.value.windowWidth * dpr;
        canvas.height = windowInfo.value.windowHeight * dpr;
        canvas.getContext("2d");
        windowInfo.value = common_vendor.index.getWindowInfo();
        engine.world.bounds = {
          min: { x: 0, y: 0 },
          max: { x: canvas.width, y: canvas.height }
        };
        common_vendor.matterExports.World.add(engine.world, [
          common_vendor.matterExports.Bodies.rectangle(0, -10, 5e3, 20, { isStatic: true }),
          // 顶部边界
          common_vendor.matterExports.Bodies.rectangle(0, windowInfo.value.windowHeight + 10, 5e3, 20, { isStatic: true }),
          // 底部边界
          common_vendor.matterExports.Bodies.rectangle(canvas.width / 2, -10, canvas.width, 20, {
            isStatic: true,
            render: { fillStyle: "#FF0000" }
          }),
          common_vendor.matterExports.Bodies.rectangle(canvas.width / 2, canvas.height + 10, canvas.width, 20, {
            isStatic: true,
            render: { fillStyle: "#FF0000" }
          }),
          common_vendor.matterExports.Bodies.rectangle(-10, canvas.height / 2, 20, canvas.height, {
            isStatic: true,
            render: { fillStyle: "#00FF00" }
          }),
          common_vendor.matterExports.Bodies.rectangle(
            canvas.width - 20,
            // 将边界移动到画布内部边缘
            canvas.height / 2,
            60,
            // 增加边界厚度
            canvas.height,
            {
              isStatic: true,
              render: { fillStyle: "#00FF00" },
              collisionFilter: {
                category: 2,
                // 使用不同的碰撞分类
                mask: 1
                // 只与泡泡分类交互
              },
              chamfer: { radius: 10 }
            }
          ),
          // 左侧边界（新增）
          common_vendor.matterExports.Bodies.rectangle(-30, canvas.height / 2, 60, canvas.height, {
            isStatic: true,
            restitution: 0.8,
            // 增加弹性系数
            collisionFilter: {
              category: 2,
              mask: 1
            },
            chamfer: { radius: 10 },
            render: { fillStyle: "#00FF00" }
          }),
          // 右侧边界（调整位置和参数）
          common_vendor.matterExports.Bodies.rectangle(canvas.width + 30, canvas.height / 2, 60, canvas.height, {
            isStatic: true,
            restitution: 0.8,
            // 增加弹性系数
            collisionFilter: {
              category: 2,
              mask: 1
            },
            chamfer: { radius: 10 },
            render: { fillStyle: "#00FF00" }
          })
        ]);
        render = common_vendor.matterExports.Render.create({
          canvas,
          engine,
          options: {
            width: windowInfo.value.windowWidth,
            height: windowInfo.value.windowHeight,
            wireframes: false,
            background: "#FFFFFF00",
            hasBounds: false,
            enabled: false
          }
        });
        common_vendor.matterExports.Runner.run(engine);
        renderLoop();
        if (typeof window === "undefined") {
          window = {};
        }
        if (!window.requestAnimationFrame) {
          window.requestAnimationFrame = (callback) => {
            return setTimeout(callback, 1e3 / 60);
          };
        }
        if (!window.cancelAnimationFrame) {
          window.cancelAnimationFrame = (id) => {
            clearTimeout(id);
          };
        }
        common_vendor.matterExports.Engine.update(engine, {
          timing: {
            timeScale: 0.8
            // 放慢物理模拟速度
          }
        });
        engine.gravity.y = 0.5;
        engine.gravity.x = common_vendor.matterExports.Common.random(-0.1, 0.1);
      });
    });
    common_vendor.onUnmounted(() => {
      if (renderId) {
        clearTimeout(renderId);
        renderId = null;
      }
      common_vendor.matterExports.Render.stop(render);
      common_vendor.matterExports.World.clear(engine.world);
      common_vendor.matterExports.Engine.clear(engine);
    });
    const createBubble = (index = 0, total = 1) => {
      const size = common_vendor.matterExports.Common.random(GAME_CONFIG.BUBBLE.MIN_SIZE, GAME_CONFIG.BUBBLE.MAX_SIZE);
      const baseX = canvas.width * 0.1 + canvas.width * 0.8 / total * index;
      const baseY = canvas.height - size * 0.5;
      const bubble = common_vendor.matterExports.Bodies.circle(
        baseX + common_vendor.matterExports.Common.random(-30, 30),
        baseY - common_vendor.matterExports.Common.random(0, 50),
        size / 2,
        {
          restitution: 0.6,
          frictionAir: 0.1,
          density: 1e-3,
          render: {
            fillStyle: "rgba(255,255,255,0.1)",
            strokeStyle: "#FFFFFF00",
            // 临时颜色
            lineWidth: 3,
            shadowColor: "rgba(255,255,255,0.3)",
            shadowBlur: 20
          },
          plugin: {
            birthTime: Date.now()
          },
          collisionFilter: {
            category: 1,
            // 泡泡分类
            mask: 2
            // 只与边界分类交互
          },
          label: "bubble"
          // 增加这个标签
        }
      );
      common_vendor.matterExports.Body.applyForce(bubble, bubble.position, {
        x: common_vendor.matterExports.Common.random(-0.01, 0.01),
        y: common_vendor.matterExports.Common.random(-0.2, -0.3)
        // 增强垂直方向作用力
      });
      common_vendor.matterExports.Body.setAngularVelocity(bubble, common_vendor.matterExports.Common.random(-0.02, 0.02));
      common_vendor.matterExports.Body.applyForce(bubble, {
        x: bubble.position.x + common_vendor.matterExports.Common.random(-10, 10),
        y: bubble.position.y + common_vendor.matterExports.Common.random(-10, 10)
      }, {
        x: common_vendor.matterExports.Common.random(-1e-4, 1e-4),
        y: common_vendor.matterExports.Common.random(-1e-4, 1e-4)
      });
      common_vendor.matterExports.World.add(engine.world, bubble);
      gameState.bubbles.add(bubble);
      setTimeout(() => {
        if (gameState.bubbles.has(bubble)) {
          common_vendor.matterExports.World.remove(engine.world, bubble);
          gameState.bubbles.delete(bubble);
          if (gameState.isPlaying)
            gameState.score -= 2;
        }
      }, GAME_CONFIG.BUBBLE.LIFETIME * 1e3);
      bubble.render.strokeStyle = createBubbleGradient(
        render.context,
        size * 2,
        bubble.position.x,
        bubble.position.y
      );
    };
    const createBubbleGradient = (ctx, size, x, y) => {
      const gradient = ctx.createRadialGradient(
        x,
        y,
        size * 0.1,
        x,
        y,
        size * 0.8
      );
      gradient.addColorStop(0, "rgba(255,255,255,0.9)");
      gradient.addColorStop(0.5, "rgba(169,216,255,0.6)");
      gradient.addColorStop(0.8, "rgba(255,192,203,0.3)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      return gradient;
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(handleCanvasTouch),
        b: common_vendor.t(gameState.timeLeft),
        c: common_vendor.t(gameState.score),
        d: common_vendor.t(gameState.isPlaying ? "加油戳" : "开始戳"),
        e: common_vendor.o(startGame),
        f: gameState.isPlaying
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/stress-bubbles/index.js.map
