// import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-layout';
// import { Helmet, HelmetProvider } from 'react-helmet-async';
// import { Link, useIntl, connect } from 'umi';
import React from 'react';
// import SelectLang from '@/components/SelectLang';
// import logo from '../assets/logo.svg';
// import styles from './AuthLayout.less';

const AuthLayout = props => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  // const { formatMessage } = useIntl();
  // const { breadcrumb } = getMenuData(routes);
  // const title = getPageTitle({
  //   pathname: location.pathname,
  //   formatMessage,
  //   breadcrumb,
  //   ...props,
  // });
  return (
    <div>
      <div>AuthLayout</div>
      <div>{children}</div>
    
{/*
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>

      <div className={styles.container}>
        <div className={styles.lang}>
          <SelectLang />
        </div>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                {/* <span className={styles.title}>Ant Design</span> * /}
                <span className={styles.title}>怡得社区</span>
              </Link>
            </div>
            <div className={styles.desc}>打造共享社区 SaaS 品牌</div>
          </div>
          {children}
        </div>
        {/* <DefaultFooter /> * /}
        <DefaultFooter
          copyright="2020 易得软件"
          links={[
            {
              key: '易得软件',
              title: '易得软件',
              href: 'https://www.edexcs.cn',
              blankTarget: true,
            },
            {
              key: '怡得社区',
              title: '怡得社区',
              href: 'https://sns.edexcs.cn',
              blankTarget: true,
            },
          ]}
        />
      </div>
    </HelmetProvider>
  */}
  </div>

  );
};

// export default connect(({ settings }) => ({ ...settings }))(AuthLayout);
export default AuthLayout;
