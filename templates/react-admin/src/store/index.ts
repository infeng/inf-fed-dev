import { createStore, applyMiddleware, compose } from 'redux';
import { appReducer } from '../models';
import createSagaMiddleware from 'redux-saga';
import { autoRehydrate } from 'redux-persist';
export const sagaMiddleware = createSagaMiddleware();

declare const module: any;
declare const window: any;
export default function configureStore(initialState = {}) {
  const enhancer = compose(
    autoRehydrate(),
    applyMiddleware(sagaMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  );

  const store = createStore(appReducer, initialState, enhancer as any);

  if (module.hot) {
    module.hot.accept('../models', () => {
      console.log('hmr reducers');
      const reducers = require('../models').appReducer;
      store.replaceReducer(reducers);
    });
  }

  return store;
}
