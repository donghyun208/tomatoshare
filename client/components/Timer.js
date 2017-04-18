import React, { PropTypes, Component } from 'react'

const Timer = (props) => {
  return (
    <h1 className="timer">{props.formattedTime}</h1>
  );
};

export default Timer
