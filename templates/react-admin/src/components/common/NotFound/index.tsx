import * as React from 'react';
import { BASE_PREFIX } from '../../../util/constants';
import './style.less';
import { browserHistory } from 'react-router';

const prefixCls = `${BASE_PREFIX}-not-found`;

export interface NotFoundProps {
}

class NotFound extends React.Component<NotFoundProps, any> {
  handleBack = (e) => {
    browserHistory.push({
      pathname: '/',
    });
  }

  render() {
    return (
      <div className={prefixCls}>
        <h1 className={`${prefixCls}-title`}>404</h1>
        <p>未找到该页面</p>
        <button className={`${prefixCls}-btn`} onClick={this.handleBack}>返回首页</button>
      </div>
    );
  }
}

export default NotFound;
