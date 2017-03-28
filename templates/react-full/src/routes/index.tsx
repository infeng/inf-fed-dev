import * as React from 'react';
import { Router, Route } from 'react-router';

// containers
import App from '../containers/App';

let routes = (history) => (
  <Router history={history} >
    <Route path="/" component={App} />
  </Router>
);

export default routes;
