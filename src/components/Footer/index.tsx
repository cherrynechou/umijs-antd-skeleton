import { FC } from 'react';

import { DefaultFooter } from '@ant-design/pro-components';

const Footer: FC = ()=> {

  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      copyright={`${currentYear}`}
    />
  )
}

export default Footer;