import { initAction } from '../../util/action';
import { handleActions } from 'redux-actions';
import { getComponentName } from '../../util/common';
import { delay} from 'redux-saga';
import { take, put } from 'redux-saga/effects';
import { initApi, ApiConfig } from '../../util/api';

let modelName = 'sidebar';

// simple actions

let keys = {
  changeSubMenu: 'changeSubMenu',
  activePane: 'activePane',
  pushPane: 'pushPane',
  popPane: 'popPane',
  refreshPane: 'refreshPane',
  refreshPaneEnd: 'refreshPaneEnd',
  removeOtherPanes: 'removeOtherPanes',
  updatePane: 'updatePane',
};

const simpleActions = initAction<typeof keys>(keys, modelName);

export const actionNames = simpleActions.actionNames;
export const actions = simpleActions.actions;

// apis

let apis = {
  logout: 'logout',
  getOperatorInfo: 'getOperatorInfo',
};

let apiConfigs: ApiConfig[] = [{
  path: '/system/logout',
  actionName: apis.logout,
  customSaga: true,
  modelName: 'login',
}, {
  path: '/system/getOperatorInfo',
  actionName: apis.getOperatorInfo,
  customSaga: true,
  modelName: 'login',
}];

const api = initApi<typeof apis>('/api', apiConfigs, modelName);

export const apiActionNames = api.apiActionNames;
export const apiActions = api.apiActions;

function* refreshTabPane() {
  while (true) {
    const req: any = yield take(actionNames[keys.refreshPane]);
    yield delay(100);
    yield put(actions[keys.refreshPaneEnd]({
      newComponentName: req.payload.newComponentName,
      options: req.payload.options || null,
    }));
  }
}

export const sagas = [
  refreshTabPane,
  ...api.sagas,
];

// reducers

interface MenuItemDecorator {
  text: string;
  name: string;
}

interface MenuDecorator {
  text: string;
  name: string;
  icon: string;
  leaf: boolean;
  items: MenuItemDecorator[];
}

export interface BackComponentDecorator {
  componentName: string;
  options?: any;
}

interface PaneConfig {
  componentName: string;
  tab: string;
  key: string;
  options?: any;
  backComponent: BackComponentDecorator;
}

export interface SidebarState {
  menus: MenuDecorator[];
  activeSubMenu: string;
  activePath: string;
  paneConfigs: PaneConfig[];
};

export const reducer = handleActions<SidebarState, any>({
  [actionNames.changeSubMenu](state, action) {
    return {
      ...state,
      activeSubMenu: action.payload.activeSubMenu,
    };
  },
  [actionNames.activePane](state, action) {
    return {
      ...state,
      activePath: action.payload.activePath,
      activeSubMenu: action.payload.activeSubMenu,
    };
  },
  [actionNames.pushPane](state, action) {
    let activePath = action.payload.activePath;
    let tmpComponentName = activePath.match(/[^\/]\w+$/)[0];
    let componentName = getComponentName(tmpComponentName);
    let paneConfigs = state.paneConfigs;
    paneConfigs.push({
      componentName: componentName,
      tab: action.payload.title,
      key: activePath,
      backComponent: null,
    });
    return {
      ...state,
      activePath: activePath,
      paneConfigs,
    };
  },
  [actionNames.popPane](state, action) {
    let targetKey = action.payload.key;
    let activePath = action.payload.activePath;
    let paneConfigs = state.paneConfigs;
    paneConfigs = paneConfigs.filter(paneConfig => paneConfig.key !== targetKey);
    return {
      ...state,
      activePath: activePath,
      paneConfigs,
      activeSubMenu: action.payload.activeSubMenu,
    };
  },
  [actionNames.removeOtherPanes](state, action) {
    let paneConfigs = state.paneConfigs.filter(item => item.key === state.activePath);
    return {
      ...state,
      paneConfigs,
    };
  },
  [actionNames.refreshPane](state, action) {
    const { activePath, paneConfigs } = state;
    if (activePath === '') {
      return state;
    }
    for (let i = 0; i < paneConfigs.length; i++) {
      if (paneConfigs[i].key === activePath) {
        paneConfigs[i].componentName = '';
      }
    }

    return {
      ...state,
      paneConfigs: paneConfigs,
    };
  },
  [actionNames.refreshPaneEnd](state, action) {
    const { activePath, paneConfigs } = state;
    if (activePath === '') {
      return state;
    }
    const { newComponentName, options } = action.payload;
    for (let i = 0; i < paneConfigs.length; i++) {
      if (paneConfigs[i].key === activePath) {
        paneConfigs[i].componentName = newComponentName;
        if (options) {
          paneConfigs[i].options = options;
        }
      }
    }

    return {
      ...state,
      paneConfigs: paneConfigs,
    };
  },
  [apiActionNames.getOperatorInfo.success](state, action) {
    return {
      ...state,
      menus: action.payload.res.operatorInfo.menus,
    };
  },
  [apiActionNames.getOperatorInfo.error](state, action) {
    return {
      ...state,
      menus: [],
      activeSubMenu: '',
      activePath: '',
      paneConfigs: [],
    };
  },
  [apiActionNames.logout.success](state, action) {
    return {
      ...state,
      menus: [],
      activeSubMenu: '',
      activePath: '',
      paneConfigs: [],
    };
  },
  [actionNames.updatePane](state, action) {
    let { activePath } = state;
    let componentName = getComponentName(action.payload.componentName);
    let options = action.payload.options;
    let paneConfigs = state.paneConfigs;
    for (let i = 0; i < paneConfigs.length; i++) {
      if (paneConfigs[i].key === activePath) {
        paneConfigs[i].componentName = componentName;
        if (options) {
          paneConfigs[i].options = options;
        }
        paneConfigs[i].backComponent = action.payload.backComponent || null;
      }
    }
    return {
      ...state,
      paneConfigs,
    };
  },
}, {
  menus: [],
  activeSubMenu: '',
  activePath: '',
  paneConfigs: [],
});

interface UpdatePanePayload {
  componentName: string;
  backComponent?: BackComponentDecorator;
}

export function updatePane(dispatch, payload: UpdatePanePayload, options = {}) {
  dispatch(actions[keys.updatePane]({
    ...payload,
    options,
  }));
}
