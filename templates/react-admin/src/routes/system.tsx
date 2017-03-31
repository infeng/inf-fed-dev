import * as React from 'react';
import { Route } from 'react-router';

const routes = (
  <Route path="system">
    <Route
      path="editPassword"
      getComponents={(nextState, cb) => {
        require.ensure([], (require: any) => {
          let Component = require('../containers/system/EditPassword');
          cb(null, {
            [nextState.routes[2].path]: Component,
          });
        }, 'system');
      }}
    />
    <Route
      path="operatorList"
      getComponents={(nextState, cb) => {
        require.ensure([], (require: any) => {
          let Component = require('../containers/system/UserList');
          let EditUser = require('../containers/system/EditUser');
          cb(null, {
            [nextState.routes[2].path]: Component,
            EditUser,
          });
        }, 'system');
      }}
    />
  </Route>
);

export default routes;
