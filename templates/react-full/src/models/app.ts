import { initAction } from '../util/action';
import { initApi, ApiConfig } from '../util/api';
import { handleActions } from 'redux-actions';

let modelName = 'app';

// simple actions

let keys = {
  changeName: 'changeName',
};

const simpleActions = initAction<typeof keys>(keys, modelName);

export const actionNames = simpleActions.actionNames;
export const actions = simpleActions.actions;

// apis

let apis = {
  getName: 'getName',
};

let apiConfigs: ApiConfig[] = [{
  path: apis.getName,
}];

const api = initApi<typeof apis>('', apiConfigs, modelName);

export const apiActionNames = api.apiActionNames;
export const apiActions = api.apiActions;
export const sagas = api.sagas;

// reducers

export interface AppState {
  loading: boolean;
  name: string;
};

export const reducer = handleActions<AppState, any>({
  [apiActionNames.getName.request](state, action) {
    return {
      ...state,
      loading: true,
    };
  },
  [apiActionNames.getName.success](state, action) {
    return {
      ...state,
      loading: false,
      name: action.payload.res.name,
    };
  },
  [apiActionNames.getName.error](state, action) {
    return {
      ...state,
      loading: false,
      name: '',
    };
  },
  [actionNames.changeName](state, action) {
    return {
      ...state,
      name: action.payload.name,
    };
  },
}, {
  loading: false,
  name: '',
});
