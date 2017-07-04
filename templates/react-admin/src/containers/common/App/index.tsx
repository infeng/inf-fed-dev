import * as React from 'react';
import '../../../style/index.less';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Main from '../Main';
import { actions, AppState } from '../../../models/common/app';
import { actions as cActions } from '../../../models/common/components';
import { getComponentName } from '../../../util/common';
import { apiActions as lApiActions, LoginState } from '../../../models/common/login';
import CardEx from '../../common/CardEx';
import Loading from '../../../components/common/Loading';
import Error from '../../../components/common/Error';
import { injectNormal, NormalComponentProps } from '../../../util/inject';

export interface AppProps extends NormalComponentProps {
  login: LoginState;
  token: any;
  app: AppState;
}

class App extends React.Component<AppProps, any> {
  handleResize = (e) => {
    const { dispatch } = this.props;
    dispatch(actions.resize({
      width: window.innerWidth,
      height: window.innerHeight,
    }));
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize, false);
  }

  componentWillMount() {
    const { dispatch, token } = this.props;
    dispatch(lApiActions.getOperatorInfo(token));
    this.addComponent(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.addComponent(nextProps);
  }

  addComponent = (props) => {
    // tslint:disable-next-line:no-unused-variable
    const { children, dispatch, location, params, route, routeParams, router, routes, ...components } = props;
    let NewComponents = {};
    Object.keys(components).forEach(componentName => {
      NewComponents[getComponentName(componentName)] = components[componentName].type;
    });
    dispatch(cActions.addComponents({
      components: NewComponents,
    }));
  }

  render() {
    const { login, app } = this.props;

    let MainNode = null;
    if (login.loading) {
      MainNode = (<CardEx><Loading /></CardEx>);
    }else {
      if (login.getOperatorInfoError) {
        MainNode = <Error />;
      }else {
        MainNode = <Main />;
      }
    }

    let mainStyle: React.CSSProperties = {
      height: `${app.mainHeight}px`,
    };

    return (
      <div>
        <Header />
        <div className="main" style={mainStyle}>
          <Sidebar />
          {MainNode}
        </div>
      </div>
    );
  }
}

export default injectNormal(App, {
  login: 'login',
  token: 'token',
  app: 'app',
});
