import { defineConfig } from '@umijs/max';

export default defineConfig({

  //  定义环境变量
  define: {
    'process.env.BaseUrl': '/api/admin',
  },
});
