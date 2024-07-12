import { defineConfig } from 'vite'
import vitePluginImp from 'vite-plugin-imp'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({command}) => ({
  plugins: [
    // react 插件，使用改插件以后不用每个tsx文件都引入react了，且具备了热更新
    react(),
    // 按需引入antd的样式和组件，优化打包结果
    vitePluginImp({
      libList: [
        {
          libName: 'antd',
          style: (name) => `antd/es/${name}/style`,
        },
      ]
    })
  ],
  resolve: {
    // 设置@别名
    alias: {
      '@': '/src',
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']// 导入时想要省略的文件后缀
  },
  css: {
    preprocessorOptions: {
      scss: {// 设置项目引入的自定义变量
        additionalData: (_:string, path: string) => {
          const flag = new RegExp('^.*src/styles/variables.scss$').test(path);
          if(!flag) {
            return `@use '@/styles/variables.scss' as *;${_}`
          }
          return _;
        }
      },
    }
  },
  esbuild: {
    /**
     * 打包时去掉console和debugger
     * 特别说明，这个配置很重要。我们很多人代码规范做的不够，代码review没有，导致会把console和debugger写入到代码中，打包部署到生产环境
     * 这样做有以下几点风险：
     * 1.degubger会在打开调试面板时导致代码存在断点，影响使用，同时会有代码泄露的风险（我们自己加入断点，会大大降低解读混淆代码的难度）
     * 2.console会存在泄露敏感数据的风险
     * 3.会导致内存泄露
     */
    drop: command === 'build' ? ['console', 'debugger'] : []
  },
  server: {
    port: 3033
  }
}))
