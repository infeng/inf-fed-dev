import * as React from 'react';
import { Form, Input, Button, Card, Icon } from 'antd';
import { connect } from 'react-redux';
import { apiActions, LoginState } from '../../../models/common/login';
import './style.less';
const FormItem = Form.Item;
import { BASE_PREFIX } from '../../../util/constants';
import { WrappedFormUtils } from 'antd/lib/form/Form';

const prefixCls = `${BASE_PREFIX}-login`;

export interface LoginProps {
  dispatch: any;
  form: WrappedFormUtils;
  data: LoginState;
}

class Login extends React.Component<LoginProps, any> {
  handleSubmit(e) {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }
      dispatch(apiActions.login(values));
    });
  }

  render() {
    const { data, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className={`${prefixCls}-container`} >
        <h1 className={`${prefixCls}-title`}>管理后台</h1>
        <Card className={`${prefixCls}-card`}>
          <Form
          layout="horizontal"
          onSubmit={this.handleSubmit.bind(this)}
          >
            <FormItem>
                {getFieldDecorator('username', {
                  rules: [{
                    required: true,
                    message: '账户名不能为空',
                  }],
                })(
                  <Input
                    addonBefore={<Icon type="user" />}
                    placeholder="请输入账户名"
                  />
                )}
            </FormItem>
            <FormItem>
                {getFieldDecorator('password', {
                  rules: [{
                    required: true,
                    message: '密码不能为空',
                  }],
                })(
                  <Input
                    addonBefore={<Icon type="lock" />}
                    type="password"
                    placeholder="请输入密码"
                  />
                )}
            </FormItem>
            <FormItem
            >
              <Button
                type="primary"
                htmlType="submit"
                className={`${prefixCls}-btn`}
                loading={data.loading}
              >
                登录
              </Button>
            </FormItem>
          </Form>
        </Card>
      </div>
    );
  }
}

const mapState2Props = state => {
  const { login } = state;
  return {
    data: login,
  };
};

export default connect(mapState2Props)(Form.create()(Login));
