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
      btnType = 'btn-warning'
    }
  }
  return (
    <button type='button' className={'btn btn-lg btn-block ' + btnType} onClick={props.onClick}>{btnText}</button>
  );
};

export default StartButton
