import { initAction } from '../../util/action';
import { initApi, ApiConfig } from '../../util/api';
import { handleActions } from 'redux-actions';

let modelName = 'token';

// simple actions

let keys = {
};

const simpleActions = initAction<typeof keys>(keys, modelName);

export const actionNames = simpleActions.actionNames;
export const actions = simpleActions.actions;

// apis

let apis = {
  login: 'login',
  logout: 'logout',
};

let apiConfigs: ApiConfig[] = [{
  path: '/system/login',
  actionName: apis.login,
  customSaga: true,
  modelName: 'login',
}, {
  path: '/system/logout',
  actionName: apis.logout,
  customSaga: true,
  modelName: 'login',
}];

const api = initApi<typeof apis>('/api', apiConfigs, modelName);

export const apiActionNames = api.apiActionNames;
export const apiActions = api.apiActions;
export const sagas = api.sagas;

// reducers

export interface TokenState {
  token: string;
  operatorId: string;
}

export const reducer = handleActions<TokenState, any>({
  [apiActionNames.login.success](state, action) {
    let res = action.payload.res;
    return {
      ...state,
      token: res.token,
      operatorId: res.operatorId,
    };
  },
  [apiActionNames.login.error](state, action) {
    return {
      ...state,
      token: null,
      operatorId: null,
    };
  },
  [apiActionNames.logout.success](state, action) {
    return {
      ...state,
      token: null,
      operatorId: null,
    };
  },
  ['loginTimeout'](state, action) {
    return {
      ...state,
      token: null,
    };
  },
}, {
  token: null,
  operatorId: null,
});
