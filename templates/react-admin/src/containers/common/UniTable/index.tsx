import * as  React from 'react';
import {
  Table,
  Row,
  Col,
} from 'antd';
import { ColumnProps as TableColumnConfig } from 'antd/lib/table/Column';
export { ColumnProps as TableColumnConfig } from 'antd/lib/table/Column';
import { connect } from 'react-redux';
import { TokenState } from '../../../models/common/token';
export { SearchTypeDecorator, ToolbarButtonDecorator, AdvanceSearchDecorator
, CascaderDecorator, DateDecorator, SelectDecorator, InputNumberDecorator, InputDecorator
, AdvanceSearchType } from '../../../components/common/TableSearchBar';
import TableSearchBar, { SearchTypeDecorator, ToolbarButtonDecorator
, AdvanceSearchDecorator, getAdvanceSearchDefaultValues } from '../../../components/common/TableSearchBar';
import { Sorter, ListState } from '../../../util/listReducers';
import './style.less';
import { MIN_HEIGHT } from '../../../util/constants';

const noLoop = () => {};

export interface SorterConfig {
  key: string;
  fieldName: string;
  ascend: any;
  descend: any;
}

interface TableStateDecorator extends ListState<any> {
}

export interface UniTableOwnProps {
  /** 加载数据的action */
  apiAction: any;
  /** 表格store */
  tableState: TableStateDecorator;
  /** 行定义 */
  columns: TableColumnConfig<any>[];
  /** 是否显示工具栏 */
  hasToolbar?: boolean;
  /** 工具栏按钮 */
  toolbarButtons?: ToolbarButtonDecorator[];
  /** 查询类型 */
  searchTypes?: SearchTypeDecorator;
  /** 加载数据接口需要的额外参数 */
  otherParams?: any;
  /** 是否有scroll.x */
  hasScrollX?: boolean;
  /** scroll.y */
  scrollY?: number;
  /** scrol.y 需要减去的值 */
  scrollY_offset?: number;
  /** 是否不需要mappingType */
  noMappingType?: boolean;
  /** 首次渲染是否加载数据 */
  loadFirstTime?: boolean;
  /** 默认每页数据数量 */
  defaultPageSize?: number;
  /** 表格行的类名 */
  rowClassName?: string | ((record: any, index: number) => string);
  /** 是否提供选择行 */
  hasRowSelection?: boolean;
  /** 表头 */
  title?: any;
  /** 是否显示正在加载 */
  showLoading?: boolean;
  /** 首次加载是否重置页码 */
  resetPaginationFirstTime?: boolean;
  /** 高级查询项 */
  advanceSearchs?: AdvanceSearchDecorator[];
  /** 是否显示分页  */
  pagination?: boolean;
  rowSelection?: (selectedKeys: any[], selectedRows: any[]) => void;
  sorterConfigs?: SorterConfig[];
  className?: string;
  tableClassName?: string;
  toolbarClassName?: string;
  smallToolbar?: boolean;
  onExpand?: any;
  expandedRowKeys?: any;
  expandedRowRender?: any;
  rowKey?: any;
}

export interface UniTableProps extends UniTableOwnProps {
  height: number;
  dispatch: any;
  token: TokenState;
}

interface UniTableState {
  formValues: any;
  selectedRows: any[];
  selectedRowKeys: string[];
}

/**
 * 增强型Table
 */
class UniTable extends React.Component<UniTableProps, Partial<UniTableState>> {

  static defaultProps = {
    resetPaginationFirstTime: false,
    advanceSearchs: [],
    pagination: true,
    rowSelection: noLoop,
    rowClassName: '',
    toolbarButtons: [],
    className: '',
    tableClassName: '',
    smallToolbar: false,
    showLoading: true,
  };

  private columns: TableColumnConfig<any>[];
  private scrollX: number;
  private rowSelection: any;

  constructor(props) {
    super(props);

    this.state = {
      selectedRows: [],
      selectedRowKeys: [],
      formValues: {},
    };
  }

  componentDidMount() {
    if (this.props.loadFirstTime !== false) {
      let pageNo = undefined;
      let pageSize = undefined;
      if (this.props.pagination !== false) {
        pageNo = 1;
        pageSize = 10;
        if (!this.props.resetPaginationFirstTime) {
          pageNo = this.props.tableState.pagination.current || 1;
          pageSize = this.props.tableState.pagination.pageSize || 10;
        }
      }
      let advanceSearchSelectFields = getAdvanceSearchDefaultValues(this.props.advanceSearchs);
      this.getList({ pageNo: pageNo, pageSize: pageSize,
      ...advanceSearchSelectFields, ...this.props.tableState.queryData}, this.props.tableState.sorter);
    }
  }

  getList = (queryData, sorter: Sorter) => {
    const {
      token,
      dispatch,
      apiAction,
      otherParams,
    } = this.props;
    let sorterParams = {};
    if (sorter) {
      sorterParams[sorter.fieldName] = sorter.value;
    }
    let except = {
      sorter: sorter,
    };
    dispatch(apiAction({...token, ...queryData, ...otherParams, ...sorterParams, except}));
  }

  onSelectChange(selectedKeys, selectedRows) {
    this.setState({
      selectedRows,
      selectedRowKeys: selectedKeys,
    });
    this.props.rowSelection(selectedKeys, selectedRows);
  }

  handleTableChange(pagination, filters, sorter) {
    let params = {
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
    };
    let advanceSearchSelectFields = this.state.formValues;
    let sorterState: Sorter = null;
    let sorterConfigs = this.props.sorterConfigs || [];
    sorterConfigs.forEach(s => {
      if (s.key === sorter.columnKey) {
        sorterState = {
          key: sorter.columnKey,
          fieldName: s.fieldName,
          sortOrder: sorter.order,
          value: s[sorter.order],
        };
      }
    });
    this.getList({...advanceSearchSelectFields, ...params}, sorterState);
  }

  handleSearch = (queryData) => {
    this.getList(queryData, this.props.tableState.sorter);
  }

  handleReset = (queryData) => {
    this.setState({
      formValues: {},
    });
    this.getList(queryData, this.props.tableState.sorter);
  }

  handleActionClick = (clickFunc) => {
    clickFunc(this.state.selectedRows, this.state.selectedRowKeys, this.state.formValues);
    this.setState({
      selectedRows: [],
      selectedRowKeys: [],
    });
  }

  handleFieldChange = (values) => {
    this.setState({
      formValues: values,
    });
  }

  _renderToolbar() {
    if (this.props.hasToolbar) {
      return (
        <TableSearchBar
        onReset={this.handleReset}
        onSearch={this.handleSearch}
        tableState={this.props.tableState}
        toolbarButtons={this.props.toolbarButtons}
        noMappingType={this.props.noMappingType}
        searchTypes={this.props.searchTypes}
        advanceSearchs={this.props.advanceSearchs}
        selectedRowsLength={this.state.selectedRows.length}
        onActionClick={this.handleActionClick}
        onFieldChange={this.handleFieldChange}
        className={this.props.toolbarClassName}
        small={this.props.smallToolbar}
        />
      );
    }
  }

  renderColumn = () => {
    this.columns = this.props.columns;
    this.scrollX = 0;
    this.columns.forEach(column => {
      if (!column.width) {
        column.width = 100;
      }
      if (typeof column.width === 'number') {
        this.scrollX += column.width;
      }
      if (!column.key) {
        column.key = column.dataIndex;
      }
    });
    let sorter = this.props.tableState.sorter;
    this.columns.forEach(column => {
      if (!sorter) {
        column.sortOrder = false;
        return;
      }
      if (column.dataIndex === sorter.key) {
        column.sortOrder = sorter.sortOrder;
      }else {
        column.sortOrder = false;
      }
    });
  }

  render() {
    const listData = this.props.tableState;
    let data = listData.infos;
    let defaultScrollYOffset = 350;
    let height = Math.max(MIN_HEIGHT, this.props.height);
    const { hasToolbar, toolbarButtons, searchTypes } = this.props;
    if (hasToolbar && toolbarButtons.length === 0) {
      defaultScrollYOffset -= 30;
    }
    if (hasToolbar && !searchTypes && toolbarButtons.length > 0) {
      defaultScrollYOffset -= 110;
    }
    if (!hasToolbar && toolbarButtons.length === 0) {
      defaultScrollYOffset -= 150;
    }
    if (!data || data.length === 0) {
      defaultScrollYOffset += 40;
    }
    let bodyHeight = this.props.scrollY || height - (this.props.scrollY_offset || defaultScrollYOffset);
    let scroll: {y: number, x?: number} = {
      y: bodyHeight,
    };
    if (this.props.hasScrollX) {
      scroll.x = this.scrollX;
    }
    if (!listData.loading) {
      if (!listData.infos) {
        data = null;
        // return <Error />;
      }
    }

    this.rowSelection = {
      onChange: this.onSelectChange.bind(this),
      selectedRowKeys: this.state.selectedRowKeys,
    };

    let bodyStyle = { height: `${bodyHeight}px`};

    let rowClassName = this.props.rowClassName;
    if (typeof rowClassName === 'string') {
      let t = rowClassName;
      rowClassName = (record, index) => t;
    }

    let pagination = this.props.pagination ? listData.pagination : false;

    this.renderColumn();

    let expandProps: any = {};
    if (this.props.onExpand) {
      expandProps.onExpand = this.props.onExpand;
    }
    if (this.props.expandedRowRender) {
      expandProps.expandedRowRender = this.props.expandedRowRender;
    }
    if (this.props.expandedRowKeys) {
      expandProps.expandedRowKeys = this.props.expandedRowKeys;
    }

    let rowKey = (record, i) => {
      if (i) {
        return i.toString();
      }else {
        return '';
      }
    };
    if (this.props.rowKey) {
      rowKey = this.props.rowKey;
    }

    let loading = false;
    if (this.props.showLoading) {
      loading = listData.loading;
    }

    return (
      <div className={`${this.props.className} unitable`}>
        <Row gutter={16}>
          <Col span={24}>{this._renderToolbar()}</Col>
        </Row>
        {this.props.title || ''}
        <Row>
          <Table
            className={this.props.tableClassName}
            dataSource={data}
            columns={this.columns}
            rowKey={rowKey}
            onChange={this.handleTableChange.bind(this)}
            rowSelection={this.props.hasRowSelection ? this.rowSelection : null}
            pagination={pagination}
            loading={loading}
            scroll={scroll}
            rowClassName={rowClassName}
            bodyStyle={bodyStyle}
            {...expandProps}
           />
        </Row>
     </div>
    );
  }
}

const mapState2Props = state => {
  return {
    height: state.app.height,
    token: state.token,
  };
};

export default connect<any, any, UniTableOwnProps>(mapState2Props)(UniTable);
