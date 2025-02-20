const { defineConfig } = require('vite')
const path = require('path')
const copy = require('rollup-plugin-copy')

module.exports = defineConfig({
  plugins: [
    require('@dcloudio/vite-plugin-uni').default(),
    copy({
      targets: [
        {
          src: 'src/manifest.json',
          dest: 'unpackage/dist/dev/mp-weixin',
          rename: 'manifest.json'
        }
      ],
      hook: 'writeBundle'
    })
  ],
  build: {
    outDir: 'unpackage/dist/dev/mp-weixin',
    rollupOptions: {
      external: ['@dcloudio/*'],
      plugins: [
        copy({
          targets: [
            {
              src: 'src/static/libs/*',
              dest: 'unpackage/dist/dev/mp-weixin/static/libs',
              rename: (name) => name
            }
          ],
          verbose: true
        })
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  }
}) 