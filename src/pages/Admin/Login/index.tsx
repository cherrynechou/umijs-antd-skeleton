import { FC } from 'react';
import { Row, Form, Input, Button, message } from 'antd';
import type { FormProps } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';

import { createStyles } from 'antd-style';
import backgroundImage from '@/assets/images/background.png'
import localforage from 'localforage';

import  { HttpStatusCode } from 'axios';

import { login } from '@/services/admin/system/CommonController';
import { queryCurrentUser } from '@/services/admin/auth/UserController';


export type LoginFieldProps = {
  username?: string;
  password?: string;
};

export type AccessTokenEntity = {
  access_token: string;
  token_type: string;
}

const useStyles = createStyles(({ token }) => {
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
  const { styles } = useStyles();

  /**
   * 设置凭证
   * @param data
   */
  const setAccessToken = async (data: AccessTokenEntity) =>{
    await localforage.setItem('access_token', data.access_token);
    await localforage.setItem('token_type', data.token_type);
  }

  const fetchUserInfo = async () =>{
    const userInfo = await queryCurrentUser();
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
    const res = await login(values);
    if(res.status === HttpStatusCode.Ok){
      const loginRes = res.data;
      await setAccessToken(loginRes);
      await fetchUserInfo();
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
                prefix={<UserOutlined/>}
                placeholder="请输入用户名"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '密码是必填项！' }]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined/>}
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