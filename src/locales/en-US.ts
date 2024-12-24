import pages from './en-US/pages';
import settings from './en-US/settings';
import menu from './en-US/menu';
import validator from './en-US/validator';
import components from './en-US/components';
import globalHeader from './en-US/globalHeader'
import global from './en-US/global'
import message from './en-US/message'
import modal from './en-US/modal'

export default {
  'navBar.lang': 'Languages',
  'app.copyright.produced': 'Produced by Ant Financial Experience Department',
  ...pages,
  ...menu,
  ...validator,
  ...components,
  ...globalHeader,
  ...global,
  ...message,
  ...settings,
  ...modal,
};
