import { Button, Result } from 'antd';
import { history,FormattedMessage } from '@umijs/max';

export default () => (
  <Result
    status="404"
    title="404"
    subTitle={<FormattedMessage id='pages.404.subTitle' />}
    extra={
      <Button type="primary" onClick={() => history.push('/')}>
        <FormattedMessage id='pages.404.buttonText' />
      </Button>
    }
  />
);


