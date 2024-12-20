import pages from './zh-CN/pages';
import settings from './zh-CN/settings';
import menu from './zh-CN/menu';
import validator from './zh-CN/validator'
import globalHeader from './zh-CN/globalHeader'

export default {
  'navBar.lang': '语言',
  'app.copyright.produced': '蚂蚁集团体验技术部出品',
  ...pages,
  ...menu,
  ...validator,
  ...globalHeader,
  ...settings,
};
