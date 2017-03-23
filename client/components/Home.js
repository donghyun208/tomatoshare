import React, { PropTypes, Component } from 'react'
import {browserHistory} from 'react-router';

import Timer from './Timer';
import TimerMessage from './TimerMessage';
import StartButton from './StartButton';
import ResetButton from './ResetButton';
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
    this.state = {
      time: 1500000,
      started: false,
      paused: false
    }

    this.roomID = this.props.routeParams.roomID
    this.render = this.render.bind(this)
    this.StartBtnClick = this.StartBtnClick.bind(this)
    this.ResetBtnClick = this.ResetBtnClick.bind(this)
    console.log('home')
  }

  componentDidMount() {
    this.initSockets()
    this.timerID = setInterval(
      () => {
        if (this.state.started && !this.state.paused) {
          this.setState((prevState) => {
            let newTime = Math.max(prevState.time - 1000, 0)
            return {time: newTime}
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
          console.log("Connected!");
          this.roomID = data.id
          this.setState({
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
        paused: data.paused
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

  render() {
    return (
      <div className='home-container col-xs-12 col-md-8 col-md-offset-1'>
        <h1>Shared Pomodoro Timer</h1>
        <hr></hr>
        <div className="jumbotron col-xs-12 text-center">
        { this.state.time <= 0 &&
          <TimerMessage time={this.state.time}></TimerMessage>
        }
        { this.state.time > 0 &&
          <Timer time={this.state.time}></Timer>
        }
        </div>
        <div className='row'>
          <div className='col-xs-3 col-md-4'> </div>
          { this.state.time > 0 &&
            <div className='col-xs-3 col-md-2'>
              <StartButton started={this.state.started} paused={this.state.paused} onClick={this.StartBtnClick}></StartButton>
            </div>
          }
          { (this.state.time <= 0 || this.state.paused) &&
            <div className='col-xs-3 col-md-2'>
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
