import { initAction } from '../../util/action';
import { initApi, ApiConfig } from '../../util/api';
import { handleActions } from 'redux-actions';
import { makeListHandleActions, ListState } from '../../util/listReducers';

let modelName = 'userList';

// simple actions

let keys = {

};

const simpleActions = initAction<typeof keys>(keys, modelName);

export const actionNames = simpleActions.actionNames;
export const actions = simpleActions.actions;

// apis

let apis = {
  getUserList: 'getUserList',
  resetPassword: 'resetPassword',
};

let apiConfigs: ApiConfig[] = [{
  path: '/user/getUserList',
  actionName: apis.getUserList,
}, {
  path: '/user/resetPassword',
  actionName: apis.resetPassword,
}];

const api = initApi<typeof apis>('/api', apiConfigs, modelName);

export const apiActionNames = api.apiActionNames;
export const apiActions = api.apiActions;
export const sagas = api.sagas;

// reducers

export interface UserListState extends ListState<any> {

};

const listHandle = makeListHandleActions(apiActionNames[apis.getUserList]);

export const reducer = handleActions<UserListState, any>({
  ...listHandle.handleActions,
  [apiActionNames.resetPassword.request](state, action) {
    return {
      ...state,
      loading: true,
    };
  },
  [apiActionNames.resetPassword.success](state, action) {
    return {
      ...state,
      loading: false,
    };
  },
  [apiActionNames.resetPassword.error](state, action) {
    return {
      ...state,
      loading: false,
    };
  },
}, {
  ...listHandle.initializeState,
});
