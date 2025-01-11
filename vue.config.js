module.exports = {
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://127.0.0.1:8788', // Wrangler 默认端口是 8788
        changeOrigin: true,
        logLevel: 'debug', // 添加调试日志
        pathRewrite: {
          '^/api': '' // 移除 /api 前缀
        }
      }
    }
  }
} 