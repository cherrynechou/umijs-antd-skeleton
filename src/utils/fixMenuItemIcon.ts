import React from 'react';
import type { MenuDataItem } from '@ant-design/pro-components';
import * as allIcons from '@ant-design/icons';

// FIX从接口获取菜单时icon为string类型
const fixMenuItemIcon = (menus: MenuDataItem[], iconType = 'Outlined'): MenuDataItem[] => {
  menus.forEach((item) => {
    const { icon, routes } = item;
    if (typeof icon === 'string' && icon) {
      const fixIconName = icon.slice(0, 1).toLocaleUpperCase() + icon.slice(1) + iconType;

      item.icon = React.createElement(allIcons[fixIconName] || allIcons[icon]);

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

    routes && routes.length > 0 ? (item.routes = fixMenuItemIcon(routes)) : null;
  });
  return menus;
};

export default fixMenuItemIcon;
