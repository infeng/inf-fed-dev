import * as React from 'react';
import Welcome from '../components/Welcome';
import { connect } from 'react-redux';
import { AppState, actions, apiActions } from '../models/app';

export interface AppProps {
  dispatch: any;
  app: AppState;
}

class App extends React.Component<AppProps, any> {
  componentDidMount() {
    this.props.dispatch(apiActions.getName({}));
  }

  handleChangeName(name) {
    this.props.dispatch(actions.changeName({
      name: name,
    }));
  }

  render() {
    return (
      <div>
        <Welcome
        name={this.props.app.name}
        onChangeName={this.handleChangeName.bind(this)}
        />
      </div>
    );
  }
}

const mapState2Props = state => {
  return {
    app: state.app,
  };
};

export default connect(mapState2Props)<any, any, any>(App);
