import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import { fork } from 'redux-saga/effects';

declare const require: any;
const context = require.context('./', true, /\.js|\.ts$/);
const fileNames = context.keys().filter(item => item !== './index.ts');

let reducers = {};
let sagas = [];

fileNames.forEach(key => {
  let model = context(key);
  let modelName = key.match(/([^\/]+)(\.js|\.ts)$/)[1];
  reducers[modelName] = model.reducer;
  if (model.sagas) {
    sagas = sagas.concat(model.sagas);
  }
});

export const appReducer = combineReducers({
  ...reducers,
  routing,
});

export const appSaga = function* () {
  for (let i = 0; i < sagas.length; i++) {
    yield fork(sagas[i]);
  }
};
