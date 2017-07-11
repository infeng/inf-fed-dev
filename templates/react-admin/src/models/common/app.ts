import { initAction } from '../../util/action';
import { handleActions } from 'redux-actions';
import { HEADER_HEIGHT, MIN_MAIN_HEIGHT } from '../../util/constants';

let modelName = 'app';

// simple actions

let keys = {
  resize: 'resize',
};

const simpleActions = initAction<typeof keys>(keys, modelName);

export const actionNames = simpleActions.actionNames;
export const actions = simpleActions.actions;

// reducers

export interface AppState {
  width: number;
  height: number;
  mainHeight: number;
}

export const reducer = handleActions<AppState, any>({
  [actionNames.resize](state, action) {
    return {
      ...state,
      width: action.payload.width,
      height: action.payload.height,
      mainHeight: Math.max(action.payload.height - HEADER_HEIGHT, MIN_MAIN_HEIGHT),
    };
  },
}, {
  width: window.innerWidth,
  height: window.innerHeight,
  mainHeight: window.innerHeight - HEADER_HEIGHT,
});
