import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { FormattedMessage, history, useModel } from '@umijs/max';
import type { FormProps } from 'antd';
import { Button, Form, Image, Input, App, Row } from 'antd';
import { FC } from 'react';

import { createStyles } from 'antd-style';

import { HttpStatusCode } from 'axios';
import localforage from 'localforage';

import { login } from '@/services/admin/system/CommonController';

import backgroundImage from '@/assets/images/background.png';
import logoSvg from '@/assets/images/logo.svg';

export type LoginFieldProps = {
  username?: string;
  password?: string;
};

export type AccessTokenEntity = {
  access_token: string;
  token_type: string;
};

const useStyles = createStyles(({ token, css }) => {
  return {
    container: {
      display: 'flex',
      width: '100%',
      height: '100%',
      backgroundSize: 'contain',
    },
    boxContainer: {
      width: '400px',
      padding: '33px',
      marginTop: '170px',
      backgroundColor: '#fff',
    },
    loginHeader: {
      marginBottom: '20px',
    },
    loginDesc: {
      fontSize: '20px',
      fontWeight: '600',
      paddingLeft: '20px',
    },
  };
});

const Login: FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();

  const { message } = App.useApp();

  /**
   * 设置凭证
   * @param data
   */
  const setAccessToken = async (data: AccessTokenEntity) => {
    await localforage.setItem('access_token', data.access_token);
  };

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s: any) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };

  /**
   * 用户登录
   * @param values
   */
  const onFinish: FormProps<LoginFieldProps>['onFinish'] = async (values) => {
    try {
      const res = await login(values);
      if (res.status === HttpStatusCode.Ok) {
        const loginRes = res.data;
        await setAccessToken(loginRes);
        message.success('登录成功');
        await fetchUserInfo();
        history.push('/');
        return;
      }
    } catch (error) {}
  };

  return (
    <div className={styles.container} style={{ backgroundImage: `url(${backgroundImage})` }}>
      <Row align="top" justify="center" className="px-3" style={{ minHeight: '100vh', background: '#fff' }}>
        <div className={styles.boxContainer}>
          <div className={`flex align-center ${styles.loginHeader}`}>
            <Image src={logoSvg} width={'15%'} height={'15%'} alt="logo" />
            <span className={styles.loginDesc}>
              <FormattedMessage id="pages.login.title" />
            </span>
          </div>

          <Form onFinish={onFinish} autoComplete="off">
            <Form.Item name="username" rules={[{ required: true, message: '用户名是必填项！' }]}>
              <Input size="large" prefix={<UserOutlined />} placeholder="请输入用户名" />
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true, message: '密码是必填项！' }]}>
              <Input.Password size="large" prefix={<LockOutlined />} placeholder="请输入密码" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Row>
    </div>
  );
};

export default Login;
