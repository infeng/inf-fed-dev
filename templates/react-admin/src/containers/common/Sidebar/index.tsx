import * as React from 'react';
import { Menu, Icon } from 'antd';
import { connect } from 'react-redux';
import { AppState } from '../../../models/common/app';
import { SIDEBAR_WIDTH, BASE_PREFIX } from '../../../util/constants';
import { SidebarState, actions } from '../../../models/common/sidebar';
import classnames from 'classnames';
import './style.less';
import { browserHistory } from 'react-router';

const SubMenu = Menu.SubMenu;

export interface SiderProps {
  dispatch: any;
  app: AppState;
  sidebar: SidebarState;
}

const prefixCls = `${BASE_PREFIX}-sidebar`;

class Sider extends React.Component<SiderProps, any> {
  handleSubMenuChange = (openKeys) => {
    const { dispatch } = this.props;
    let newActiveSubMenu = openKeys.length > 0 ? openKeys[openKeys.length - 1] : '';
    dispatch(actions.changeSubMenu({
      activeSubMenu: newActiveSubMenu,
    }));
  }

  handleChangePath = e => {
    browserHistory.push({
      pathname: e.key,
    });
  }

  renderMenus = () => {
    const { sidebar } = this.props;
    return sidebar.menus.map(menu => {
      // 当子节点leaf为false的时候，menu.items才有值
      let items = !menu.leaf ? menu.items : [];
      const menuItems = items.map(item => {
        return (
          <Menu.Item
            key={`/${menu.name}/${item.name}`}
          >
            {item.text}
          </Menu.Item>
        );
      });
      return (
        <SubMenu
          key={menu.name}
          title={<span><Icon type={menu.icon}/><span>{menu.text}</span></span>}
        >
          {menuItems}
        </SubMenu>
      );
    });
  }

  render() {
    const { sidebar } = this.props;

    let style: React.CSSProperties = {
      height: '100%',
      width: `${SIDEBAR_WIDTH}px`,
      float: 'left',
    };

    let className = classnames(prefixCls);

    return (
      <Menu
        theme="dark"
        mode="inline"
        className={className}
        style={style}
        onOpenChange={this.handleSubMenuChange}
        openKeys={[sidebar.activeSubMenu]}
        onClick={this.handleChangePath}
        selectedKeys={[sidebar.activePath]}
      >
        {this.renderMenus()}
      </Menu>
    );
  }
}

const mapState2Props = state => {
  const { app, sidebar, theme } = state;
  return {
    app,
    sidebar,
    theme,
  };
};

export default connect(mapState2Props)(Sider);
