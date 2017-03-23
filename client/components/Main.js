import React, { PropTypes, Component } from 'react'
import io from 'socket.io-client'
import {browserHistory} from 'react-router';

class Main extends Component {
  constructor(props) {
    super(props);
    this.socket = io();
  }

  getChildContext() {
    return {socket: this.socket};
  }

  render() {
    return (
      <div className=' main-container'>
        <div className="col-xs-12">
          {this.props.children}
        </div>
      </div>
    );
  }
};

Main.childContextTypes = {
  socket: React.PropTypes.object
};
export default Main
