import React from 'react';
import { connect } from 'react-redux';
import { TokenState } from '../models/common/token';
export interface NormalComponentProps {
  dispatch: any;
}
export function injectNormal<OwnProps = any>(MyComponent, propState: PropStates) {
  const mapState2Props = state => {
    let props = { };
    Object.keys(propState).forEach(propsName => {
      props = {
        ...props,
        ...{
          [propsName]: state[propState[propsName]],
        },
      };
    });
    return props;
  };

  return connect(mapState2Props)(MyComponent) as React.ComponentClass<OwnProps>;
}

export interface ApiComponentProps<T = any> extends NormalComponentProps {
  token: TokenState;
  data: T;
}
interface PropStates {
  [key: string]: string;
}
export function injectApi<OwnProps = any>(MyComponent, propState: PropStates) {
  return injectNormal<any>(MyComponent, {
    ...propState,
    token: 'token',
  }) as React.ComponentClass<OwnProps>;
}
