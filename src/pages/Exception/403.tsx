import { Button, Result } from 'antd';
import { history } from '@umijs/max';

export default () => (
  <Result
    status="403"
    title="403"
    subTitle="无权限"
    extra={
      <Button type="primary" onClick={() => history.push('/')}>
        返回首页
      </Button>
    }
  />
);

