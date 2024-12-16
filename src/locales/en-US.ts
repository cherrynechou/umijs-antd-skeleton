import pages from './en-US/pages';
import settings from './en-US/settings';
import menu from './en-US/menu';
import globalHeader from './en-US/globalHeader'

export default {
  'navBar.lang': 'Languages',
  'app.copyright.produced': 'Produced by Ant Financial Experience Department',
  ...pages,
  ...menu,
  ...globalHeader,
  ...settings,
};
