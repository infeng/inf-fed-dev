import * as React from 'react';
import { Menu, Icon } from 'antd';
import { BASE_PREFIX } from '../../../util/constants';
import './style.less';
import classnames from 'classnames';
import { apiActions as loginApiActions, LoginState } from '../../../models/common/login';
import { injectNormal, NormalComponentProps } from '../../../util/inject';

export interface HeaderProps extends NormalComponentProps {
  login: LoginState;
  token: any;
}

const prefixCls = `${BASE_PREFIX}-header`;

class Header extends React.Component<HeaderProps, any> {
  handleChangeTheme = (e) => {
    const { dispatch, token } = this.props;

    let key = e.key;

    if (key === 'logout') {
      dispatch(loginApiActions.logout(token));
    }

    if (key === 'home') {

    }
  }

  render() {
    const { login } = this.props;
    let cls = classnames(prefixCls);

    return (
      <Menu
        theme="dark"
        mode="horizontal"
        className={cls}
        onSelect={this.handleChangeTheme}
      >
        <Menu.Item key="home">
          <Icon type="home" />管理后台
        </Menu.Item>
        <Menu.Item key="logout" className={`${prefixCls}-item-right`}>
          <Icon type={login.logoutLoading ? 'loading' : 'logout'} />退出
        </Menu.Item>
        <Menu.Item key="user" className={`${prefixCls}-item-right`}>
          <Icon type="user" />你好，{login.name}
        </Menu.Item>
      </Menu>
    );
  }
}

export default injectNormal(Header, {
  login: 'login',
  theme: 'theme',
  token: 'token',
});
