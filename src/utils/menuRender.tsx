import React from 'react';
import { FormattedMessage, useIntl,Link } from '@umijs/max';
import { Space } from 'antd';
import type { MenuDataItem } from '@ant-design/pro-components';
import * as allIcons from '@ant-design/icons';

export type menuProType = {
  isUrl: any;
  path: any;
  name: string;
  target: string;
  locale: string;
  pro_layout_parentKeys: string | any[];
  icon: any;
};

//处理图标
// FIX从接口获取菜单时icon为string类型
const menuDataRender = (menus: MenuDataItem[]): MenuDataItem[] => {
  menus.forEach((item) => {
    const { icon,  children, locale } = item;
    if (typeof icon === 'string' && icon) {
      const fixIconName: string = icon.slice(0, 1).toLocaleUpperCase() + icon.slice(1);
      item.icon = React.createElement(allIcons[fixIconName] || allIcons[icon]);
      item.name = locale ? useIntl().formatMessage({id: locale}) : item.name;
      if (!item.redirect) {
        delete item.redirect;
      }
      if (!item.component) {
        delete item.component;
      }
      if (item.id) {
        delete item.id;
      }
      if (item.pid >= 0) {
        delete item.pid;
      }
    }
    children && children.length > 0 ? (item.children = menuDataRender(children)) : null;
  });
  return menus;
};

//二级菜单icon 实现逻辑
const menuItemRender = (menuItemProps: menuProType)=>{
  if (menuItemProps.isUrl) {
    return (
      <a href={menuItemProps.path ? menuItemProps.path : ''}  target='_blank' rel="noreferrer">
        <Space>
          {menuItemProps.icon}
          {menuItemProps.locale ? <FormattedMessage id={menuItemProps.locale} /> : menuItemProps.name}
        </Space>
      </a>
    )
  }
  return (
    <Link to={menuItemProps.path ? menuItemProps.path : ''} target={menuItemProps.target}>
      <Space>
        {menuItemProps.icon}
        {menuItemProps.locale ? <FormattedMessage id={menuItemProps.locale} /> : menuItemProps.name}
      </Space>
    </Link>
  )
}

export {
  menuDataRender,
  menuItemRender
};
