import { FC } from 'react';
import { Row, Form, Input, Button, Image, message } from 'antd';
import type { FormProps } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';

import { createStyles } from 'antd-style';

import localforage from 'localforage';

import  { HttpStatusCode } from 'axios';

import { login } from '@/services/admin/system/CommonController';
import { history } from '@@/core/history';

import logoSvg from '@/assets/images/logo.svg'
import backgroundImage from '@/assets/images/background.png'


export type LoginFieldProps = {
  username?: string;
  password?: string;
};

export type AccessTokenEntity = {
  access_token: string;
  token_type: string;
}

const useStyles = createStyles(({ token,css }) => {
  return {
    container: {
      display: 'flex',
      width: '100%',
      height: '100%',
      backgroundSize: 'contain'
    },
    boxContainer: {
      width: '400px',
      padding: '33px',
      marginTop: '170px',
      backgroundColor: '#fff'
    }
  };
});

const Login: FC = () =>{
  const { initialState, setInitialState } = useModel('@@initialState');
  const { styles }  = useStyles();




  /**
   * 设置凭证
   * @param data
   */
  const setAccessToken = async (data: AccessTokenEntity) =>{
    await localforage.setItem('access_token', data.access_token);
    await localforage.setItem('token_type', data.token_type);
  }

  const fetchUserInfo = async () =>{
    const userInfo = await initialState?.fetchUserInfo?.();
    if(userInfo){
      await setInitialState((s: any)=>({
        ...s,
        currentUser: userInfo
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
      if(res.status === HttpStatusCode.Ok){
        const loginRes = res.data;
        await setAccessToken(loginRes);
        await fetchUserInfo();
        if (!history) return;
        const { location } = history;
        const { query } = location;
        const { redirect } = query as { redirect: string };
        history.push(redirect || '/');
        return;
      }
    }catch (error){

    }

  }

  return (
    <div
      className={styles.container}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <Row
        align="top"
        justify="center"
        className="px-3"
        style={{ minHeight: '100vh', background: '#fff' }}
      >
        <div className={styles.boxContainer}>

          <div className="login-page-header flex align-center">
            <Image className="login-logo" src={logoSvg} alt="logo" />
            <span className="login-page-desc"></span>
          </div>

          <Form
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '用户名是必填项！' }]}
            >
              <Input
                size="large"
                prefix={<UserOutlined />}
                placeholder="请输入用户名"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '密码是必填项！' }]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                placeholder="请输入密码"
              />
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
  )
}

export default Login;