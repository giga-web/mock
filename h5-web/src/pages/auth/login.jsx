import { AlipayCircleOutlined, TaobaoCircleOutlined, WeiboCircleOutlined } from '@ant-design/icons';
import { LockTwoTone, MailTwoTone, MobileTwoTone, UserOutlined } from '@ant-design/icons';
import { Alert, Checkbox } from 'antd';
import { Tabs } from 'antd';
import { Button, Col, Input, Row, Form, message } from 'antd';
const FormItem = Form.Item;
// Pane和Panel的含义是不一样的：
// Pane，窗格
// Panel，面板
// Pane指窗口中可以独立滚动的子部分，如果你在Word中使用屏幕分割的功能，那么分割出的两个独立部分就是Pane。
// 而Panel是用来分组控件和其它对象的，典型的例子是工具条中用来分组按钮的区域
const { TabPane } = Tabs;
import React, { useState, useCallback, useEffect } from 'react';
import { Link, connect } from 'umi';
// import LoginFrom from './components/Login';
import useMergeValue from 'use-merge-value';
import classNames from 'classnames';
import styles from './login.less';

// Context
import { createContext } from 'react';
const LoginContext = createContext({});

import { getFakeCaptcha } from '@/services/login';

const LoginMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login = props => {
  const { userLogin = {}, submitting } = props;
  const { status, type: loginType } = userLogin;
  const [autoLogin, setAutoLogin] = useState(true);
  // const [type, setType] = useState('account');

  const [count, setCount] = useState(props.countDown || 0);
  const [timing, setTiming] = useState(false); // 这么写是为了防止restProps中 带入 onChange, defaultValue, rules props tabUtil
  const onGetCaptcha = useCallback(async mobile => {
    const result = await getFakeCaptcha(mobile);

    if (result === false) {
      return;
    }

    message.success('获取验证码成功！验证码为：1234');
    setTiming(true);
  }, []);
  useEffect(() => {
    let interval = 0;
    const { countDown } = props;

    if (timing) {
      interval = window.setInterval(() => {
        setCount(preSecond => {
          if (preSecond <= 1) {
            setTiming(false);
            clearInterval(interval); // 重置秒数

            return countDown || 60;
          }

          return preSecond - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timing]);

  const handleSubmit = values => {
    const { dispatch } = props;
    dispatch({
      // type: 'login/login',
      type: 'auth/login',
      payload: { ...values, type },
    });
  };

  const { className } = props;
  // const [tabs, setTabs] = useState([]);
  const [active, setActive] = useState({});
  const [type, setType] = useMergeValue('account', { // account, mobile
    value: props.activeKey,
    onChange: props.onTabChange,
  });

  return (
    <div className={styles.main}>
      <div className={classNames(className, styles.login)}>
        
        <Tabs
            animated={false}
            className={styles.tabs}
            activeKey={type}
            onChange={activeKey => {
              setType(activeKey);
            }}
          >

          <TabPane key="account" tab="账户密码登录">

            <Form
              onFinish={values => {
                handleSubmit(values);
              }}
            >

            {status === 'error' && loginType === 'account' && !submitting && (
              <LoginMessage content="账户或密码错误（admin/ant.design）" />
            )}

            <FormItem name="userName" rules={
              [
                {
                  required: true,
                  message: '请输入用户名!',
                },
              ]
            }>
              <Input id="userName" size="large" placeholder="用户名: admin or user" prefix={<UserOutlined style={{color: '#1890ff',}} className={styles.prefixIcon} />}  />
            </FormItem>
            <FormItem name="password" rules={
              [
                {
                  required: true,
                  message: '请输入密码！',
                },
              ]
            }>
              <Input id="password" type="password" size="large" placeholder="密码: ant.design" prefix={<LockTwoTone className={styles.prefixIcon} />}  />
            </FormItem>
            <div>
              <Checkbox checked={autoLogin} onChange={e => setAutoLogin(e.target.checked)}>
                自动登录
              </Checkbox>
            </div>
            <FormItem>
              <Button type="primary" htmlType="submit" size="large" className={styles.submit} loading={submitting}>登录</Button>
            </FormItem>
          
            </Form>

          </TabPane>
          <TabPane key="mobile" tab="手机号登录">

            <Form
              onFinish={values => {
                handleSubmit(values);
              }}
            >

            {status === 'error' && loginType === 'mobile' && !submitting && (
              <LoginMessage content="验证码错误" />
            )}
            
            <FormItem name="mobile" rules={
              [
                {
                  required: true,
                  message: '请输入手机号！',
                },
                {
                  pattern: /^1\d{10}$/,
                  message: '手机号格式错误！',
                },
              ]
            }>
              <Input id="mobile" size="large" placeholder="手机号" prefix={<MobileTwoTone className={styles.prefixIcon} />}  />
            </FormItem>
            <FormItem shouldUpdate noStyle>
              {({ getFieldValue }) => (
                <Row gutter={8}>
                  <Col span={16}>
                    
                    <FormItem name="captcha" rules={
                      [
                        {
                          required: true,
                          message: '请输入验证码！',
                        },
                      ]
                    }>
                      <Input id="captcha" size="large" placeholder="验证码" prefix={<MailTwoTone className={styles.prefixIcon} />}  />
                    </FormItem>
                    
                  </Col>
                  <Col span={8}>
                    <Button
                      disabled={timing}
                      className={styles.login.getCaptcha}
                      size="large"
                      onClick={() => {
                        const value = getFieldValue('mobile');
                        onGetCaptcha(value);
                      }}
                    >
                      {timing ? `${count} 秒` : '获取验证码'}
                    </Button>
                  </Col>
                </Row>
              )}
            </FormItem>
            <div>
              <Checkbox checked={autoLogin} onChange={e => setAutoLogin(e.target.checked)}>
                自动登录
              </Checkbox>
            </div>
            <FormItem>
              <Button type="primary" htmlType="submit" size="large" className={styles.submit} loading={submitting}>登录</Button>
            </FormItem>

            </Form>

          </TabPane>
          
        </Tabs>
        <div className={styles.other}>
          其他登录方式
          <AlipayCircleOutlined className={styles.icon} />
          <TaobaoCircleOutlined className={styles.icon} />
          <WeiboCircleOutlined className={styles.icon} />
          {/* <a
            style={{
              float: 'right',
            }}
          >
            忘记密码
          </a> */}
          <Link className={styles.register} to="/auth/resetpassword">
            忘记密码
          </Link>
          <span className={styles.register}>&nbsp;&nbsp;</span>
          <Link className={styles.register} to="/auth/register">
            注册账户
          </Link>
        </div>
        
      </div>
    </div>
  );
};

export default connect(({ login, loading }) => ({
  userLogin: login,
  // submitting: loading.effects['login/login'],
  submitting: loading.effects['auth/login'],
}))(Login);