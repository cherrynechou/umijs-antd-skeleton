import { Button, Result } from 'antd';
import { history, useIntl } from '@umijs/max';

export default () => (
  <Result
    status="404"
    title="404"
    subTitle={useIntl().formatMessage({ id: 'pages.404.subTitle' })}
    extra={
      <Button type="primary" onClick={() => history.push('/')}>
        {useIntl().formatMessage({ id: 'pages.404.buttonText' })}
      </Button>
    }
  />
);


