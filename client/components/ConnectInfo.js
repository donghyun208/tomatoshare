import React, { PropTypes, Component } from 'react'

const ConnectInfo = (props) => {
  let userGlyph;
  if (props.numConnected > 2) {
    userGlyph = <i className="fa fa-users" aria-hidden="true"></i>
  }
  else {
    userGlyph = [];
    for (let i=0; i < props.numConnected; i++) {
      userGlyph.push(<i className="fa fa-user" aria-hidden="true" key={i}></i>)
    }
  }
  return (
    <h3 className="float-bottom panel panel-default">{userGlyph}</h3>
  );
};

export default ConnectInfo
