import { createAction, ActionFunctionAny, Action } from 'redux-actions';

export function initAction<T>(keys: any, modelName: string) {
  let actions: {[p in keyof T]: ActionFunctionAny<Action<any>>} = {} as any;
  let actionNames: {[p in keyof T]: string} = {} as any;

  Object.keys(keys).forEach(key => {
    let actionName = `${modelName}/${keys[key]}`;
    actionNames[key] = actionName;
    actions[key] = createAction(actionName);
  });

  return {
    actions,
    actionNames,
  };
}
