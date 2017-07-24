import * as React from 'react';
import { Form, Button, Input, Row, Col } from 'antd';
const FormItem = Form.Item;
import CardEx from '../../common/CardEx';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { EditPasswordState, apiActions } from '../../../models/system/editPassword';
import { FORMITEMLAYOUT, FORMITEMLAYOUT_WIDTHOUTLABEL } from '../../../util/constants';
import { Field } from '../../../util/baseDecorator';
import { injectApi, ApiComponentProps } from '../../../util/inject';

export interface EditPasswordProps extends ApiComponentProps<EditPasswordState> {
  form: WrappedFormUtils;
}

const formFields = {
  oldPassword: new Field('oldPassword', '旧密码'),
  newPassword: new Field('newPassword', '新密码'),
  confirmPassword: new Field('confirmPassword', '确认密码'),
};

class EditPassword extends React.Component<EditPasswordProps, any> {
  handleSubmit = () => {
    const { form, dispatch, token } = this.props;
    form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }
      dispatch(apiActions.editPassword({
        ...token,
        ...values,
      }));
    });
  }

  checkNewPassword = (rule, value, cb) => {
    const { validateFields } = this.props.form;
    if (value) {
      validateFields([formFields.confirmPassword.name], { force: true }, () => {});
    }
    cb();
  }

  checkConfirmPassword = (rule, value, cb) => {
    const { getFieldValue } = this.props.form;
    if (value && value !== getFieldValue(formFields.newPassword.name)) {
      cb('两次输入密码不一致！');
    }else {
      cb();
    }
  }

  render() {
    const { form, data } = this.props;
    const { getFieldDecorator } = form;
    const inputStyle: React.CSSProperties = {
      width: '300px',
    };

    return (
      <CardEx>
        <Row>
          <Col span={14} offset={6}>
            <Form layout="horizontal">
              <FormItem
                label={formFields.oldPassword.text}
                {...FORMITEMLAYOUT}
              >
                {getFieldDecorator(formFields.oldPassword.name, {
                  rules: [{
                    required: true,
                    message: formFields.oldPassword.message(),
                  }],
                })(
                  <Input style={inputStyle} type="password"/>
                )}
              </FormItem>
              <FormItem
                label={formFields.newPassword.text}
                {...FORMITEMLAYOUT}
              >
                {getFieldDecorator(formFields.newPassword.name, {
                  rules: [{
                    required: true,
                    message: formFields.newPassword.message(),
                  }, {
                    validator: this.checkNewPassword,
                  }],
                })(
                  <Input style={inputStyle} type="password"/>
                )}
              </FormItem>
              <FormItem
                label={formFields.confirmPassword.text}
                {...FORMITEMLAYOUT}
              >
                {getFieldDecorator(formFields.confirmPassword.name, {
                  rules: [{
                    required: true,
                    message: formFields.confirmPassword.message(),
                  }, {
                    validator: this.checkConfirmPassword,
                  }],
                })(
                  <Input style={inputStyle} type="password"/>
                )}
              </FormItem>
              <FormItem
                {...FORMITEMLAYOUT_WIDTHOUTLABEL}
              >
                <Button onClick={this.handleSubmit} type="primary" loading={data.loading}>修改</Button>
              </FormItem>
            </Form>
          </Col>
        </Row>
      </CardEx>
    );
  }
}

export default injectApi(Form.create()(EditPassword), {
  data: 'editPassword',
});
