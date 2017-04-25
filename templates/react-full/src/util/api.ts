import { createAction, ActionFunctionAny, Action } from 'redux-actions';
import { call, put, take } from 'redux-saga/effects';
import xFetch from './xFetch';
import { browserHistory } from 'react-router';
import * as querystring from 'querystring';

interface Redirect {
  componentName: string;
  message?: string;
}

export interface ApiConfig {
  /** 
   * path (also use as action name)
   */
  path: string;
  /**
   * http method (default: GET)
   */
  method?: string;
  /**
   * Determine whether show message when request success
   */
  message?: boolean | string;
  /**
   * Determine whether redirect other route when request success
   */
  redirect?: Redirect;
  /** 
   * action name
   */
  actionName: string;
  /**
   * Determine whether custom saga.
   */
  customSaga?: boolean;
  /**
   * custom model name
   */
  modelName?: string;
}

export interface ApiActionNames {
  request: string;
  success: string;
  error: string;
}

export interface Api<T> {
  apiActionNames: {[key in keyof T]: ApiActionNames};
  apiActions: {[key in keyof T]: ActionFunctionAny<Action<{}>>};
  sagas: any[];
}

export function initApi<T>(basePath, configs: ApiConfig[], modelName: string): Api<T> {
  let apiActionNames = {} as any;
  let apiActions = {} as any;
  let sagas = [];

  configs.forEach(config => {
    let finalModelName = config.modelName || modelName;
    let truePath = config.actionName;
    let actionNames = makeActionNames(finalModelName, config);
    apiActionNames[truePath] = actionNames;
    apiActions[truePath] = createAction(actionNames.request);
    let request = makeRequest(basePath, config);
    let effect = makeEffect(config, request, actionNames);
    if (config.customSaga) {
      return;
    }
    if (config.redirect) {
      return sagas.push(redirect(apiActionNames[truePath], effect, config.redirect));
    }
    if (config.message) {
      return sagas.push(showMessage(apiActionNames[truePath], effect, config.message));
    }
    sagas.push(simple(apiActionNames[truePath], effect));
  });

  return {
    apiActionNames,
    apiActions,
    sagas,
  };
}

function makeRequest(basePath: string, api: ApiConfig) {
  return async(data) => {
    let opts = {};
    let uri = basePath + '/' + api.path;
    let method = 'POST';
    if (api.method) {
      method = api.method;
    }
    let upperCaseMethod = method.toUpperCase();
    if (upperCaseMethod === 'GET') {
      let query = querystring.stringify(data);
      if (query) {
        uri += '?' + query;
      }
      opts = {
        method: 'GET',
      };
    }else {
      opts = {
        method: method,
        body: JSON.stringify(data) || null,
      };
    }
    return await xFetch(uri, opts);
  };
}

function makeActionNames(modelName: string, api: ApiConfig): ApiActionNames {
  const baseActionName = `${modelName}／${api.method}_${api.path}`;
  return {
    request: `${baseActionName}_request`,
    success: `${baseActionName}_success`,
    error: `${baseActionName}_error`,
  };
}

function makeEffect(api: ApiConfig, request: any, actionNames: ApiActionNames) {
  return function*(req) {
    const {except, ...others} = req.payload;
    try {
      const response = yield call(request, others);
      yield put(createAction(actionNames.success)({
        req: req.payload,
        res: response,
      }));
      return response;
    } catch (error) {
      console.error(`request /${api.path} 错误`);
      console.error(`request params`, req.payload);
      console.error(`message`, error);
      yield put(createAction(actionNames.error)({
        req: req.payload,
        error: error,
        except: Object.assign({}, except),
      }));
    }
  };
}

function simple(actionNames: ApiActionNames, apiSaga: any) {
  return function* () {
    while (true) {
      const req = yield take(actionNames.request);
      yield call(apiSaga, req);
    }
  };
}

function showMessage(actionNames: ApiActionNames, apiSaga: any, message: string | boolean) {
  return function* () {
    while (true) {
      const req = yield take(actionNames.request);
      const res = yield call(apiSaga, req);
      if (res) {
        let showMessage = 'request success';
        if (typeof message === 'string') {
          showMessage = message;
        }
        console.log(showMessage);
      }
    }
  };
}

function redirect(actionNames: ApiActionNames, apiSaga: any, redirectObj: Redirect) {
  return function* () {
    while (true) {
      const req = yield take(actionNames.request);
      const res = yield call(apiSaga, req);
      if (res) {
        console.log(redirectObj.message || 'request success');
        browserHistory.push({
          pathname: redirectObj.componentName,
        });
      }
    }
  };
}
