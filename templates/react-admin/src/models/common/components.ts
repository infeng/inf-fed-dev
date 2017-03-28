import { initAction } from '../../util/action';
import { handleActions } from 'redux-actions';

let modelName = 'components';

// simple actions

let keys = {
  addComponents: 'addComponents',
};

const simpleActions = initAction<typeof keys>(keys, modelName);

export const actionNames = simpleActions.actionNames;
export const actions = simpleActions.actions;

// reducers

export interface ComponentsState {
  components: {
    [key: string]: any;
  };
};

export const reducer = handleActions<ComponentsState, any>({
  [actionNames.addComponents](state, action) {
    return {
      ...state,
      components: {...state.components, ...action.payload.components},
    };
  },
}, {
  components: {},
});
