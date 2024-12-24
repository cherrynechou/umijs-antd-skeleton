import { FC, useState } from 'react';
import { FormattedMessage, history, useIntl, useModel } from '@umijs/max';
import { changePassword } from '@/services/admin/auth/UserController';
import { LogoutOutlined, LockOutlined } from '@ant-design/icons';
import { App, Form, Input, MenuProps, Modal, Spin } from 'antd';
import { createStyles } from 'antd-style';
import { AxiosResponse, HttpStatusCode } from 'axios';
import localforage from 'localforage';
import { stringify } from 'querystring';
import { flushSync } from 'react-dom';
import HeaderDropdown from './HeaderDropdown';

export type GlobalHeaderRightProps = {
  menu?: boolean;
  children?: React.ReactNode;
};

export const AvatarName = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  const administratorText = useIntl().formatMessage({id: 'global.administratorText'});

  return <span style={{ color: '#FFF', fontSize: 14 }}>{currentUser?.name || administratorText}</span>;
};

/**
 * 清除accesstoken
 */
const removeAccessToken = async () => {
  await localforage.removeItem('access_token');
};

const useStyles = createStyles(({ token }) => {
  return {
    action: {
      display: 'flex',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      alignItems: 'center',
      padding: '0 8px',
      cursor: 'pointer',
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
  };
});

export const AvatarDropdown: FC<GlobalHeaderRightProps> = ({ menu, children }) => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { message, modal } = App.useApp();

  const intl = useIntl();

  const [form] = Form.useForm();

  const title = intl.formatMessage({ id: 'component.userSetting.title' });

  /**
   * 退出登录，并且将当前的 url 保存
   */
  const loginOut = async () => {
    const { query = {}, search, pathname } = history;
    const { redirect } = query;

    // Note: There may be security issues, please note
    if (window.location.pathname !== '/admin/login' && !redirect) {
      await removeAccessToken();
      const { search, pathname } = window.location;
      const urlParams = new URL(window.location.href).searchParams;
      /** 此方法会跳转到 redirect 参数所在的位置 */
      const redirect = urlParams.get('redirect');
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/admin/login' && !redirect) {
        history.replace({
          pathname: '/admin/login',
          search: stringify({
            redirect: pathname + search,
          }),
        });
      }
    }
  };

  /**
   * 退出登录
   */
  const jumpToLoginPages = async () => {
    await removeAccessToken();

    const defaultLogoutMessage = intl.formatMessage({
      id: 'message.logout.success',
      defaultMessage: '退出成功！',
    });

    message.success(defaultLogoutMessage);
    history.replace({
      pathname: '/admin/login',
    });
  };

  const DropdownItems: MenuProps['items'] = [
    ...(menu
      ? [
          {
            key: 'settings',
            icon: <LockOutlined />,
            label: intl.formatMessage({id: 'component.userSetting.password'}),
          },
          {
            type: 'divider' as const,
          },
        ]
      : []),
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: intl.formatMessage({id: 'component.userSetting.logout'}),
    },
  ];

  const DropdownOnClick: MenuProps['onClick'] = async ({ key }) => {
    if (key === 'logout') {
      flushSync(() => {
        setInitialState((s) => ({ ...s, currentUser: undefined }));
      });
      await loginOut();
      return;
    }
    if (key === 'settings') {
      setIsModalVisible(true);
      return;
    }
  };

  const handleOk = async () => {
    const fieldsValue = await form.validateFields();

    const { oldPassword, newPassword, confirmPassword } = fieldsValue;
    if (newPassword !== confirmPassword) {

      const defaultPasswordNotMatchMessage = intl.formatMessage({
        id: 'message.newAndOld.password.not.match',
        defaultMessage: '新密码和确认密码不一致！',
      });

      return message.error(defaultPasswordNotMatchMessage);
    }

    const defaultLoadingMessage = intl.formatMessage({
      id: 'message.loading.text',
      defaultMessage: '处理中...',
    });

    message.loading(defaultLoadingMessage);
    const { currentUser } = initialState;
    const res: AxiosResponse = await changePassword(currentUser.userid, {
      oldPassword,
      newPassword,
    });

    if (res.status === HttpStatusCode.Ok) {
      setIsModalVisible(false);
      modal.info({
        title: intl.formatMessage({id:'modal.component.userSetting.tips'}),
        content: intl.formatMessage({id:'modal.component.userSetting.passwordChange.content'}),
        okText: intl.formatMessage({id:'modal.component.userSetting.passwordChange.successText'}),
        mask: true,
        maskClosable: false,
        onOk: () => {
          jumpToLoginPages();
        },
      });
    }
  };

  const { styles } = useStyles();

  // -- layouts
  const loading = (
    <span className={styles.action}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.name) {
    return loading;
  }

  return (
    <>
      <HeaderDropdown
        menu={{
          selectedKeys: [],
          onClick: DropdownOnClick,
          items: DropdownItems,
        }}
      >
        {children}
      </HeaderDropdown>
      <Modal
        title={title}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        destroyOnClose
        width={600}
      >
        <Form name="password-modify" form={form} autoComplete="off">
          <Form.Item
            name="oldPassword"
            label={
              intl.formatMessage({id: 'component.userSetting.oldPassword.label'})
            }
            labelCol={{ span: 5 }}
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id='validator.userSetting.oldPassword.required'
                    defaultMessage='原始不能为空！'
                  />
                ),
              },
            ]}
          >
            <Input.Password placeholder={
              intl.formatMessage({id: 'component.userSetting.oldPassword.placeholder'})
            } />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label={
              intl.formatMessage({id: 'component.userSetting.newPassword.label'})
            }
            labelCol={{ span: 5 }}
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id='validator.userSetting.newPassword.required'
                    defaultMessage='新密码是必须的！'
                  />
                ),
              },
            ]}
          >
            <Input.Password placeholder={
              intl.formatMessage({id: 'component.userSetting.newPassword.placeholder'})
            } />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label={
              intl.formatMessage({id: 'component.userSetting.confirmPassword.label'})
            }
            labelCol={{ span: 5 }}
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id='validator.userSetting.confirmPassword.required'
                    defaultMessage='确认密码是必须的！！'
                  />
                ),
              },
            ]}
          >
            <Input.Password placeholder={
              intl.formatMessage({id: 'component.userSetting.confirmPassword.placeholder'})
            } />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
