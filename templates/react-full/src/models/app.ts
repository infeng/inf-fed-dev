import { initAction } from '../util/action';
import { initApi, ApiConfig } from '../util/api';
import { handleActions } from 'redux-actions';

let modelName = 'app';

// simple actions

export let keys = {
  changeName: 'changeName',
};

const simpleActions = initAction(keys, modelName);

export const actionNames = simpleActions.actionNames;
export const actions = simpleActions.actions;

// apis

export let apis = {
  getName: 'getName',
};

let apiConfigs: ApiConfig[] = [{
  path: apis.getName,
}];

const api = initApi('', apiConfigs, modelName);

export const apiActionNames = api.apiActionNames;
export const apiActions = api.apiActions;
export const sagas = api.sagas;

// reducers

export interface AppState {
  loading: boolean;
  name: string;
};

export const reducer = handleActions<AppState, any>({
  [apiActionNames[apis.getName].request](state, action) {
    return {
      ...state,
      loading: true,
    };
  },
  [apiActionNames[apis.getName].success](state, action) {
    return {
      ...state,
      loading: false,
      name: action.payload.res.name,
    };
  },
  [apiActionNames[apis.getName].error](state, action) {
    return {
      ...state,
      loading: false,
      name: '',
    };
  },
  [actionNames[keys.changeName]](state, action) {
    return {
      ...state,
      name: action.payload.name,
    };
  },
}, {
  loading: false,
  name: '',
});
