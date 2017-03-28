import { initAction } from '../../util/action';
import { initApi, ApiConfig } from '../../util/api';
import { handleActions } from 'redux-actions';
import { ValueText } from '../../util/baseDecorator';

let modelName = 'eidtUser';

// simple actions

let keys = {
  setEditUser: 'setEditUser',
  setValues: 'setValues',
};

const simpleActions = initAction<typeof keys>(keys, modelName);

export const actionNames = simpleActions.actionNames;
export const actions = simpleActions.actions;

// apis

let apis = {
  addUser: 'addUser',
  editUser: 'editUser',
  getRoleCollection: 'getRoleCollection',
  getGroupCollection: 'getGroupCollection',
};

let apiConfigs: ApiConfig[] = [{
  path: '/user/addUser',
  actionName: apis.addUser,
  redirect: {
    componentName: 'operatorList',
    message: '添加用户成功',
  },
}, {
  path: '/user/editUser',
  actionName: apis.editUser,
  redirect: {
    componentName: 'operatorList',
    message: '编辑用户成功',
  },
}, {
  path: '/role/getRoleCollection',
  actionName: apis.getRoleCollection,
}, {
  path: '/group/getGroupCollection',
  actionName: apis.getGroupCollection,
}];

const api = initApi<typeof apis>('/api', apiConfigs, modelName);

export const apiActionNames = api.apiActionNames;
export const apiActions = api.apiActions;
export const sagas = api.sagas;

// reducers

export interface EditUserState {
  loading: boolean;
  name: string;
  userName: string;
  roleId: number;
  groupId: number;
  roles: ValueText[];
  groups: ValueText[];
  maUsername: string;
};

const initialState = {
  loading: false,
  name: undefined,
  userName: undefined,
  roleId: undefined,
  groupId: undefined,
  maUsername: undefined,
};

export const reducer = handleActions<EditUserState, any>({
  [apiActionNames.addUser.request](state, action) {
    return {
      ...state,
      loading: true,
    };
  },
  [apiActionNames.addUser.success](state, action) {
    return {
      ...state,
      ...initialState,
    };
  },
  [apiActionNames.addUser.error](state, action) {
    return {
      ...state,
      loading: false,
    };
  },
  [apiActionNames.editUser.request](state, action) {
    return {
      ...state,
      loading: true,
    };
  },
  [apiActionNames.editUser.success](state, action) {
    return {
      ...state,
      ...initialState,
    };
  },
  [apiActionNames.editUser.error](state, action) {
    return {
      ...state,
      loading: false,
    };
  },
  [actionNames.setEditUser](state, action) {
    return {
      ...state,
      ...action.payload,
    };
  },
  [actionNames.setValues](state, action) {
    return {
      ...state,
      ...action.payload,
    };
  },
  [apiActionNames.getRoleCollection.request](state, action) {
    return {
      ...state,
      loading: true,
    };
  },
  [apiActionNames.getRoleCollection.success](state, action) {
    let roles = action.payload.res.infos.map(item => {
      return {
        value: item.id,
        text: item.roleName,
      };
    });
    return {
      ...state,
      loading: false,
      roles,
    };
  },
  [apiActionNames.getRoleCollection.error](state, action) {
    return {
      ...state,
      loading: false,
    };
  },
  [apiActionNames.getGroupCollection.request](state, action) {
    return {
      ...state,
      loading: true,
    };
  },
  [apiActionNames.getGroupCollection.success](state, action) {
    let groups = action.payload.res.infos.map(item => {
      return {
        value: item.id,
        text: item.groupName,
      };
    });
    return {
      ...state,
      loading: false,
      groups,
    };
  },
  [apiActionNames.getGroupCollection.error](state, action) {
    return {
      ...state,
      loading: false,
    };
  },
}, {
  ...initialState,
  roles: [],
  groups: [],
});
