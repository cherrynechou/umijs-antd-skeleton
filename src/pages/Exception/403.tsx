import { history,FormattedMessage } from '@umijs/max';
import { Button, Result } from 'antd';

export default () => (
  <Result
    status="403"
    title="403"
    subTitle={<FormattedMessage id='pages.403.subTitle'/>}
    extra={
      <Button type="primary" onClick={() => history.push('/')}>
        {<FormattedMessage id='pages.403.buttonText'/>}
      </Button>
    }
  />
);
