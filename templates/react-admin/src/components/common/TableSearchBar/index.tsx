import * as React from 'react';
import { Form, Button, Select, Input, Cascader, DatePicker, InputNumber, Radio } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { ButtonType } from 'antd/lib/button/button';
import { DATETIME_FORMAT } from '../../../util/constants';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

export interface SearchTypeItemDecorator {
  value: number | string;
  text: string;
}

export interface SearchTypeDecorator {
  fieldName?: string;
  mappingTypeFieldName?: string;
  defaultValue?: any;
  items: SearchTypeItemDecorator[];
}

export interface ToolbarButtonDecorator {
  key: string;
  type: string;
  icon?: string;
  onClick: (selectedRows: any[], selectedKeys: any[], queryParams: any) => void;
  enableForAll: boolean;
  loading?: boolean;
  disabled?: boolean;
  text: string;
}

interface BaseSearchDecorator {
  fieldName: string;
  paddingRight?: number;
  paddingLeft?: number;
}

export interface CascaderDecorator extends BaseSearchDecorator {
  options: any;
  placeholder?: string;
  defaultValue?: any;
  allowClear?: boolean;
  filter?: (item: any) => boolean;
  width?: number;
}

export interface DateDecorator extends BaseSearchDecorator {
  label?: string;
  fieldNames?: string[];
  defaultValue?: moment.Moment[];
  isAdvanceTimeRange?: boolean;
  advanceType?: SearchTypeDecorator;
  format?: string;
  showTime?: boolean;
}

export interface SelectDecorator extends BaseSearchDecorator {
  defaultValue?: any;
  options: {value: number | string, text?: string, name?: string, groupId?: string, nameAbbreviation?: string}[];
  placeholder?: string;
  allowClear?: boolean;
  searchImmediately?: boolean;
  width?: number;
  showSearch?: boolean;
  optionKey?: (item, index) => string;
  filterOption?: any;
  mode?: 'multiple' | 'tags' | 'combobox' | 'default';
  resetFieldNameOnChange?: string;
  filter?: (values, options) => any[];
}

export interface InputNumberDecorator extends BaseSearchDecorator {
  defaultValue?: number;
  placeholder: string;
  width?: number;
}

export interface InputDecorator extends BaseSearchDecorator {
  defaultValue?: number;
  placeholder: string;
  width?: number;
}

export interface SimpleDateDecorator extends BaseSearchDecorator {
  defaultValue?: string;
  format?: string;
  showTime?: boolean;
}

export type AdvanceSearchType = 'select' | 'date' | 'cascader' | 'inputNumber' | 'input' | 'simpleDate';

export interface AdvanceSearchDecorator {
  type: AdvanceSearchType;
  props: SelectDecorator | DateDecorator | CascaderDecorator | InputNumberDecorator | InputDecorator |
  SimpleDateDecorator;
}

export interface TableSearchBarOwnProps {
  toolbarButtons?: ToolbarButtonDecorator[];
  onActionClick?: (clickFunc: any) => void;
  noMappingType?: boolean;
  searchTypes?: SearchTypeDecorator;
  advanceSearchs?: AdvanceSearchDecorator[];
  onReset: (queryDate) => void;
  onSearch: (queryParams) => void;
  selectedRowsLength?: number;
  onFieldChange: (values) => void;
  className?: string;
  small?: boolean;
  queryData: any;
}

export interface TableSearchBarProps extends TableSearchBarOwnProps {
  form: WrappedFormUtils;
}

const defaultDateFieldNames = ['startTime', 'endTime'];
const defaultDateValues = [null, null];
const itemStyle: React.CSSProperties = {
  display: 'inline-block',
  verticalAlign: 'middle',
};

class TableSearchBar extends React.Component<TableSearchBarProps, any> {
  static defaultProps = {
    noMappingType: false,
    onActionClick: () => {},
    selectedRowsLength: 1,
    advanceSearchs: [],
    className: '',
    small: false,
  };

  dateRange: {value: string, text: string}[];

  constructor(props) {
    super(props);

    this.dateRange = [{
      value: '1',
      text: '本月',
    }, {
      value: '2',
      text: '本周',
    }];
  }

  renderActions = () => {
    if (this.props.toolbarButtons) {
      let toolbarButtonNodes = this.props.toolbarButtons.map(button => {
        let disabled = false;
        if (typeof button.disabled === 'boolean') {
          disabled = button.disabled;
        }
        return (
          <Button
            loading={button.loading || false}
            disabled={(this.props.selectedRowsLength === 0 && !button.enableForAll) || disabled}
            key={button.key}
            style={{marginRight:5}}
            type={button.type as ButtonType} icon={button.icon}
            onClick={() => {this.props.onActionClick(button.onClick);}}
          >
            {button.text}
          </Button>
        );
      });
      return (
        <div style={{ marginBottom: '12px' }}>
          {toolbarButtonNodes}
        </div>
      );
    }
    return null;
  }

  renderItem = (children: React.ReactNode, options: BaseSearchDecorator, style?: React.CSSProperties) => {
    return (
      <div
        style={{...itemStyle, padding: getItemPadding(options), ...style}}
        key={options.fieldName}
      >
        {children}
      </div>
    );
  }

  renderNormalSearch = () => {
    const { searchTypes } = this.props;
    if (searchTypes) {
      const { getFieldDecorator } = this.props.form;

      let [typeFiledName, mappingTypeFieldName] = this.getSearchTypeFieldName();

      let mappingTypeInitialValue = getInitialValue(this.props.queryData, mappingTypeFieldName, 1);
      let searchTypeInitialValue = getInitialValue(
        this.props.queryData, typeFiledName, searchTypes.defaultValue || 1);
      let searchValueInitialValue = getInitialValue(this.props.queryData, 'searchValue', undefined);

      const mappingTypeNode = this.props.noMappingType ?
      '' :
      (
        <FormItem style={{ ...itemStyle, width: '80px'}}>
          {getFieldDecorator (mappingTypeFieldName, {
            initialValue: mappingTypeInitialValue.toString(),
          })(
            <Select
              placeholder="匹配模式"
              allowClear={false}
              style={{width: '100%'}}
              onSelect={(value) => {this.handleFieldChange(mappingTypeFieldName, value);}}
            >
              <Option key="1" value={'1'}>等于</Option>
              <Option key="2" value={'2'}>半模糊</Option>
              <Option key="3" value={'3'}>全模糊</Option>
            </Select>
          )}
        </FormItem>
      );

      const searchTypeOptions = searchTypes.items.map(
        type => <Option key={type.value.toString()} value={type.value.toString()}>{type.text}</Option>);
      const searchTypeProps = getFieldDecorator (typeFiledName, {
        initialValue: searchTypeInitialValue.toString(),
      });

      let searchValueNode = getFieldDecorator('searchValue', {
        initialValue: searchValueInitialValue,
      })(
        <Input
          placeholder="查询关键词"
          size="default"
          onChange={(e: any) => {this.handleFieldChange('searchValue', e.target.value);}}
        />
      );
      let width = '405px';
      if (this.props.noMappingType) {
        width = '292px';
      }
      return this.renderItem(
        <div>
          <FormItem style={{ ...itemStyle, width: '100px'}}>
            {searchTypeProps(
              <Select
                placeholder="查询类型"
                allowClear={false}
                style={{width: '100%'}}
                onSelect={(value) => {this.handleFieldChange(typeFiledName, value);}}
                >
              { searchTypeOptions }
              </Select>
            )}
          </FormItem>
          {mappingTypeNode}
          <FormItem style={{ ...itemStyle, width: '150px'}}>
            {searchValueNode}
          </FormItem>
        </div>,
        {fieldName: 'normal', paddingLeft: 8, paddingRight: 8}
      );
    }
  }

  checkSortSelect = (searchImmediately, rule, value, callback) => {
    if (searchImmediately) {
      this.handleSearch();
    }
    callback();
  }

  renderSelectItem = (selectOptions: SelectDecorator) => {
    const { queryData, form } = this.props;
    const { getFieldDecorator } = form;
    let defaultValue = undefined;
    if (selectOptions.mode === 'multiple') {
      defaultValue = selectOptions.defaultValue ? selectOptions.defaultValue : undefined;
    }else {
      defaultValue = selectOptions.defaultValue ? selectOptions.defaultValue.toString() : undefined;
    }
    let initialValue = getInitialValue(
      queryData,
      selectOptions.fieldName,
      defaultValue,
    );
    if (initialValue !== undefined && initialValue !== null) {
      if (selectOptions.mode === 'multiple') {
        initialValue = initialValue.map(item => {
          return item.toString();
        });
      }else {
        initialValue = initialValue.toString();
      }
    }
    let allowClear = true;
    if (typeof selectOptions.allowClear !== 'undefined') {
      allowClear = selectOptions.allowClear;
    }
    let itemWidth = `${selectOptions.width || 120}px`;
    let options = selectOptions.options;
    if (selectOptions.filter) {
      options = selectOptions.filter(this.getSearchParams(), options);
    }

    let style: React.CSSProperties = {
      minWidth: itemWidth,
    };

    return this.renderItem(
      <div>
        <FormItem>
          {getFieldDecorator (selectOptions.fieldName, {
            initialValue: initialValue,
            rules: [{
              type: selectOptions.mode === 'multiple' ? 'array' : 'string',
              validator: this.checkSortSelect.bind(this, selectOptions.searchImmediately),
            }],
          })(
            <Select
              allowClear={allowClear}
              placeholder={selectOptions.placeholder || ''}
              onChange={(value) => {
                let result;
                if (selectOptions.mode === 'multiple') {
                  result = value ? (value as any[]).map(item => this.getSelectItemValue(item)) : undefined;
                }else {
                  result = this.getSelectItemValue(value);
                }
                this.handleFieldChange(selectOptions.fieldName, result);
                if (selectOptions.resetFieldNameOnChange) {
                  this.props.form.setFieldsValue({
                    [selectOptions.resetFieldNameOnChange]: undefined,
                  });
                }
              }}
              showSearch={selectOptions.showSearch}
              filterOption={selectOptions.filterOption || null}
              mode={selectOptions.mode ? selectOptions.mode : 'default'}
            >
              {options.map((item, index) => {
                let key = item.value.toString();
                if (selectOptions.optionKey) {
                  key = selectOptions.optionKey(item, index);
                }
                return (
                  <Option
                    key={key}
                    value={item.value.toString()}
                  >
                    {item.text || item.name}
                  </Option>
                );
              })}
            </Select>
          )}
        </FormItem>
      </div>,
      selectOptions,
      style,
    );
  }

  renderCascaderItem = (cascader: CascaderDecorator) => {
    const { getFieldDecorator  } = this.props.form;
    let options = cascader.options;
    let initialValue = undefined;
    let queryValue = this.props.queryData[cascader.fieldName];
    if (this.props.queryData && queryValue !== undefined) {
      options.forEach(option => {
        option.children.forEach(item => {
          if (item.value === queryValue[0]) {
            initialValue = [option.value, queryValue[0]];
          }
        });
      });
    }
    let allowClear = true;
    if (typeof cascader.allowClear !== 'undefined') {
      allowClear = cascader.allowClear;
    }
    if (cascader.filter) {
      options = options.filter(cascader.filter);
    }

    let itemWidth = `${cascader.width || 170}px`;

    return this.renderItem(
      <div>
        <FormItem>
        {getFieldDecorator (cascader.fieldName, {
          initialValue: initialValue,
        })(
          <Cascader
          options={options}
          placeholder={cascader.placeholder}
          allowClear={allowClear}
          onChange={value => {
            this.handleFieldChange(cascader.fieldName, value ? [value[value.length - 1]] : undefined);
          }}
          />
        )}
        </FormItem>
      </div>,
      cascader,
      {width: itemWidth}
    );
  }

  handleAdvanceDateRangeSelected = (startFieldName, endFieldName, e) => {
    let value = e.target.value;
    switch (value) {
      case '1':
        let dates1 = getCurrentMonth();
        this.props.form.setFieldsValue({
          [startFieldName]: dates1[0],
          [endFieldName]: dates1[1],
        });
        break;
      case '2':
        let dates2 = getCurrentWeek();
        this.props.form.setFieldsValue({
          [startFieldName]: dates2[0],
          [endFieldName]: dates2[1],
        });
        break;
      default:
        this.props.form.setFieldsValue({
          [startFieldName]: undefined,
          [endFieldName]: undefined,
        });
        break;
    }
  }

  renderSimpleDateItem = (date: SimpleDateDecorator) => {
    const { getFieldDecorator } = this.props.form;
    let defaultValues = date.defaultValue || null;
    let format = date.format || DATETIME_FORMAT;

    return this.renderItem(
      <div>
        <FormItem>
          {getFieldDecorator (date.fieldName, {
            initialValue: defaultValues,
          })(
            <DatePicker
              showTime={date.showTime}
              format={format}
              onChange={(newDate) => {
                let result = newDate ? newDate.format(format) : undefined;
                this.handleFieldChange(date.fieldName, result);
              }}
            />
          )}
        </FormItem>
      </div>,
      date,
      { width: '180px' },
    );
  }

  renderDateItem = (date: DateDecorator) => {
    const { getFieldDecorator } = this.props.form;
    const { queryData } = this.props;
    let fieldNames = date.fieldNames || defaultDateFieldNames;
    let startTimeFieldName = fieldNames[0];
    let endTimeFieldName = fieldNames[1];
    let defaultValues = date.defaultValue || defaultDateValues;
    if (defaultValues.length === 1) {
      defaultValues.push(null);
    }
    let startTimeInitialValue = getInitialValue(queryData, startTimeFieldName, defaultValues[0]);
    if (startTimeInitialValue !== null) {
      startTimeInitialValue = moment(startTimeInitialValue);
    }
    let endTimeInitialValue = getInitialValue(queryData, endTimeFieldName, defaultValues[1]);
    if (endTimeInitialValue !== null) {
      endTimeInitialValue = moment(endTimeInitialValue);
    }
    let advanceDateSelectNode = null;
    if (date.isAdvanceTimeRange) {
      advanceDateSelectNode = (
        <div style={{ paddingLeft: '8px', ...itemStyle }}>
          <FormItem>
            <RadioGroup
            onChange={this.handleAdvanceDateRangeSelected.bind(this, startTimeFieldName, endTimeFieldName)}
            >
              {this.dateRange.map(item => {
                return <Radio key={item.value.toString()} value={item.value} >{item.text}</Radio>;
              })}
            </RadioGroup>
          </FormItem>
        </div>
      );
    }
    // 时间类型
    let advanceTypeNode = null;
    if (date.advanceType) {
      let advanceTypeFiledName = date.advanceType.fieldName;
      let initialValue = getInitialValue(queryData, advanceTypeFiledName, date.defaultValue || 1);
      advanceTypeNode = (
        <div style={{ ...itemStyle}}>
          <FormItem>
            {getFieldDecorator(advanceTypeFiledName, {
              rules: [{
                type: 'string',
                required: true,
              }],
              initialValue: initialValue.toString(),
            })(
              <Select
                onSelect={(value) => {
                  let result = this.getSelectItemValue(value);
                  this.handleFieldChange(advanceTypeFiledName, result);
                }}
              >
                {date.advanceType.items.map(item => {
                  return <Option key={item.value.toString()} value={item.value.toString()}>{item.text}</Option>;
                })}
              </Select>
            )}
          </FormItem>
        </div>
      );
    }
    let label = date.label;
    let labelCol = { span: 4 };
    if (date.advanceType) {
      label = '';
      labelCol = {span: 0};
    }
    if (label) {
      label += ': ';
    }
    let datePickerStyle: React.CSSProperties = {
      ...itemStyle,
    };
    let format = date.format || DATETIME_FORMAT;
    return this.renderItem(
      <div>
        {advanceTypeNode}
        <div
          style={{...itemStyle }}
        >
          {label}
          <div style={datePickerStyle}>
            <FormItem>
              {getFieldDecorator (startTimeFieldName, {
                initialValue: startTimeInitialValue,
              })(
                <DatePicker
                  showTime={date.showTime}
                  format={format}
                  defaultPickerValue={moment().set('hour', 0).set('minute', 0).set('second', 0)}
                  onChange={(newDate) => {
                    let result = newDate ? newDate.format(format) : undefined;
                    this.handleFieldChange(startTimeFieldName, result);
                  }}
                  style={datePickerStyle}
                />
              )}
            </FormItem>
          </div>
          <div style={datePickerStyle}><FormItem>-</FormItem></div>
          <div style={datePickerStyle}>
            <FormItem>
              {getFieldDecorator (endTimeFieldName, {
                initialValue: endTimeInitialValue,
              })(
                <DatePicker
                  showTime={date.showTime}
                  format={format}
                  defaultPickerValue={moment().set('hour', 23).set('minute', 59).set('second', 59)}
                  onChange={(newDate) => {
                    let result = newDate ? newDate.format(format) : undefined;
                    this.handleFieldChange(endTimeFieldName, result);
                  }}
                  style={datePickerStyle}
                />
              )}
            </FormItem>
          </div>
        </div>
        {advanceDateSelectNode}
      </div>,
      date,
    );
  }

  renderInputNumberItem = (obj: InputNumberDecorator) => {
    const { queryData, form } = this.props;
    const { getFieldDecorator  } = form;
    let initialValue = getInitialValue(queryData, obj.fieldName, undefined);
    let width = obj.width || 180;

    return this.renderItem(
      <div>
        <FormItem
        >
        {getFieldDecorator (obj.fieldName, {
          initialValue: initialValue,
        })(
          <InputNumber
          placeholder={obj.placeholder}
          style={{width: `${width}px`, margin: '0'}}
          onChange={(value) => {
            this.handleFieldChange(obj.fieldName, value);
          }}
          />
        )}
        </FormItem>
      </div>,
      obj,
    );
  }

  renderInputItem = (obj: InputDecorator) => {
    const { queryData, form } = this.props;
    const { getFieldDecorator  } = form;
    let initialValue = getInitialValue(queryData, obj.fieldName, undefined);
    let width = obj.width || 180;
    return this.renderItem(
      <div>
        <FormItem>
        {getFieldDecorator (obj.fieldName, {
          initialValue: initialValue,
        })(
          <Input
          placeholder={obj.placeholder}
          onChange={(e: any) => {this.handleFieldChange(obj.fieldName, e.target.value);}}
          style={{width: `${width}px`}}
          />
        )}
        </FormItem>
      </div>,
      obj,
    );
  }

  renderAdvanceSearch = () => {
    return this.props.advanceSearchs.map(item => {
      switch (item.type) {
        case 'select':
          return this.renderSelectItem(item.props as SelectDecorator);
        case 'date':
          return this.renderDateItem(item.props as DateDecorator);
        case 'cascader':
          return this.renderCascaderItem(item.props as CascaderDecorator);
        case 'inputNumber':
          return this.renderInputNumberItem(item.props as InputNumberDecorator);
        case 'input':
          return this.renderInputItem(item.props as InputDecorator);
        case 'simpleDate':
          return this.renderSimpleDateItem(item.props as SimpleDateDecorator);
        default:
          return null;
      }
    });
  }

  renderSearchButtons = () => {
    const { small } = this.props;
    if ((this.props.searchTypes || this.props.advanceSearchs.length > 0)) {
      return this.renderItem(
        <div>
          <FormItem>
            <Button
              size={small ? 'small' : null}
              type="primary" style={{marginRight:5}}
              onClick={this.handleSearch}
            >
              查询
            </Button>
            <Button size={small ? 'small' : null} onClick={this.handleReset} >重置</Button>
          </FormItem>
        </div>,
        {fieldName: 'buttons'}
      );
    }
  }

  getSelectItemValue(formValue) {
    let result;
    try {
      let r = parseInt(formValue, 0);
      if (isNaN(r)) {
        if (formValue === 'true') {
          result = true;
        }else if (formValue === 'false') {
          result = false;
        }
      }else {
        result = r;
      }
    }catch (e) {

    }
    return result;
  }

  getAdvanceSearchFieldValues = (reset: boolean = false) => {
    const { queryData } = this.props;
    const { getFieldValue } = this.props.form;
    let advanceSearchSelectFields = {};
    const setSelectValue = (selectItem: SelectDecorator) => {
      let fieldName = selectItem.fieldName;
      let defaultValue = selectItem.defaultValue;
      if (reset) {
        advanceSearchSelectFields[fieldName] = defaultValue;
        return;
      }
      let formValue = this.props.form.getFieldValue(fieldName);
      let value = undefined;
      if (typeof formValue !== 'undefined') {
        if (selectItem.mode === 'multiple') {
          value = formValue.map(item => this.getSelectItemValue(item));
          if (value.length === 0) {
            value = undefined;
          }
        }else {
          value = this.getSelectItemValue(formValue);
        }
      }else {
        advanceSearchSelectFields[fieldName] = getInitialValue(queryData, fieldName, defaultValue);
      }
      advanceSearchSelectFields[fieldName] = value;
    };
    const setDateValue = (date: DateDecorator) => {
      let { fieldNames, defaultValue, advanceType } = date;
      fieldNames = fieldNames || defaultDateFieldNames;
      defaultValue = defaultValue || [undefined, undefined];
      if (defaultValue.length === 1) {
        defaultValue.push(undefined);
      }
      if (reset) {
        advanceSearchSelectFields[fieldNames[0]] = defaultValue[0];
        advanceSearchSelectFields[fieldNames[1]] = defaultValue[1];
        return;
      }
      let start = getFieldValue(fieldNames[0]) || undefined;
      let end = getFieldValue(fieldNames[1]) || undefined;
      let format = date.format || DATETIME_FORMAT;
      start ? start = start.format(format) : start = start;
      end ? end = end.format(format) : end = end;
      advanceSearchSelectFields[fieldNames[0]] = start;
      advanceSearchSelectFields[fieldNames[1]] = end;
      if (advanceType) {
        let advanceTypeValue = getFieldValue(advanceType.fieldName);
        advanceSearchSelectFields[advanceType.fieldName] = this.getSelectItemValue(advanceTypeValue);
      }
    };
    const setCascaderValue = (fieldName: string, defaultValue: any) => {
      if (reset) {
         advanceSearchSelectFields[fieldName] = defaultValue;
         return;
      }
      let value = this.props.form.getFieldValue(fieldName);
      advanceSearchSelectFields[fieldName] = value ? [value[value.length - 1]] : undefined;
    };
    const setInputNumberValue = (fieldName: string, defaultValue: any) => {
      if (reset) {
        advanceSearchSelectFields[fieldName] = defaultValue;
        return;
      }
      let value = this.props.form.getFieldValue(fieldName);
      advanceSearchSelectFields[fieldName] = value;
    };
    const setInputValue = (fieldName: string, defaultValue: any) => {
      if (reset) {
        advanceSearchSelectFields[fieldName] = defaultValue;
        return;
      }
      let value = this.props.form.getFieldValue(fieldName);
      advanceSearchSelectFields[fieldName] = value;
    };
    const setSimpleDateValue = (date: SimpleDateDecorator) => {
      let dateValue = getFieldValue(date.fieldName) || undefined;
      let dateFormatValue = undefined;
      if (dateValue) {
        dateFormatValue = dateValue.format(date.format || DATETIME_FORMAT);
      }
      advanceSearchSelectFields[date.fieldName] = dateFormatValue;
    };
    this.props.advanceSearchs.forEach(item => {
      switch (item.type) {
        case 'select':
          let select = item.props as SelectDecorator;
          setSelectValue(select);
          break;
        case 'date':
          let date = item.props as DateDecorator;
          setDateValue(date);
          break;
        case 'cascader':
          let cascader = item.props as CascaderDecorator;
          setCascaderValue(cascader.fieldName, cascader.defaultValue);
          break;
        case 'inputNumber':
          let inputNumber = item.props as InputNumberDecorator;
          setInputNumberValue(inputNumber.fieldName, inputNumber.defaultValue);
          break;
        case 'input':
          let input = item.props as InputDecorator;
          setInputValue(input.fieldName, input.defaultValue);
          break;
        case 'simpleDate':
          setSimpleDateValue(item.props as SimpleDateDecorator);
        default:
      }
    });
    return advanceSearchSelectFields;
  }

  handleReset = () => {
    this.props.form.resetFields();
    let advanceSearchSelectFields = this.getAdvanceSearchFieldValues(true);
    let [searchTypeFiledName, mappingTypeFieldName] = this.getSearchTypeFieldName();
    let searchType = this.props.form.getFieldValue(searchTypeFiledName);
    let mappingType = this.props.form.getFieldValue(mappingTypeFieldName);
    if (mappingType) {
      mappingType = parseInt(mappingType, 0);
    }
    if (searchType) {
      searchType = parseInt(searchType, 0);
    }
    this.props.onReset({
      ...advanceSearchSelectFields,
      [searchTypeFiledName]: searchType,
      [mappingTypeFieldName]: mappingType,
    });
  }

  handleSearch = () => {
    let queryParams = this.getSearchParams();
    this.props.onSearch(queryParams);
  }

  getSearchTypeFieldName = () => {
    let fieldName = 'searchType';
    if (this.props.searchTypes) {
      fieldName = this.props.searchTypes.fieldName || fieldName;
    }
    let mappingTypeFieldName = 'mappingType';
    if (this.props.searchTypes) {
      mappingTypeFieldName = this.props.searchTypes.mappingTypeFieldName || mappingTypeFieldName;
    }
    return [fieldName, mappingTypeFieldName];
  }

  getSearchParams = () => {
    let [searchTypeFiledName, mappingTypeFieldName] = this.getSearchTypeFieldName();
    let searchType = this.props.form.getFieldValue(searchTypeFiledName);
    let mappingType = this.props.form.getFieldValue(mappingTypeFieldName);
    let searchValue = this.props.form.getFieldValue('searchValue');
    if (mappingType) {
      mappingType = parseInt(mappingType, 0);
    }
    if (searchType) {
      searchType = parseInt(searchType, 0);
    }
    let params = {
      [searchTypeFiledName]: searchType,
      [mappingTypeFieldName]: mappingType,
      searchValue,
    };
    let advanceSearchSelectFields = this.getAdvanceSearchFieldValues();
    return {
      ...advanceSearchSelectFields,
      ...params,
    };
  }

  handleFieldChange = (fieldName, value) => {
    let values = this.getSearchParams();
    this.props.onFieldChange({
      ...values,
      [fieldName]: value,
    });
  }

  render() {
    return (
      <Form layout="horizontal" className={this.props.className}>
        {this.renderActions()}
        <div style={{margin: '0'}}>
          {this.renderNormalSearch()}
          {this.renderAdvanceSearch()}
          {this.renderSearchButtons()}
        </div>
      </Form>
    );
  }
}

export default Form.create<TableSearchBarOwnProps>()(TableSearchBar) as React.ComponentClass<TableSearchBarOwnProps>;

function getCurrentWeek() {
  // 起止日期数组  
  let startStop = new Array();
  // 获取当前时间  
  let currentDate = moment();
  // 返回date是一周中的某一天  
  let week = currentDate.day();

  // 一天的毫秒数  
  let millisecond = 1000 * 60 * 60 * 24;
  // 减去的天数  
  let minusDay = week !== 0 ? week - 1 : 6;
  // alert(minusDay);  
  // 本周 周一  
  let monday = moment(
    moment(currentDate.unix() * 1000 - (minusDay * millisecond)).format('YYYY-MM-DD') + ' 00:00:00');
  // 本周 周日  
  let sunday = moment(moment(monday.unix() * 1000 + (6 * millisecond)).format('YYYY-MM-DD') + ' 23:59:59');
  // 添加本周时间  
  startStop.push(monday); // 本周起始时间
  // 添加本周最后一天时间  
  startStop.push(sunday); // 本周终止时间
  // 返回  
  return startStop;
};

function getCurrentMonth() {
  // 起止日期数组
  let startStop = new Array();
  // 获取当前时间  
  let currentDate = moment();
  // 获得当前月份0-11  
  let currentMonth = currentDate.month();
  // 获得当前年份4位年  
  let currentYear = currentDate.year();
  // 求出本月第一天  
  let firstDay = moment().set('year', currentYear).set('month', currentMonth)
  .set('date', 1).set('hour', 0).set('minute', 0).set('second', 0);

  // 当为12月的时候年份需要加1  
  // 月份需要更新为0 也就是下一年的第一个月  
  if (currentMonth === 11) {
      currentYear++;
      currentMonth = 0; // 就为  
  }else {
      // 否则只是月份增加,以便求的下一月的第一天  
      currentMonth++;
  }

  // 一天的毫秒数  
  let millisecond = 1000 * 60 * 60 * 24;
  // 下月的第一天  
  let nextMonthDayOne = moment().set('year', currentYear).set('month', currentMonth).set('date', 1);
  // 求出上月的最后一天
  let lastDay = moment(moment(nextMonthDayOne.unix() * 1000 - millisecond).format('YYYY-MM-DD') + ' 23:59:59');

  // 添加至数组中返回
  startStop.push(firstDay);
  startStop.push(lastDay);
  // 返回
  return startStop;
}

export function getAdvanceSearchDefaultValues(searchs: AdvanceSearchDecorator[] = []) {
  let params = {};

  searchs.forEach((search: any, index) => {
    if (search.props.defaultValue !== null && search.type !== 'date') {
      params[search.props.fieldName] = search.props.defaultValue;
    }
  });

  return params;
}

function getItemPadding(item: BaseSearchDecorator) {
  let paddingLeft = item.paddingLeft !== undefined ? `${item.paddingLeft}px` : '8px';
  let paddingRight = item.paddingRight !== undefined ? `${item.paddingRight}px` : '8px';
  return `0 ${paddingRight} 0 ${paddingLeft}`;
}

function getInitialValue(queryData: any, fieldName: string, defaultValue) {
  let initialValue = defaultValue;
  if (queryData && queryData[fieldName] !== undefined) {
    initialValue = queryData[fieldName];
  }

  return initialValue;
}
