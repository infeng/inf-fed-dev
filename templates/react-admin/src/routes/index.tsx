import * as React from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import { TokenState } from '../models/common/token';
import { connect } from 'react-redux';

// containers
import App from '../containers/common/App';
import NotFound from '../components/common/NotFound';
import Login from '../containers/common/Login';

// routes
import SystemRoutes from './system';

interface RoutesProps {
  token: TokenState;
  history: any;
}

class Routes extends React.Component<RoutesProps, any> {
  checkLogin = (nextState, replace, callback) => {
    const { token } = this.props;
    if (!token.token) {
      replace({
        pathname: '/login',
      });
    }
    callback();
  }

  checkLogined = (nextState, replace, callback) => {
    const { token } = this.props;
    if (token.token) {
      replace({
        pathname: '/',
      });
    }
    callback();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  render() {
    const { history } = this.props;

    return (
      <Router history={history} >
        <Route path="/login" component={Login} onEnter={this.checkLogined} />
        <Route path="/" component={App} onEnter={this.checkLogin}>
          <IndexRoute component={NotFound} />
          {SystemRoutes}
        </Route>
        <Route path="*" component={NotFound}/>
      </Router>
    );
  }
}

const mapState2Props = state => {
  const { token } = state;
  return {
    token,
  };
};

export default connect(mapState2Props)(Routes);
