import React, { PropTypes, Component } from 'react'
import {browserHistory} from 'react-router';

import Timer from './Timer';
import TimeSelector from './TimeSelector';
import TimerMessage from './TimerMessage';
import StartButton from './StartButton';
import ResetButton from './ResetButton';
import ProgressBar from './ProgressBar';
// function SnowFlake(props) {
//   return (
//     <button type='button' className='btn btn-lg btn-success'></button>
//   )
// }
// console.log(SnowFlake)

// function What(props) {
//   return (
//     <button></button>
//   )
// }

class Home extends Component {

  constructor(props) {
    super(props);
    this.alarm = new Audio('alarm.mp3');
    this.state = {
      selectedTime: '25',
      totTime: 1500000,
      time: 1500000,
      started: false,
      paused: false
    }

    this.roomID = this.props.routeParams.roomID
    this.render = this.render.bind(this)
    this.StartBtnClick = this.StartBtnClick.bind(this)
    this.ResetBtnClick = this.ResetBtnClick.bind(this)
    this.timerChange = this.timerChange.bind(this)
    console.log('home')
  }

  componentDidMount() {
    this.initSockets()
    this.timerID = setInterval(
      () => {
        if (this.state.started && !this.state.paused) {
          this.setState((prevState) => {
            let newTime = Math.max(prevState.time - 1000, 0)
            if (newTime == 0 && prevState.time > 0) {
              this.alarm.play();
            }
            return {
              time: newTime,
            }
          })
        }
      },
      1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  initSockets() {
    this.socket = this.context.socket
    console.log("try to connect socket");
    this.socket.on("connect", () => {
        this.socket.emit('roomID', this.roomID, (data) => {
          console.log("Connected!", data);
          this.roomID = data.id
          this.setState({
            selectedTime: String(data.totTime / (60 * 1000)),
            totTime: data.totTime,
            time: data.time,
            started: data.started,
            paused: data.paused
          })
          console.log(data)
          browserHistory.push('/' + this.roomID)
        })
    });

    this.socket.on('starting', () => {
      console.log("starting!");
      this.startingTime = Date.now()
      this.setState({started: true})
    })

    this.socket.on('pausing', (data) => {
      this.setState({
        paused: data.paused,
        time: data.time
      })
      console.log('paused timer')
    })

    this.socket.on('updating', (data) => {
      console.log('updating room')
      this.setState({
        time: data.time,
        started: data.started,
        paused: data.paused,
        totTime: data.totTime,
        selectedTime: String(data.totTime / (60 * 1000)),
      })
    })
  }

  tick() {
    let elapsedTime = Date.now() - this.state.started
  }

  StartBtnClick() {
    if (this.state.started === false) {
      this.socket.emit('start')
    }
    else {
      this.socket.emit('pause')
    }
  }

  ResetBtnClick() {
    this.socket.emit('reset')
  }

  timerChange(changeEvent) {
    this.setState({
      selectedTime: changeEvent.target.id
    });
    this.socket.emit('changeTime', changeEvent.target.id)
    console.log(this.state.selectedTime)
    // console.log(changeEvent.target.id)
    // this.socket.emit('reset')
  }

  render() {
    return (
      <div className='home-container col-xs-12 col-md-8 col-md-offset-1'>
        <h1>Pomodoro Timer</h1>
        <hr></hr>
        <p className="lead">Share this URL with friends to work on tomatos together! Everyone on this page will see the same timer.</p>
        <TimeSelector selectedOption={this.state.selectedTime} onClick={this.timerChange} ></TimeSelector>
        <div className="jumbotron col-xs-12 text-center">
        <ProgressBar timePercent={this.state.time / this.state.totTime * 100}></ProgressBar>
        { this.state.time <= 0 &&
          <TimerMessage time={this.state.time}></TimerMessage>
        }
        { this.state.time > 0 &&
          <Timer time={this.state.time}></Timer>
        }
        </div>
        <div className='row'>
          <div className='col-xs-2 col-md-3'> </div>
          { this.state.time > 0 &&
            <div className='col-xs-4 col-md-3'>
              <StartButton started={this.state.started} paused={this.state.paused} onClick={this.StartBtnClick}></StartButton>
            </div>
          }
          { (this.state.time <= 0 || this.state.paused) &&
            <div className='col-xs-4 col-md-3'>
              <ResetButton started={this.state.started} paused={this.state.paused} onClick={this.ResetBtnClick}></ResetButton>
            </div>
          }
        </div>
      </div>
    );
  }
};



Home.contextTypes = {
  socket: React.PropTypes.object
};

export default Home
