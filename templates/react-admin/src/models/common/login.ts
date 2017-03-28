import { initAction } from '../../util/action';
import { initApi, ApiConfig } from '../../util/api';
import { handleActions } from 'redux-actions';
import { take } from 'redux-saga/effects';
import { browserHistory } from 'react-router';

let modelName = 'login';

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
  getOperatorInfo: 'getOperatorInfo',
};

let apiConfigs: ApiConfig[] = [{
  path: '/system/login',
  actionName: 'login',
}, {
  path: '/system/logout',
  actionName: apis.logout,
}, {
  path: '/system/getOperatorInfo',
  actionName: apis.getOperatorInfo,
}];

const api = initApi<typeof apis>('/api', apiConfigs, modelName);

export const apiActionNames = api.apiActionNames;
export const apiActions = api.apiActions;

function* loginSuccess() {
  while (true) {
    yield take(apiActionNames[apis.login].success);
    yield browserHistory.replace({
      pathname: '/',
    });
  }
}

function* logoutSuccess() {
  while (true) {
    yield take(apiActionNames[apis.logout].success);
    yield browserHistory.replace({
      pathname: '/login',
    });
  }
}

function* loginTimeout() {
  while (true) {
    yield take('loginTimeout');
    yield browserHistory.replace({
      pathname: '/login',
    });
  }
}

export const sagas = [
  loginSuccess,
  logoutSuccess,
  loginTimeout,
  ...api.sagas,
];

// reducers

interface Menu {
  index: number;
  text: string;
  name: string;
  leaf: boolean;
  icon: string;
  items?: Menu[];
}

export interface LoginState {
  logoutLoading: boolean;
  loading: boolean;
  name: string;
  username: string;
  menus: Menu[];
  getOperatorInfoError: boolean;
};

const initialState = {
  name: '',
  username: '',
  menus: [],
};

export const reducer = handleActions<LoginState, any>({
  [apiActionNames.login.request](state, action) {
    return {
      ...state,
      loading: true,
    };
  },
  [apiActionNames.login.success](state, action) {
    // tslint:disable-next-line:no-unused-variable
    let { operatorId, ...data } = action.payload.res.operatorInfo;
    return {
      ...state,
      loading: false,
      ...data,
    };
  },
  [apiActionNames.login.error](state, action) {
    return {
      ...state,
      loading: false,
      ...initialState,
    };
  },
  [apiActionNames[apis.logout].request](state, action) {
    return {
      ...state,
      logoutLoading: true,
    };
  },
  [apiActionNames.logout.success](state, action) {
    return {
      ...state,
      logoutLoading: false,
      ...initialState,
    };
  },
  [apiActionNames.logout.error](state, action) {
    return {
      ...state,
      logoutLoading: false,
    };
  },
  [apiActionNames.getOperatorInfo.request](state, action) {
    return {
      ...state,
      loading: true,
    };
  },
  [apiActionNames.getOperatorInfo.success](state, action) {
    // tslint:disable-next-line:no-unused-variable
    let { operatorId, ...data } = action.payload.res.operatorInfo;
    return {
      ...state,
      loading: false,
      ...data,
      getOperatorInfoError: false,
    };
  },
  [apiActionNames.getOperatorInfo.error](state, action) {
    return {
      ...state,
      loading: false,
      getOperatorInfoError: true,
      ...initialState,
    };
  },
}, {
  loading: false,
  logoutLoading: false,
  ...initialState,
  getOperatorInfoError: false,
});
