export interface Sorter {
  key: string;
  sortOrder: ('ascend' | 'descend') | false;
  value: any;
  fieldName: string;
}

export interface ListState<T> {
  loading: boolean;
  infos: T[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    pageSizeOptions: string[];
    showSizeChanger: boolean;
    showQuickJumper: boolean;
  };
  queryData: any;
  sorter: Sorter;
}

interface MakeHandleActionsResult {
  [name: string]: (state, action) => any;
}

function makeHandleActions(listActionName, apiPath?): MakeHandleActionsResult {
  return {
    [listActionName.request](state, action) {
      // tslint:disable-next-line:no-unused-variable
      let { token, operatorId, pageNo, pageSize, except, ...queryData } = action.payload;
      except = except || {};
      if (apiPath) {
        return {
          ...state,
          [apiPath]: {
            ...state[apiPath],
            loading: true,
            queryData: queryData,
            sorter: except.sorter || null,
          },
        };
      }else {
        return {
          ...state,
          loading: true,
          queryData: queryData,
          sorter: except.sorter,
        };
      }
    },
    [listActionName.success](state, action) {
      if (apiPath) {
        return {
          ...state,
          [apiPath]: {
            ...state[apiPath],
            loading: false,
            infos: action.payload.res.infos,
            pagination: {
              ...state.pagination,
              current: action.payload.req.pageNo || 1,
              pageSize: action.payload.req.pageSize || 10,
              total: action.payload.res.totalNum,
            },
          },
        };
      }else {
        return {
          ...state,
          loading: false,
          infos: action.payload.res.infos,
          pagination: {
            ...state.pagination,
            current: action.payload.req.pageNo || 1,
            pageSize: action.payload.req.pageSize || 10,
            total: action.payload.res.totalNum,
          },
        };
      }
    },
    [listActionName.error](state, action) {
      if (apiPath) {
        return {
          ...state,
          [apiPath]: {
            ...state[apiPath],
            loading: false,
            infos: null,
          },
        };
      }else {
        return {
          ...state,
          loading: false,
          infos: null,
        };
      }
    },
  };
}

export function getInitializeState<T>(): ListState<T> {
  return {
    loading: false,
    infos: [],
    pagination: {
      current: 1,
      pageSize: 10,
      total: 10,
      pageSizeOptions: ['10', '20', '50', '100'],
      showSizeChanger: true,
      showQuickJumper: true,
    },
    queryData: {},
    sorter: null,
  };
}

export function makeListHandleActions<T>(listActionName: any): {
  handleActions: MakeHandleActionsResult,
  initializeState: ListState<T>;
}
export function makeListHandleActions<I>(listActionName: any, apiPath: keyof I): {
  handleActions: MakeHandleActionsResult,
  initializeState: I;
};
export function makeListHandleActions<T>(listActionName, apiPath?: string) {
  let handleActions = makeHandleActions(listActionName, apiPath);
  if (apiPath) {
    let initializeState = {
      [apiPath]: getInitializeState<T>(),
    };
    return {
      handleActions: handleActions,
      initializeState: initializeState,
    };
  }else {
    let initializeState = getInitializeState<T>();
    return {
      handleActions: handleActions,
      initializeState: initializeState,
    };
  }
}
