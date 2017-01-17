import { createAction } from 'redux-actions';

export function initAction(keys: any, modelName: string) {
  let actions = {};
  let actionNames = {};

  Object.keys(keys).forEach(key => {
    let actionName = `${modelName}/${keys[key]}`;
    actionNames[key] = actionName;
    actions[key] = createAction(actionName);
  });

  return {
    actions,
    actionNames,
  };
};
