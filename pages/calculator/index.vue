<template>
  <div class="container">
    <div class="content-wrapper" style="width: 100%; max-width: 100%">
      <view class="calculator">
        <view class="display">
          <text 
            class="display-text"
            :style="{ fontSize: fontSize + 'px' }"
          >{{ formattedDisplay }}</text>
        </view>
        <view class="buttons">
          <button class="button function" @click="clear">C</button>
          <button class="button function" @click="toggleSign">±</button>
          <button class="button function" @click="percent">%</button>
          <button class="button operator" @click="operator('/')">÷</button>
          
          <button class="button number" @click="inputNumber('7')">7</button>
          <button class="button number" @click="inputNumber('8')">8</button>
          <button class="button number" @click="inputNumber('9')">9</button>
          <button class="button operator" @click="operator('*')">×</button>
          
          <button class="button number" @click="inputNumber('4')">4</button>
          <button class="button number" @click="inputNumber('5')">5</button>
          <button class="button number" @click="inputNumber('6')">6</button>
          <button class="button operator" @click="operator('-')">−</button>
          
          <button class="button number" @click="inputNumber('1')">1</button>
          <button class="button number" @click="inputNumber('2')">2</button>
          <button class="button number" @click="inputNumber('3')">3</button>
          <button class="button operator" @click="operator('+')">+</button>
          
          <button class="button number zero" @click="inputNumber('0')">0</button>
          <button class="button number" @click="inputNumber('.')">.</button>
          <button class="button operator" @click="calculate">=</button>
        </view>
      </view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentInput: '',
      previousInput: '',
      currentOperator: null,
      waitingForOperand: false,
      fontSize: 64 // 初始字体大小
    };
  },
  computed: {
    formattedDisplay() {
      const maxLength = 10; // 最大显示长度
      let display = this.currentInput || '0';
      
      // 如果数字过长，使用科学计数法显示
      if (display.length > maxLength) {
        const num = parseFloat(display);
        if (!isNaN(num)) {
          return num.toExponential(4); // 保留4位小数
        }
      }
      return display;
    }
  },
  watch: {
    currentInput(newVal) {
      // 根据数字长度动态调整字体大小
      const baseSize = 64;
      const minSize = 32;
      const length = newVal.length;
      
      if (length <= 6) {
        this.fontSize = baseSize;
      } else if (length <= 8) {
        this.fontSize = baseSize * 0.8;
      } else if (length <= 10) {
        this.fontSize = baseSize * 0.6;
      } else {
        this.fontSize = minSize;
      }
    }
  },
  methods: {
    inputNumber(number) {
      if (this.waitingForOperand) {
        this.currentInput = number;
        this.waitingForOperand = false;
      } else {
        this.currentInput = this.currentInput === '0' ? number : this.currentInput + number;
      }
    },
    operator(op) {
      if (this.currentOperator && !this.waitingForOperand) {
        this.calculate();
      }
      this.previousInput = this.currentInput;
      this.currentOperator = op;
      this.waitingForOperand = true;
    },
    calculate() {
      const prev = parseFloat(this.previousInput);
      const current = parseFloat(this.currentInput);
      if (isNaN(prev) || isNaN(current)) {
        this.currentInput = '0'; // 如果输入无效，重置为0
        return;
      }

      let result;
      switch (this.currentOperator) {
        case '+':
          result = prev + current;
          break;
        case '-':
          result = prev - current;
          break;
        case '*':
          result = prev * current;
          break;
        case '/':
          result = prev / current;
          break;
        default:
          return;
      }

      // 处理除零错误
      if (!isFinite(result)) {
        this.currentInput = 'Error';
      } else {
        this.currentInput = String(result);
      }

      this.previousInput = '';
      this.currentOperator = null;
      this.waitingForOperand = true;
    },
    clear() {
      this.currentInput = '0'; // 重置为0而不是空字符串
      this.previousInput = '';
      this.currentOperator = null;
    },
    toggleSign() {
      if (!this.currentInput) return; // 如果当前输入为空，直接返回
      const num = parseFloat(this.currentInput);
      if (isNaN(num)) return; // 如果转换失败，直接返回
      this.currentInput = String(-num);
    },
    percent() {
      if (!this.currentInput) return; // 如果当前输入为空，直接返回
      const num = parseFloat(this.currentInput);
      if (isNaN(num)) return; // 如果转换失败，直接返回
      this.currentInput = String(num / 100);
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #1a1a1a;
  padding: 2vh;
  box-sizing: border-box;
  overflow: hidden;
}

.content-wrapper {
  width: 100%;
  max-width: 100%;
}

.calculator {
  width: clamp(300px, 90vw, 500px); /* 等比例缩放宽度 */
  height: clamp(500px, 90vh, 800px); /* 等比例缩放高度 */
  background: linear-gradient(145deg, #2d2d2d, #242424);
  border-radius: 5vh;
  padding: 2vh;
  box-shadow: 0 1vh 3vh rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &__buttons {
    display: grid;
    /* 修改为自适应列布局，最小列宽60px */
    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
    gap: 8px; /* 增加网格间隙 */
    padding: 12px;
    width: 100%;
    max-width: 400px; /* 限制最大宽度 */
    margin: 0 auto;

    /* 移动端适配 */
    @media (max-width: 480px) {
      gap: 6px;
      padding: 8px;
    }
  }

  &__button {
    /* 改为flex布局实现完美居中 */
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 60px; /* 设置最小高度 */
    padding: 12px 8px;
    font-size: 1.2em;
    border-radius: 12px;
    
    /* 响应式字体大小 */
    @media (max-width: 480px) {
      min-height: 50px;
      font-size: 1em;
      border-radius: 8px;
    }

    /* 加宽等于按钮 */
    &--equals {
      grid-column: span 2;
      min-width: 120px;
    }
  }
}

.display {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  padding: 2vh;
  overflow: hidden;
}

.display-text {
  color: #e0e0e0;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 300;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 100%;
  transition: font-size 0.2s ease;
  font-size: clamp(24px, 8vh, 64px); /* 等比例缩放字体大小 */
}

.buttons {
  flex: 2;
  display: grid;
  grid-template-columns: repeat(4, minmax(60px, 1fr));
  gap: 12px;
  padding: 16px;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  box-sizing: border-box;
}

.button {
  position: relative;
  width: 100%;
  min-height: 64px;
  border: none;
  border-radius: 16px;
  font-size: 28px;
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  background-clip: padding-box;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    opacity: 0;
    transition: opacity 0.2s;
  }
  
  &:active::after {
    opacity: 0.2;
  }

  &:hover {
    transform: scale(1.05);
    filter: brightness(110%);
  }

  &:active {
    transform: scale(0.95);
  }
}

.number {
  background-color: #404040;
  color: #ffffff;
  
  &::after {
    background: radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 80%);
  }

  &:hover {
    background-color: #4d4d4d;
  }
}

.zero {
  grid-column: span 2;
  border-radius: 32px;
  justify-content: flex-start;
  padding-left: 32px;
}

.function {
  background-color: #616161;
  color: #ffffff;
  
  &::after {
    background: radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 80%);
  }

  &:hover {
    background-color: #707070;
  }
}

.operator {
  background-color: #007AFF;
  color: #ffffff;
  
  &::after {
    background: radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 80%);
  }
  
  &.active {
    background-color: #66b3ff;
    color: #007AFF;
  }

  &:hover {
    background-color: #0066CC;
  }
}

.operator[type="equals"] {
  background-color: #00C853;
  &:hover {
    background-color: #009624;
  }
}

.button:focus-visible {
  outline: 2px solid #007AFF;
  outline-offset: 2px;
}

@media (max-width: 480px) {
  .buttons {
    gap: 8px;
    padding: 12px;
  }
  
  .button {
    min-height: 56px;
    font-size: 24px;
    border-radius: 12px;
  }
  
  .zero {
    border-radius: 24px;
    padding-left: 24px;
  }
}

@media (min-width: 768px) {
  .buttons {
    gap: 16px;
    padding: 20px;
  }
  
  .button {
    min-height: 72px;
    font-size: 32px;
  }
}
</style> 