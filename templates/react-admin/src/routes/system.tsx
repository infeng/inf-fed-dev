import * as React from 'react';
import { Route } from 'react-router';

const getEditPasswordComponents = (nextState, cb) => {
  require.ensure([], (require: any) => {
    let Component = require('../containers/system/EditPassword');
    cb(null, {
      [nextState.routes[2].path]: Component,
    });
  }, 'system');
};

const getOperatorListComponents = (nextState, cb) => {
  require.ensure([], (require: any) => {
    let Component = require('../containers/system/UserList');
    let EditUser = require('../containers/system/EditUser');
    cb(null, {
      [nextState.routes[2].path]: Component,
      EditUser,
    });
  }, 'system');
};

const routes = (
  <Route path="system">
    <Route
      path="editPassword"
      getComponents={getEditPasswordComponents}
    />
    <Route
      path="operatorList"
      getComponents={getOperatorListComponents}
    />
  </Route>
);

export default routes;
