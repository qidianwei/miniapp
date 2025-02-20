import { ref } from 'vue'

export function useRandom(options, onResult) {
  const isSpinning = ref(false)
  const displayText = ref('点击开始')
  let intervalId = null
  let currentIndex = 0

  const startRandom = () => {
    if (isSpinning.value) return
    isSpinning.value = true
    intervalId = setInterval(() => {
      currentIndex = Math.floor(Math.random() * options.value.length)
      displayText.value = options.value[currentIndex]
    }, 50)
  }

  const stopRandom = () => {
    clearInterval(intervalId)
    isSpinning.value = false
    onResult(options.value[currentIndex])
  }

  const toggleSpin = () => {
    isSpinning.value ? stopRandom() : startRandom()
  }

  return {
    displayText,
    isSpinning,
    toggleSpin
  }
} 