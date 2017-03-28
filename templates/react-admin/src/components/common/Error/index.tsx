import * as React from 'react';
import './style.less';

export interface ErrorProps {
  message?: string;
}

/**
 * 加载失败组件（常用于请求失败后的显示）
 */
export default class Error extends React.Component<ErrorProps, any> {
  render() {
    return (
      <div>
        <p className={'text-error'}>{this.props.message || '加载失败'}</p>
      </div>
    );
  }
}
