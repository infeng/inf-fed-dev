import { createAction } from 'redux-actions';
import { call, put, take } from 'redux-saga/effects';
import xFetch from './xFetch';
import { browserHistory } from 'react-router';
import * as querystring from 'querystring';

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
  redirect?: string;
  /** 
   * custom action name
   */
  displayPath?: string;
  /**
   * Determine whether custom saga.
   */
  customSaga?: boolean;
}

export interface ApiActionNames {
  request: string;
  success: string;
  error: string;
}

export interface Api {
  apiActionNames: {[key: string]: ApiActionNames};
  apiActions: any;
  sagas: any[];
}

export function initApi(basePath, configs: ApiConfig[], modelName: string): Api {
  let apiActionNames = {};
  let apiActions = {};
  let sagas = [];

  configs.forEach(config => {
    let truePath = config.path;
    if (config.displayPath) {
      truePath = config.displayPath;
    }
    let actionNames = makeActionNames(modelName, config);
    apiActionNames[truePath] = actionNames;
    apiActions[truePath] = createAction(actionNames.request);
    let request = makeRequest(basePath, config);
    let effect = makeEffect(config, request, actionNames);
    if (config.customSaga) {
      return;
    }
    let path = config.displayPath || config.path;
    if (config.message) {
      return sagas.push(message(apiActionNames[path], effect, config.message));
    }
    if (config.redirect) {
      return sagas.push(redirect(apiActionNames[path], effect, config.redirect));
    }
    sagas.push(simple(apiActionNames[path], effect));
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
    let method = 'GET';
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
        method: 'POST',
        body: querystring.stringify(data) || null,
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

function message(actionNames: ApiActionNames, apiSaga: any, message: string | boolean) {
  return function* () {
    while (true) {
      const req = yield take(actionNames.request);
      yield call(apiSaga, req);
      let showMessage = 'request success';
      if (typeof message === 'string') {
        showMessage = message;
      }
      alert(showMessage);
    }
  };
}

function redirect(actionNames: ApiActionNames, apiSaga: any, redirectPath: string) {
  return function* () {
    while (true) {
      const req = yield take(actionNames.request);
      yield call(apiSaga, req);
      browserHistory.push({
        pathname: redirectPath,
      });
    }
  };
}
