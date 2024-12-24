import pages from './zh-CN/pages';
import settings from './zh-CN/settings';
import menu from './zh-CN/menu';
import validator from './zh-CN/validator'
import components from './zh-CN/components';
import globalHeader from './zh-CN/globalHeader'
import global from './zh-CN/global'
import message from './zh-CN/message'
import modal from './zh-CN/modal'

export default {
  'navBar.lang': '语言',
  'app.copyright.produced': '蚂蚁集团体验技术部出品',
  ...pages,
  ...menu,
  ...validator,
  ...components,
  ...globalHeader,
  ...global,
  ...message,
  ...settings,
  ...modal
};
