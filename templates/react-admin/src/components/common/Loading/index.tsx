import * as React from 'react';
import { Spin } from 'antd';

export interface LoadingProps {
  style?: React.CSSProperties;
}

/**
 * 加载组件
 */
export default class Loading extends React.Component<LoadingProps, any> {
  static defaultProps = {
    style: {},
    card: false,
  };

  render() {
    let style: React.CSSProperties = {
      position: 'relative',
      textAlign: 'center',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center', ...this.props.style,
    };

    return (
    <div
      style={style}
    >
      <Spin />
    </div>
    );
  }
}
