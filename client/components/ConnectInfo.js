import React, { PropTypes, Component } from 'react'

const ConnectInfo = (props) => {
  return (
    <div className="pull-right">
      Number Connected: {props.numConnected}
    </div>
  );
};

export default ConnectInfo
