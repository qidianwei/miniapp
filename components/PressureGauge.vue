<template>
  <view class="pressure-gauge">
    <view 
      class="glow-effect"
      :style="{
        boxShadow: `0 0 30px ${glowColor}`,
        opacity: pressureLevel
      }"
    />
    <view class="label">压力值: {{ value }}%</view>
  </view>
</template>

<script>
export default {
  props: ['value'],
  computed: {
    pressureLevel() {
      return this.value / 100
    },
    glowColor() {
      const hue = 360 * (this.value / 100)
      return `hsla(${hue}, 80%, 50%, 0.3)`
    }
  }
}
</script> 