export class HapticManager {
  constructor() {
    this.enabled = uni.getSystemInfoSync().platform === 'android';
  }

  pulse(type) {
    if (!this.enabled) return;
    
    const patterns = {
      light: [50],
      medium: [100],
      heavy: [150],
      rhythm: [50, 100, 50]
    };
    
    uni.vibrate({
      pattern: patterns[type] || [50],
      fail: () => this.enabled = false
    });
  }
} 