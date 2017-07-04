import * as React from 'react';
import UniTable, { TableColumnConfig, ToolbarButtonDecorator
, SearchTypeDecorator, AdvanceSearchDecorator } from '../../common/UniTable';
import { UserListState, apiActions } from '../../../models/system/userList';
import { updatePane } from '../../../models/common/sidebar';
import { injectApi, ApiComponentProps } from '../../../util/inject';

export interface UserListProps extends ApiComponentProps<UserListState> {
}

const searchTypes: SearchTypeDecorator = {
  items: [{
  value: 1,
  text: '姓名',
}, {
  value: 2,
  text: '账号名',
}]};

const advanceSearchs: AdvanceSearchDecorator[] = [{
  type: 'select',
  props: {
    fieldName: 'sort',
    placeholder: '顺序',
    options: [{
      value: 1,
      text: '倒序',
    }, {
      value: 2,
      text: '升序',
    }],
  },
}];

class UserList extends React.Component<UserListProps, any> {
  resetPassword = (id) => {
    const { dispatch, token } = this.props;
    dispatch(apiActions.resetPassword({
      ...token,
      userId: id,
    }));
  }

  render() {
    const { data, dispatch } = this.props;

    const columns: TableColumnConfig<any>[] = [{
      title: '账户名称',
      dataIndex: 'userName',
    }, {
      title: '姓名',
      dataIndex: 'name',
    }, {
      title: '操作',
      dataIndex: 'actions',
      render: (text, record, index) => {
        return (
          <div className="action-container">
            <a
              onClick={() => {
                updatePane(dispatch, {
                  componentName: 'EditUser',
                  backComponent: {
                    componentName: 'operatorList',
                  },
                }, {
                  userId: record.id,
                  userName: record.userName,
                  name: record.name,
                });
              }}
            >
              编辑
            </a>
          </div>
        );
      },
    }];

    const toolbarButtons: ToolbarButtonDecorator[] = [{
      key: 'plus',
      type: 'primary',
      onClick: () => {
        updatePane(dispatch, {
          componentName: 'EditUser',
          backComponent: {
            componentName: 'operatorList',
          },
        },
          {userId: null}
        );
      },
      enableForAll: true,
      text: '添加用户',
    }];

    return (
      <UniTable
        columns={columns}
        apiAction={apiActions.getUserList}
        tableState={data}
        toolbarButtons={toolbarButtons}
        hasToolbar={true}
        searchTypes={searchTypes}
        advanceSearchs={advanceSearchs}
      />
    );
  }
}

export default injectApi(UserList, {
  data: 'userList',
});
