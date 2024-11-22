import { defineConfig } from '@umijs/max';

import routes from './routes';
import proxy  from './proxy';

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '@umijs/max',
  },
  routes,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  npmClient: 'pnpm',
});

