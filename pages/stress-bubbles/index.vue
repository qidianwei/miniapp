<script setup>
import { ref, reactive, computed, onMounted, getCurrentInstance, onUnmounted } from 'vue'
import { 
  Engine, 
  World, 
  Bodies, 
  Composite,
  Render,
  Body,
  Common,
  Bounds,
  Runner,
  Query
} from 'matter-js'

// 物理引擎实例
const engine = Engine.create()
let render

// 游戏配置
const GAME_CONFIG = {
  DURATION: 15,      // 游戏时长(秒)
  SPAWN_INTERVAL: 3, // 泡泡生成间隔(秒)
  BATCH_COUNT: 10,    // 每次生成10个
  BUBBLE: {
    MIN_SIZE: 40,
    MAX_SIZE: 80,
    LIFETIME: 8      // 泡泡存活时间(秒)
  }
}

// 游戏状态
const gameState = reactive({
  score: 0,
  timeLeft: GAME_CONFIG.DURATION,
  isPlaying: false,
  bubbles: new Set() // 使用Set存储当前泡泡
})

// 音效系统
const sounds = {
  pop: () => uni.createInnerAudioContext({ src: '/static/pop.mp3' }).play(),
  coin: () => uni.createInnerAudioContext({ src: '/static/coin.mp3' }).play(),
  explosion: () => uni.createInnerAudioContext({ src: '/static/explosion.mp3' }).play()
}

// 泡泡配置
const BUBBLE_TYPES = {
  NORMAL: { 
    color: '#89C4F4',
    effects: { 
      particles: 8,
      texture: 'water' 
    }
  },
  GOLDEN: {
    color: '#FFD700',
    effects: {
      particles: 12,
      texture: 'coin'
    }
  }
}

// 压力等级计算
const stressConfig = computed(() => {
  if (gameState.stressLevel <= 30) {
    return { count: 3, speed: 1, type: 'NORMAL' }
  } else if (gameState.stressLevel <= 60) {
    return { count: 6, speed: 1.5, type: 'SPIKY' }
  } else {
    return { count: 10, speed: 2, type: 'COMPLEX' }
  }
})

// 压力可视化样式
const stressStyle = computed(() => ({
  background: `linear-gradient(to right, #89C4F4, ${getStressColor()})`,
  opacity: gameState.stressLevel / 100 * 0.8 + 0.2
}))

const getStressColor = () => {
  if (gameState.stressLevel <= 30) return '#89C4F4'
  if (gameState.stressLevel <= 60) return '#FFA500'
  return '#E74C3C'
}

// 粒子系统配置
const PARTICLE_CONFIG = {
  TYPES: [
    { sides: 5, size: 8, color: '#FF6B6B' },    // 星形
    { sides: 6, size: 10, color: '#4ECDC4' },   // 六边形
    { sides: 8, size: 12, color: '#45B7D1' },   // 八边形
    { sides: 3, size: 6, color: '#FFE66D' }     // 三角形
  ],
  POOL_SIZE: 100,
  particles: []
}

// 添加全局窗口信息
const windowInfo = ref(uni.getWindowInfo())

// 在初始化时获取canvas引用
let canvas = null

// 在顶部声明 renderId
let renderId = null

// 在渲染循环中添加调试标记
const renderLoop = () => {
  const ctx = canvas.getContext('2d')
  
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  // 绘制渐变背景
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
  gradient.addColorStop(0, '#89C4F4')
  gradient.addColorStop(1, '#6C8CD5')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  // 手动绘制所有物体
  Composite.allBodies(engine.world).forEach(body => {
    if (body.circleRadius) {
      const ctx = canvas.getContext('2d')
      
      // 优化渐变效果
      const gradient = ctx.createRadialGradient(
        body.position.x - body.circleRadius/5,
        body.position.y - body.circleRadius/5,
        body.circleRadius * 0.15,
        body.position.x,
        body.position.y,
        body.circleRadius * 1.1
      )
      gradient.addColorStop(0, 'rgba(255,255,255,0.95)')
      gradient.addColorStop(0.4, 'rgba(137,196,244,0.3)')
      gradient.addColorStop(0.8, 'rgba(108,140,213,0.2)')
      gradient.addColorStop(1, 'rgba(255,255,255,0)')

      // 绘制主泡泡
      ctx.beginPath()
      ctx.arc(body.position.x, body.position.y, body.circleRadius, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()

      // 添加透明内层
      ctx.beginPath()
      ctx.arc(body.position.x, body.position.y, body.circleRadius * 0.8, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255,255,255,0.15)'
      ctx.fill()

      // 优化高光效果
      ctx.beginPath()
      ctx.arc(
        body.position.x - body.circleRadius/4,
        body.position.y - body.circleRadius/4,
        body.circleRadius/4,
        0, 
        Math.PI * 2
      )
      ctx.fillStyle = 'rgba(255,255,255,0.5)'
      ctx.fill()

      // 添加反射光
      ctx.beginPath()
      ctx.arc(
        body.position.x + body.circleRadius/2,
        body.position.y + body.circleRadius/2,
        body.circleRadius/8,
        0,
        Math.PI * 2
      )
      ctx.fillStyle = 'rgba(255,255,255,0.2)'
      ctx.fill()

      // 优化边缘阴影
      ctx.beginPath()
      ctx.arc(body.position.x, body.position.y, body.circleRadius * 0.9, 0, Math.PI * 2)
      ctx.shadowColor = 'rgba(0,0,0,0.15)'
      ctx.shadowBlur = 12
      ctx.shadowOffsetY = 2
      ctx.fillStyle = 'rgba(0,0,0,0.1)'
      ctx.fill()
      ctx.shadowBlur = 0
      ctx.shadowOffsetY = 0

      // 优化动态光效
      ctx.beginPath()
      ctx.arc(
        body.position.x + Math.cos(Date.now()/800)*body.circleRadius/2,
        body.position.y + Math.sin(Date.now()/800)*body.circleRadius/2,
        body.circleRadius/8,
        0,
        Math.PI * 2
      )
      ctx.fillStyle = 'rgba(255,255,255,0.25)'
      ctx.fill()
    } else {
      // 绘制多边形边界
      ctx.beginPath()
      body.vertices.forEach(vertex => {
        ctx.lineTo(vertex.x, vertex.y)
      })
      ctx.closePath()
      ctx.fillStyle = '#4CAF50'
      ctx.fill()
    }
  })
  
  // 绘制魔法光点
  Composite.allBodies(engine.world).forEach(body => {
    if (body.plugin?.isParticle) {
      ctx.beginPath()
      ctx.arc(body.position.x, body.position.y, body.circleRadius, 0, Math.PI * 2)
      ctx.fillStyle = body.render.fillStyle
      ctx.shadowColor = body.render.fillStyle
      ctx.shadowBlur = 15
      ctx.fill()
      ctx.shadowBlur = 0
    }
  })
  
  // 绘制粒子拖尾
  Composite.allBodies(engine.world).forEach(body => {
    if (body.plugin?.isParticle) {
      ctx.beginPath()
      ctx.moveTo(body.position.x, body.position.y)
      ctx.lineTo(
        body.position.x - body.velocity.x * 2, 
        body.position.y - body.velocity.y * 2
      )
      ctx.strokeStyle = body.render.fillStyle
      ctx.lineWidth = 3
      ctx.stroke()
    }
  })
  
  renderId = setTimeout(renderLoop, 1000 / 60)
}

// 在 handleCanvasTouch 函数上方添加以下代码
const getBubbleAtPosition = (pos) => {
  return Query.point(Composite.allBodies(engine.world), pos)
    .find(body => gameState.bubbles.has(body));
};

// 修改现有的 handleCanvasTouch 函数
const handleCanvasTouch = async (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  // 获取点击位置
  const canvasRect = await new Promise(resolve => {
    uni.createSelectorQuery()
      .select('#gameCanvas')
      .boundingClientRect(rect => resolve(rect))
      .exec();
  });

  const touch = e.touches[0];
  const pos = {
    x: (touch.x - canvasRect.left) * (canvas.width / canvasRect.width),
    y: (touch.y - canvasRect.top) * (canvas.height / canvasRect.height)
  };

  // 查询点击位置下的泡泡
  const clickedBubble = getBubbleAtPosition(pos);
  
  if (clickedBubble) {
    // 移除泡泡
    World.remove(engine.world, clickedBubble);
    gameState.bubbles.delete(clickedBubble);
    
    // 播放音效和特效
    sounds.pop();
    createParticleExplosion(pos.x, pos.y);
    
    // 得分逻辑
    const sizeBonus = Math.floor(clickedBubble.circleRadius / 10);
    gameState.score += 10 + sizeBonus;
    
    // 连击效果
    gameState.comboCount = (gameState.comboCount || 0) + 1;
    setTimeout(() => gameState.comboCount--, 2000);
  }
};

// 游戏控制
const startGame = () => {
  gameState.isPlaying = true
  gameState.score = 0
  gameState.timeLeft = GAME_CONFIG.DURATION

  // 生成泡泡循环
  const spawnInterval = setInterval(() => {
    if (gameState.isPlaying) {
      // 批量生成泡泡
      for(let i = 0; i < GAME_CONFIG.BATCH_COUNT; i++) {
        createBubble(i, GAME_CONFIG.BATCH_COUNT)
      }
    }
  }, GAME_CONFIG.SPAWN_INTERVAL * 1000)

  // 倒计时
  const timer = setInterval(() => {
    if (--gameState.timeLeft <= 0) {
      gameState.isPlaying = false
      clearInterval(spawnInterval)
      clearInterval(timer)
    }
  }, 1000)
}

// 创建粒子爆炸
const createParticleExplosion = (x, y) => {
  const origin = { 
    x: x || windowInfo.value.windowWidth/2, 
    y: y || windowInfo.value.windowHeight/2 
  }
  
  // 获取10个可用粒子
  const availableParticles = PARTICLE_CONFIG.particles
    .filter(p => !p.plugin.active)
    .slice(0, 10)
  
  availableParticles.forEach(p => {
    // 重置粒子状态
    Body.setPosition(p, origin)
    Body.setVelocity(p, { x: 0, y: 0 })
    Body.setAngularVelocity(p, 0)
    p.plugin.active = true
    
    // 修改粒子属性
    p.render.fillStyle = Common.choose(['#FF6B6B', '#FFE66D', '#89C4F4', '#4ECDC4'])
    p.circleRadius = Common.random(4, 8)
    p.restitution = 0.9
    
    // 增强爆炸力度
    const angle = Math.random() * Math.PI * 2
    const force = 0.15 + Math.random() * 0.1
    Body.applyForce(p, origin, {
      x: Math.cos(angle) * force,
      y: Math.sin(angle) * force
    })
    
    // 添加旋转效果
    Body.setAngularVelocity(p, Common.random(-0.2, 0.2))
    
    // 自动回收
    setTimeout(() => {
      p.plugin.active = false
      Body.setPosition(p, { x: -100, y: -100 })
    }, 1000)
  })
  
  // 播放音效
  sounds.explosion()

  // 添加光晕特效
  const ctx = render.context
  ctx.save()
  ctx.beginPath()
  ctx.arc(x, y, 40, 0, Math.PI * 2)
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, 40)
  gradient.addColorStop(0, 'rgba(255,255,255,0.8)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = gradient
  ctx.fill()
  ctx.restore()

  // 添加粒子拖尾效果
  availableParticles.forEach(p => {
    p.render.strokeStyle = `rgba(255,255,255,${Common.random(0.3, 0.7)})`
    p.render.lineWidth = 2
  })
}

const getTouchPos = (e) => {
  return {
    x: e.touches?.[0]?.x || e.x,
    y: e.touches?.[0]?.y || e.y
  }
}

const updateStressLevel = () => {
  gameState.stressLevel = Math.min(
    gameState.stressLevel + gameState.comboCount * 0.5, 
    100
  )
}

// 在初始化时获取canvas引用
onMounted(() => {
  const instance = getCurrentInstance()
  const query = uni.createSelectorQuery().in(instance.proxy)
  query.select('#gameCanvas').fields({ node: true, size: true }).exec((res) => {
    canvas = res[0].node
    
    // 设置物理分辨率
    const dpr = uni.getWindowInfo().pixelRatio
    canvas.width = windowInfo.value.windowWidth * dpr
    canvas.height = windowInfo.value.windowHeight * dpr

    const ctx = canvas.getContext('2d')
    windowInfo.value = uni.getWindowInfo()

    // 在初始化时设置物理边界
    engine.world.bounds = {
      min: { x: 0, y: 0 },
      max: { x: canvas.width, y: canvas.height }
    }

    // 设置物理边界
    World.add(engine.world, [
      Bodies.rectangle(0, -10, 5000, 20, { isStatic: true }), // 顶部边界
      Bodies.rectangle(0, windowInfo.value.windowHeight + 10, 5000, 20, { isStatic: true }), // 底部边界
      Bodies.rectangle(canvas.width/2, -10, canvas.width, 20, { 
        isStatic: true,
        render: { fillStyle: '#FF0000' }
      }),
      Bodies.rectangle(canvas.width/2, canvas.height + 10, canvas.width, 20, { 
        isStatic: true,
        render: { fillStyle: '#FF0000' }
      }),
      Bodies.rectangle(-10, canvas.height/2, 20, canvas.height, { 
        isStatic: true,
        render: { fillStyle: '#00FF00' }
      }),
      Bodies.rectangle(canvas.width - 20, // 将边界移动到画布内部边缘
        canvas.height/2,
        60,  // 增加边界厚度
        canvas.height, 
        { 
          isStatic: true,
          render: { fillStyle: '#00FF00' },
          collisionFilter: {
            category: 0x0002, // 使用不同的碰撞分类
            mask: 0x0001      // 只与泡泡分类交互
          },
          chamfer: { radius: 10 }
        }
      ),
      // 左侧边界（新增）
      Bodies.rectangle(-30, canvas.height/2, 60, canvas.height, { 
        isStatic: true,
        restitution: 0.8, // 增加弹性系数
        collisionFilter: {
          category: 0x0002,
          mask: 0x0001
        },
        chamfer: { radius: 10 },
        render: { fillStyle: '#00FF00' }
      }),
      // 右侧边界（调整位置和参数）
      Bodies.rectangle(canvas.width + 30, canvas.height/2, 60, canvas.height, { 
        isStatic: true,
        restitution: 0.8, // 增加弹性系数
        collisionFilter: {
          category: 0x0002,
          mask: 0x0001
        },
        chamfer: { radius: 10 },
        render: { fillStyle: '#00FF00' }
      })
    ])

    // 初始化渲染器
    render = Render.create({
      canvas: canvas,
      engine: engine,
      options: {
        width: windowInfo.value.windowWidth,
        height: windowInfo.value.windowHeight,
        wireframes: false,
        background: '#FFFFFF00',
        hasBounds: false,
        enabled: false
      }
    })
    
    Runner.run(engine)

    // 使用自定义渲染循环
    renderLoop()

    // 添加小程序环境适配
    if (typeof window === 'undefined') {
      window = {}
    }
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = (callback) => {
        return setTimeout(callback, 1000 / 60)
      }
    }
    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = (id) => {
        clearTimeout(id)
      }
    }

    // 在引擎初始化后添加
    Engine.update(engine, {
      timing: {
        timeScale: 0.8 // 放慢物理模拟速度
      }
    })
    
    // 修改重力设置
    engine.gravity.y = 0.5 // 降低垂直重力
    engine.gravity.x = Common.random(-0.1, 0.1) // 添加随机水平重力
  })
})

// 在组件销毁时停止循环
onUnmounted(() => {
  if (renderId) {
    clearTimeout(renderId)
    renderId = null
  }
  Render.stop(render)
  World.clear(engine.world)
  Engine.clear(engine)
})

// 修改泡泡生成逻辑
const createBubble = (index = 0, total = 1) => {
  const size = Common.random(GAME_CONFIG.BUBBLE.MIN_SIZE, GAME_CONFIG.BUBBLE.MAX_SIZE)
  const baseX = canvas.width * 0.1 + (canvas.width * 0.8 / total) * index
  const baseY = canvas.height - size * 0.5 // 提高生成位置
  
  const bubble = Bodies.circle(
    baseX + Common.random(-30, 30),
    baseY - Common.random(0, 50),
    size/2,
    {
      restitution: 0.6,
      frictionAir: 0.1,
      density: 0.001,
      render: {
        fillStyle: 'rgba(255,255,255,0.1)',
        strokeStyle: '#FFFFFF00', // 临时颜色
        lineWidth: 3,
        shadowColor: 'rgba(255,255,255,0.3)',
        shadowBlur: 20
      },
      plugin: {
        birthTime: Date.now()
      },
      collisionFilter: {
        category: 0x0001, // 泡泡分类
        mask: 0x0002      // 只与边界分类交互
      },
      label: 'bubble' // 增加这个标签
    }
  )

  // 修改初始作用力
  Body.applyForce(bubble, bubble.position, {
    x: Common.random(-0.01, 0.01),
    y: Common.random(-0.2, -0.3) // 增强垂直方向作用力
  })

  // 添加随机旋转
  Body.setAngularVelocity(bubble, Common.random(-0.02, 0.02))
  Body.applyForce(bubble, {
    x: bubble.position.x + Common.random(-10, 10),
    y: bubble.position.y + Common.random(-10, 10)
  }, {
    x: Common.random(-0.0001, 0.0001),
    y: Common.random(-0.0001, 0.0001)
  })

  World.add(engine.world, bubble)
  gameState.bubbles.add(bubble)
  
  // 自动消失计时
  setTimeout(() => {
    if (gameState.bubbles.has(bubble)) {
      World.remove(engine.world, bubble)
      gameState.bubbles.delete(bubble)
      if (gameState.isPlaying) gameState.score -= 2 // 未及时戳破扣分
    }
  }, GAME_CONFIG.BUBBLE.LIFETIME * 1000)

  // 在泡泡创建后添加渐变
  bubble.render.strokeStyle = createBubbleGradient(
    render.context, 
    size * 2, 
    bubble.position.x, 
    bubble.position.y
  )
}

// 修改渐变生成函数
const createBubbleGradient = (ctx, size, x, y) => {
  const gradient = ctx.createRadialGradient(
    x, y, size * 0.1, 
    x, y, size * 0.8
  )
  gradient.addColorStop(0, 'rgba(255,255,255,0.9)')
  gradient.addColorStop(0.5, 'rgba(169,216,255,0.6)')
  gradient.addColorStop(0.8, 'rgba(255,192,203,0.3)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  return gradient
}
</script>

<template>
  <view class="container">
    <canvas canvas-id="gameCanvas" 
            id="gameCanvas" 
            type="2d" 
            @touchstart="handleCanvasTouch"
            style="width: 100%; height: 90vh; position: absolute; z-index: 0;" />
    
    <!-- 游戏控制面板 -->
    <view class="control-panel">
      <text>时间: {{ gameState.timeLeft }}s</text>
      <text>得分: {{ gameState.score }}</text>
      <button @tap="startGame" :disabled="gameState.isPlaying">
        {{ gameState.isPlaying ? '加油戳' : '开始戳' }}
      </button>
    </view>
  </view>
</template>

<style>
.container {
  position: relative;
  height: 100vh;
  padding: 0;
}

#gameCanvas {
  position: absolute;
  z-index: 0;
}

.control-panel {
  position: fixed;
  bottom: 0rpx;
  left: 60%;
  transform: translateX(-50%);
  width: 100%;
  padding: 4px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.1);
  z-index: 1;
}

button {
  background: #4CAF50;
  color: white;
  padding: 8px 16px;
  border-radius: 5px;
  font-size: 28rpx;
}

text {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
}
</style> 