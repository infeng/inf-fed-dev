import * as React from 'react';
import { AppState } from '../../../models/common/app';
import { SidebarState, actions, updatePane, BackComponentDecorator } from '../../../models/common/sidebar';
import { ComponentsState } from '../../../models/common/components';
import { SIDEBAR_WIDTH, MIN_MAIN_WIDTH, BASE_PREFIX } from '../../../util/constants';
import { browserHistory } from 'react-router';
import './style.less';
import { Tabs, Button } from 'antd';
const TabPane = Tabs.TabPane;
import Home from '../../../components/common/Home';
import { injectNormal, NormalComponentProps } from '../../../util/inject';

export interface MainProps extends NormalComponentProps {
  app: AppState;
  routing: any;
  sidebar: SidebarState;
  components: ComponentsState;
}

const prefixCls = `${BASE_PREFIX}-main`;

class Main extends React.Component<MainProps, any> {
  panes: any[];

  constructor(props) {
    super(props);

    this.panes = [];
  }

  componentDidMount() {
    const { sidebar } = this.props;
    if (sidebar.activePath !== '') {
      browserHistory.push({
        pathname: sidebar.activePath,
      });
    }else {
      this.renderPane(this.props.routing.locationBeforeTransitions.pathname);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.routing.locationBeforeTransitions) {
      this.renderPane(nextProps.routing.locationBeforeTransitions.pathname);
    }
  }

  renderPane = (pathname) => {
    if (pathname === '/') {
      return;
    }
    const { dispatch, sidebar } = this.props;
    const subMenuName = pathname.match(/[^\/]\w+/)[0];
    const itemName = pathname.match(/[^\/]\w+$/)[0];
    const { activePath, paneConfigs } = sidebar;
    let menus = sidebar.menus;
    if (!menus) {
      return;
    }
    let subMenu = menus.filter(menu => menu.name === subMenuName)[0];
    if (!subMenu) {
      return;
    }
    let item = subMenu.items.filter(t => t.name === itemName)[0];
    if (!item) {
      return;
    }
    let pane = paneConfigs.filter(t => t.key === pathname);
    if (pane.length > 0) {
      if (activePath !== pathname) {
        dispatch(actions.activePane({
          activePath: pathname,
          activeSubMenu: subMenuName,
        }));
      }
      return;
    }
    dispatch(actions.pushPane({
      activePath: pathname,
      title: item.text,
    }));
  }

  handleTabEdit = (targetKey, action) => {
    // remove tab pane
    this[action](targetKey);
  }

  remove = (targetKey) => {
    const { dispatch, sidebar } = this.props;
    let { activePath, paneConfigs } = sidebar;
    let lastIndex = -1;
    paneConfigs.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    if (lastIndex >= 0) {
      activePath = paneConfigs[lastIndex].key;
    } else {
      if (paneConfigs.length - 1 > 0) {
        lastIndex = lastIndex + 1;
        activePath = paneConfigs[lastIndex + 1].key;
      } else {
        activePath = '';
      }
    }
    let subMenuName = '';
    if (activePath !== '') {
      subMenuName = activePath.match(/[^\/]\w+/)[0];
    }
    browserHistory.push({
      pathname: activePath,
    });
    dispatch(actions.popPane({
      key: targetKey,
      activePath: activePath,
      activeSubMenu: subMenuName,
    }));
  }

  handleTabChane = activeKey => {
    const { dispatch } = this.props;
    const subMenu = activeKey.match(/[^\/]\w+/)[0];
    dispatch(actions.activePane({
      activePath: activeKey,
      activeSubMenu: subMenu,
    }));
    browserHistory.push({
      pathname: activeKey,
    });
  }

  handleRemoveOthers = () => {
    this.props.dispatch(actions.removeOtherPanes());
  }

  handleRefresh = (e) => {
    const { activePath, paneConfigs } = this.props.sidebar;
    let activeTabPaneIndex;
    let activePane;
    for (let i = 0; i < this.panes.length; i++) {
      if (this.panes[i].key === activePath) {
        activeTabPaneIndex = i;
        activePane = this.panes[i];
        break;
      }
    }
    let paneConfig = paneConfigs.filter(t => t.key === activePath)[0];
    let oldComponentName = paneConfig.componentName;
    this.props.dispatch(actions.refreshPane({
      loading: true,
      newComponentName: oldComponentName,
    }));
  }

  handleBack = (backComponent: BackComponentDecorator) => {
    const { dispatch } = this.props;
    updatePane(dispatch, {
      componentName: backComponent.componentName,
    }, backComponent.options);
  }

  renderTabPanes = () => {
    const { paneConfigs, activePath } = this.props.sidebar;
    let newPanes = [];
    let currentBackComponent = null;
    paneConfigs.forEach((paneConfig, index) => {
      let ComponentNode = getComponent(this.props.components.components , paneConfig.componentName, paneConfig.options);
      let pane = this.panes.filter(t => t.key === paneConfig.key);
      let isNew = false;
      if (pane.length === 0) {
        isNew = true;
      } else {
        if (pane[0].props.children) {
          if (pane[0].props.children.key !== paneConfig.componentName) {
            isNew = true;
          }
        } else {
          isNew = true;
        }
      }
      if (isNew) {
        newPanes.push(getTabPane(paneConfig.tab, paneConfig.key, ComponentNode));
      } else {
        newPanes.push(pane[0]);
      }
      if (activePath === paneConfig.key) {
        currentBackComponent = paneConfig.backComponent;
      }
    });
    this.panes = newPanes;
    if (this.panes.length > 0) {
      let backButton = null;
      if (currentBackComponent) {
        backButton = (
          <Button type="primary" onClick={() => { this.handleBack(currentBackComponent); }}>返回</Button>
        );
      }
      const operations = (
        <div className="main-tab-operation">
          {backButton}
          <Button onClick={this.handleRemoveOthers}>关闭其他</Button>
          <Button onClick={this.handleRefresh}>刷新</Button>
        </div>
      );
      return (
        <Tabs
          className={`${prefixCls}-tabs`}
          hideAdd
          type="editable-card"
          activeKey={activePath}
          animated={false}
          onEdit={this.handleTabEdit}
          onChange={this.handleTabChane}
          tabBarExtraContent={operations}
        >
        {this.panes}
        </Tabs>
      );
    }else {
      return <Home />;
    }
  }

  render() {
    const { app } = this.props;

    let style: React.CSSProperties = {
      width: `${Math.max(app.width - SIDEBAR_WIDTH, MIN_MAIN_WIDTH)}px`,
      height: `100%`,
      marginLeft: `${SIDEBAR_WIDTH}px`,
    };

    return (
      <div
        style={style}
        className={prefixCls}
      >
        {this.renderTabPanes()}
      </div>
    );
  }
}

export default injectNormal(Main, {
  app: 'app',
  sidebar: 'sidebar',
  routing: 'routing',
  components: 'components',
});

function getComponent(cps, componentName, options): string | React.ReactNode {
  let Component = cps[componentName];
  if (!Component) {
    return '';
  }
  if (options) {
    return <Component key={componentName} options={options} />;
  } else {
    return <Component key={componentName} />;
  }
}

let getTabPane = (tab, key, contentNode) => {
  let Content = contentNode;
  return (
    <TabPane tab={tab} key={key}>
      {Content}
    </TabPane>
  );
};
