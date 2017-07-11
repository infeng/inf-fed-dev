// tslint:disable-next-line:no-unused-variable
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore, { sagaMiddleware } from '../store';
import { appSaga } from '../models';

const store = configureStore();
sagaMiddleware.run(appSaga);

const history = syncHistoryWithStore(browserHistory, store);

let render = () => {
  const routes = require('../routes');
  ReactDOM.render(
    <Provider store={store}>
      {routes(history)}
    </Provider>,
    document.getElementById('root')
  );
};

render();
