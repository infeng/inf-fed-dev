import * as React from 'react';
import { Form, Button, Input, Row, Col } from 'antd';
const FormItem = Form.Item;
import CardEx from '../../common/CardEx';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { EditUserState, apiActions, actions } from '../../../models/system/editUser';
import { FORMITEMLAYOUT, FORMITEMLAYOUT_WIDTHOUTLABEL } from '../../../util/constants';
import { Field } from '../../../util/baseDecorator';
import { injectApi, ApiComponentProps } from '../../../util/inject';

export interface EditUserOwnProps {
  options: {
    userId: number;
    userName: string;
    name: string;
  };
}

export interface EditUserProps extends EditUserOwnProps, ApiComponentProps<EditUserState> {
  form: WrappedFormUtils;
}

const formFields = {
  userName: new Field('userName', '账户名称'),
  name: new Field('name', '姓名'),
};

class EditUser extends React.Component<EditUserProps, any> {
  static defaultProps = {
    options: {
      userId: null,
      userName: undefined,
      name: undefined,
    },
    form: null,
  };

  componentWillMount() {
    const { dispatch, options } = this.props;
    dispatch(actions.setEditUser({
      userName: options.userName,
      name: options.name,
    }));
  }

  handleSubmit = () => {
    const { form, dispatch, token, options } = this.props;
    form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }
      let payload: any = {
        ...token,
        maUsername: values.maUsername,
      };
      if (options.userId) {
        payload = {
          ...payload,
          userId: options.userId,
        };
        dispatch(apiActions.editUser(payload));
      }else {
        payload = {
          ...payload,
          name: values.name,
          userName: values.userName,
        };
        dispatch(apiActions.addUser(payload));
      }
    });
  }

  render() {
    const { form, data, options } = this.props;
    const { getFieldDecorator } = form;
    const inputStyle: React.CSSProperties = {
      width: '300px',
    };

    let isEdit = options.userId !== null;

    return (
      <CardEx>
        <Row>
          <Col span={14} offset={6}>
            <Form layout="horizontal">
              <FormItem
                label={formFields.userName.text}
                {...FORMITEMLAYOUT}
              >
                {getFieldDecorator(formFields.userName.name, {
                  rules: [{
                    required: true,
                    message: formFields.userName.message(),
                  }],
                })(
                  <Input style={inputStyle} />
                )}
              </FormItem>
              <FormItem
                label={formFields.name.text}
                {...FORMITEMLAYOUT}
              >
                {getFieldDecorator(formFields.name.name, {
                  rules: [{
                    required: true,
                    message: formFields.name.message(),
                  }],
                })(
                  <Input style={inputStyle} />
                )}
              </FormItem>
              <FormItem
                {...FORMITEMLAYOUT_WIDTHOUTLABEL}
              >
                <Button
                  onClick={this.handleSubmit}
                  type="primary"
                  loading={data.loading}>
                  {isEdit ? '修改' : '创建'}
                </Button>
              </FormItem>
            </Form>
          </Col>
        </Row>
      </CardEx>
    );
  }
}

const mapPropsToFields = (props: EditUserProps) => {
  let data = props.data;
  return {
    [formFields.userName.name]: {value: data.userName},
    [formFields.name.name]: {value: data.name},
  };
};

const onValuesChange = (props: EditUserProps, values) => {
  const { dispatch } = props;
  dispatch(actions.setValues(values));
};

export default injectApi<EditUserOwnProps>(
  Form.create({mapPropsToFields, onValuesChange})(EditUser),
  {
    data: 'editUser',
  }
);
