import React from 'react';
import { FC } from 'react';
import { createFromIconfontCN } from '@ant-design/icons';

import * as  iconFrontJs from '@/assets/iconfont/iconfont.js'

/**
 * 菜单图标,需要上传到https://www.iconfont.cn/
 */
const Icon = createFromIconfontCN({
  scriptUrl: iconFrontJs,
});

interface IProps {
  /**
   * @description 图标样式
   * */
  className?: React.CSSProperties;
  /**
   * @description IconFont中上传的图标名称
   * */
  type?: string;
  /**
   * @description 图标样式
   * */
  style?: object;
  /**
   * @description 图标大小
   * */
  size?: string;
  /**
   * @description 点击回调
   * */
  onClick?: () => void;
}

const IconFont: FC<IProps> = (props: any) => {

  const { type, className, style, size = 'inherit', onClick } = props;

  return (
    <Icon
      type={type}
      className={className}
      style={{ ...style, fontSize: size }}
      onClick={onClick}
    />
  );
}


export default IconFont;