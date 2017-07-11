import * as React from 'react';
import { Button } from 'antd';
import { actions } from '../../../models/common/sidebar';
import { injectNormal, NormalComponentProps } from '../../../util/inject';

interface BackOwnProps {
  /** 需要返回的componentName */
  componentName: string;
  /** component需要传入的参数 */
  options?: any;
  /** 点击返回按钮后出发的事件 */
  onClick?: (...args: any[]) => void;
  /** 样式 */
  style?: React.CSSProperties;
  /** 设置 Affix 需要监听其滚动事件的元素的id，默认是window元素 */
  targetDomId?: any;
}

interface BackProps extends BackOwnProps, NormalComponentProps {
}

/**
 * 返回组件
 */
class Back extends React.Component<BackProps, any> {

  constructor(props) {
    super(props);
  }

  handleBack = () => {
    const { options, componentName } = this.props;
    let params: any = {
      componentName: componentName,
    };
    if (options) {
      params.options = options;
    }
    this.props.dispatch(actions.updatePane(params));
    if (this.props.onClick) {
      this.props.onClick();
    }
  }

  render() {
    return (
      <div>
      <div style={{ position: 'fixed', zIndex: 10 }}>
        <Button
          style={this.props.style || {}}
          onClick={this.handleBack}
        >
          返回
        </Button>
      </div>
      <div style={{ top: '38px', height: '38px' }} />
      </div>
    );
  }
}

export default injectNormal(Back, {});
