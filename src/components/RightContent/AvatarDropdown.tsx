import { LOGIN_PATH } from '@/constants/pages';
import { changePassword } from '@/services/admin/auth/UserController';
import { LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useIntl, history, useModel } from '@umijs/max';
import { App, Form, Input, MenuProps, Modal, Spin } from 'antd';
import { createStyles } from 'antd-style';
import { AxiosResponse, HttpStatusCode } from 'axios';
import localforage from 'localforage';
import { stringify } from 'querystring';
import { FC, useState } from 'react';
import HeaderDropdown from './HeaderDropdown';

export type GlobalHeaderRightProps = {
  menu?: boolean;
  children?: React.ReactNode;
};

export const AvatarName = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  return <span style={{ color: '#FFF', fontSize: 14 }}>{currentUser?.name || '管理员'}</span>;
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
  const { initialState } = useModel('@@initialState');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { message, modal } = App.useApp();

  const { formatMessage } = useIntl();

  const [form] = Form.useForm();

  const title = formatMessage({ id: 'app.settings.modal.modifyPwd' });

  /**
   * 退出登录，并且将当前的 url 保存
   */
  const loginOut = async () => {
    const { query = {}, search, pathname } = history;
    const { redirect } = query;

    // Note: There may be security issues, please note
    if (window.location.pathname !== LOGIN_PATH && !redirect) {
      await removeAccessToken();
      history.replace({
        pathname: LOGIN_PATH,
        search: stringify({
          redirect: pathname + search,
        }),
      });
    }
  };

  /**
   * 退出登录
   */
  const jumpToLoginPages = async () => {
    await removeAccessToken();
    message.success('退出成功');
    history.replace({
      pathname: LOGIN_PATH,
    });
  };

  const DropdownItems: MenuProps['items'] = [
    ...(menu
      ? [
          {
            key: 'settings',
            icon: <SettingOutlined />,
            label: '个人设置',
          },
          {
            type: 'divider' as const,
          },
        ]
      : []),
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  const DropdownOnClick: MenuProps['onClick'] = async ({ key }) => {
    if (key === 'logout') {
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
      return message.error('新密码和确认密码不一致');
    }
    message.loading('处理中...');
    const { currentUser } = initialState;
    const res: AxiosResponse = await changePassword(currentUser.id, {
      oldPassword,
      newPassword,
    });

    if (res.status === HttpStatusCode.Ok) {
      setIsModalVisible(false);
      modal.info({
        title: '温馨提示',
        content: '密码已修改，需重新登录',
        okText: '立即登录',
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
            label="原始密码"
            labelCol={{ span: 4 }}
            rules={[
              {
                required: true,
                message: '原始不能为空！',
              },
            ]}
          >
            <Input.Password placeholder="输入 原始密码" />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="新密码"
            labelCol={{ span: 4 }}
            rules={[
              {
                required: true,
                message: '新密码不能为空！',
              },
            ]}
          >
            <Input.Password placeholder="输入 新密码" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="确认密码"
            labelCol={{ span: 4 }}
            rules={[
              {
                required: true,
                message: '确认密码不能为空！',
              },
            ]}
          >
            <Input.Password placeholder="输入 确认密码" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
