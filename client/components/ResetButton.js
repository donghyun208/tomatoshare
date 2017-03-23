import React, { PropTypes, Component } from 'react'

const ResetButton = (props) => {
  return <button type='button' className={'btn btn-lg btn-block btn-danger'} onClick={props.onClick}>Reset Timer</button>
};

export default ResetButton
