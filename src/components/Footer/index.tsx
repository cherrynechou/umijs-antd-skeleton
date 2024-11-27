import { DefaultFooter } from '@ant-design/pro-components';
import { getIntl, getLocale } from '@umijs/max';
import { FC } from 'react';

const Footer: FC = () => {
  const { formatMessage } = getIntl(getLocale());

  const defaultMessage = formatMessage({
    id: 'app.copyright.produced',
    defaultMessage: '蚂蚁集团体验技术部出品',
  });

  const currentYear = new Date().getFullYear();

  return <DefaultFooter copyright={`${currentYear} ${defaultMessage}`} style={{ background: 'transparent' }} />;
};

export default Footer;
