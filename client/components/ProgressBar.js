import React, { PropTypes, Component } from 'react'

const ProgressBar = (props) => {
  let style = {
    width: props.timePercent + '%'
    // display: 'block',
    // float: 'right'
  }
  return (
    <div className="progress">
      <div className="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style={style}>
       <span className="sr-only">60% Complete</span>
      </div>
    </div>
  );
};

export default ProgressBar
