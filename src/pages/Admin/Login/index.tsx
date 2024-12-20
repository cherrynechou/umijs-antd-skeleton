import { FC } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { FormattedMessage, history, useModel, useIntl } from '@umijs/max';
import type { FormProps } from 'antd';
import { Button, Form, Image, Input, App, Row } from 'antd';
import { flushSync } from 'react-dom';

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
  const intl = useIntl();

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
      flushSync(() => {
        setInitialState((s: any) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
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

        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: '登录成功！',
        });

        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
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
            <Form.Item name="username" rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id='pages.login.username.required'
                    defaultMessage='请输入用户名'
                  />
                )
              }
            ]}>
              <Input
                size="large"
                prefix={<UserOutlined />}
                placeholder={intl.formatMessage({
                  id: 'pages.login.username.placeholder',
                  defaultMessage: '请输入用户名！',
                })}
              />
            </Form.Item>

            <Form.Item name="password" rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id='pages.login.password.required'
                    defaultMessage='请输入密码'
                  />
                )
              }
            ]}>
              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                placeholder={intl.formatMessage({
                  id: 'pages.login.password.placeholder',
                  defaultMessage: '请输入密码！',
                })} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                <FormattedMessage id='pages.login.submit'/>
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Row>
    </div>
  );
};

export default Login;
