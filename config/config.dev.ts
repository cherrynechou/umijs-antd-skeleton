import { defineConfig } from '@umijs/max';

export default defineConfig({
  // 1. 部署至二级目录 → { base: '/二级目录名/', publicPath: '/二级目录名/'  }

  // 3. 定义环境变量
  define: {
    'process.env.BaseUrl': '/api/admin',
  },
});
