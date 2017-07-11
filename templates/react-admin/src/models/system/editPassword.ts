import { initAction } from '../../util/action';
import { initApi, ApiConfig } from '../../util/api';
import { handleActions } from 'redux-actions';

let modelName = 'editPassword';

// simple actions

let keys = {

};

const simpleActions = initAction<typeof keys>(keys, modelName);

export const actionNames = simpleActions.actionNames;
export const actions = simpleActions.actions;

// apis

let apis = {
  editPassword: 'editPassword',
};

let apiConfigs: ApiConfig[] = [{
  path: '/user/editPassword',
  actionName: apis.editPassword,
  message: '修改密码成功',
}];

const api = initApi<typeof apis>('/api', apiConfigs, modelName);

export const apiActionNames = api.apiActionNames;
export const apiActions = api.apiActions;
export const sagas = api.sagas;

// reducers

export interface EditPasswordState {
  loading: boolean;
}

export const reducer = handleActions<EditPasswordState, any>({
  [apiActionNames.editPassword.request](state, action) {
    return {
      ...state,
      loading: true,
    };
  },
  [apiActionNames.editPassword.success](state, action) {
    return {
      ...state,
      loading: false,
    };
  },
  [apiActionNames.editPassword.error](state, action) {
    return {
      ...state,
      loading: false,
    };
  },
}, {
  loading: false,
});
