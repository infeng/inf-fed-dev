import * as React from 'react';
import { BASE_PREFIX } from '../../../util/constants';
import './style.less';

const prefixCls = `${BASE_PREFIX}-home`;

export interface HomeProps {
}

class Home extends React.Component<HomeProps, any> {
  render() {
    return (
      <div className={prefixCls}>
        <p className={`${prefixCls}-title`}>欢迎来到管理后台！</p>
      </div>
    );
  }
}

export default Home;
