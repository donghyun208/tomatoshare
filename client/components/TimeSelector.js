import React, { PropTypes, Component } from 'react'
import { Button } from 'react-bootstrap';

const TimeSelector = (props) => {
  let disabledText = ""
  if (props.started) {
    disabledText = " disabled"
  }
  return (
    <div className="btn-group" data-toggle="buttons">
      <label className={"btn btn-primary" + (props.selectedOption === '25' ? " active": disabledText)}>
        <input type="radio" name="options" id="25" autoComplete="off" checked={props.selectedOption === '25'} onChange={props.onClick}/> 25 min
      </label>
      <label className={"btn btn-primary" + (props.selectedOption === '5' ? " active": disabledText)}>
        <input type="radio" name="options" id="5" autoComplete="off" checked={props.selectedOption === '5'} onChange={props.onClick}/> 5 min
      </label>
      <label className={"btn btn-primary" + (props.selectedOption === '15' ? " active": disabledText)}>
        <input type="radio" name="options" id="15" autoComplete="off" checked={props.selectedOption === '15'} onChange={props.onClick}/> 15 min
      </label>
    </div>
  );
};

export default TimeSelector
