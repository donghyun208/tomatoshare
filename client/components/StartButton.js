import React, { PropTypes, Component } from 'react'

const StartButton = (props) => {
  let btnType, btnText;
  if (!props.started) {
    btnType = 'btn-success'
    btnText = 'Start Timer'
  }
  else {
    if (props.paused) {
      btnText = 'Resume Timer'
      btnType = 'btn-success'
    }
    else {
      btnText = 'Pause Timer'
      btnType = 'btn-danger'
    }
  }
  return (
    <button type='button' className={'btn btn-lg ' + btnType} onClick={props.onClick}>{btnText}</button>
  );
};

export default StartButton
