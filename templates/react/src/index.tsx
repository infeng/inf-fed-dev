import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './style.less';

class App extends React.Component<any, any> {
  render() {
    return (
      <p className="title">Hello World</p>
    );
  }
}

ReactDOM.render(
  <App/>,
  document.getElementById('root'),
);
