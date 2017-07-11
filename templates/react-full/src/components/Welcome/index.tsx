import * as React from 'react';
import './style.less';

export interface WelcomeProps {
  name: string;
  onChangeName: (name: string) => void;
}

class Welcome extends React.Component<WelcomeProps, any> {
  handleChange = (e) => {
    this.props.onChangeName(e.target.value);
  }

  render() {
    return (
      <div>
        <p>Hello <span className="name">{this.props.name}</span>!</p>
        <input
          onChange={this.handleChange}
          value={this.props.name}
        />
      </div>
    );
  }
}

export default Welcome;
