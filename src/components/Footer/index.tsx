import { FC } from 'react';
import { DefaultFooter } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';

const Footer: FC = () => {
  const { formatMessage } = useIntl();

  const defaultMessage = formatMessage({
    id: 'app.copyright.produced',
    defaultMessage: '蚂蚁集团体验技术部出品',
  });

  const currentYear = new Date().getFullYear();

  return <DefaultFooter copyright={`${currentYear} ${defaultMessage}`} style={{ background: 'transparent' }} />;
};

export default Footer;
