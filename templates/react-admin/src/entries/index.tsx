// tslint:disable-next-line:no-unused-variable
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore, { sagaMiddleware } from '../store';
import { appSaga } from '../models';
import { persistStore } from 'redux-persist';

const store = configureStore();
sagaMiddleware.run(appSaga);

const history = syncHistoryWithStore(browserHistory, store);

let render = () => {
  persistStore(store, {
    whitelist: ['theme', 'token'],
  }, (err, restoredState) => {
    const Routes = require('../routes');
    ReactDOM.render(
      <Provider store={store}>
        <Routes history={history}/>
      </Provider>,
      document.getElementById('root'),
    );
  });
};

render();
