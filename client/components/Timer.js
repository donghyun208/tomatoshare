import React, { PropTypes, Component } from 'react'

const Timer = (props) => {

  return (
    <h1>{millisToMinutesAndSeconds(props.time)}</h1>
  );
};

const millisToMinutesAndSeconds = (millis) => {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return (seconds == 60 ? (minutes+1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
}
export default Timer
