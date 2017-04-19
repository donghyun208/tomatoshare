import React, { PropTypes, Component } from 'react'
import {browserHistory} from 'react-router';

import Timer from './Timer';
import TimeSelector from './TimeSelector';
import TimerMessage from './TimerMessage';
import ConnectInfo from './ConnectInfo';
import StartButton from './StartButton';
import ResetButton from './ResetButton';
import ProgressBar from './ProgressBar';

const millisToMinutesAndSeconds = (millis) => {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return (seconds == 60 ? (minutes+1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
}

class Home extends Component {

  constructor(props) {
    super(props);
    this.alarmEnd = new Audio('alarm.mp3');
    this.alarmStart = new Audio('start.mp3');
    this.state = {
      selectedTime: '25',
      totTime: 1500000,
      time: 1500000,
      started: false,
      paused: false,
      numConnected: 1
    }

    this.roomID = this.props.routeParams.roomID
    this.render = this.render.bind(this)
    this.StartBtnClick = this.StartBtnClick.bind(this)
    this.ResetBtnClick = this.ResetBtnClick.bind(this)
    this.timerChange = this.timerChange.bind(this)
  }

  componentDidMount() {
    this.initSockets()
    this.timerID = setInterval(
      () => {
        if (this.state.started && !this.state.paused) {
          this.setState((prevState) => {
            let newTime = Math.max(prevState.time - 1000, 0)
            if (newTime == 0 && prevState.time > 0) {
              this.alarmEnd.play();
            }
            return {
              time: newTime,
            }
          })
          this.setTitle()
        }
      },
      1000);
    this.syncTimer = setInterval(
      () => {
        this.socket.emit('syncRoom')
      },
      17500);
  }

  setTitle() {
    if (this.state.started) {
      let minSecTime = millisToMinutesAndSeconds(this.state.time)
      if (this.state.time <= 0) {
        document.title = "Times Up!"
      } else if (this.state.paused) {
        document.title = minSecTime + " - paused"
      } else {
        document.title = minSecTime
      }
    }
    else {
      document.title = "Pomodoro Timer"
    }
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
    clearInterval(this.syncTimer);
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
          paused: data.paused,
          numConnected: data.numConnected
        })
        console.log(data)
        this.setTitle()
        browserHistory.push('/' + this.roomID)
      })
    });

    this.socket.on('starting', () => {
      this.alarmStart.play();
      this.startingTime = Date.now()
      this.setState({started: true})
      this.setTitle()
    })

    this.socket.on('pausing', (data) => {
      this.setState({
        paused: data.paused,
        time: data.time
      })
      this.setTitle()
    })

    this.socket.on('updating', (data) => {
      console.log('updating')
      this.setState({
        time: data.time,
        started: data.started,
        paused: data.paused,
        totTime: data.totTime,
        selectedTime: String(data.totTime / (60 * 1000)),
        numConnected: data.numConnected,
      })
      this.setTitle()
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
    let newTime = changeEvent.target.id
    this.setState((prevState) => {
      if ((this.state.started === false || this.state.time === 0) && prevState.selectedTime != newTime) {
        this.socket.emit('changeTime', newTime)
        return {
          selectedTime: newTime
        }
      }
    })
  }

  render() {
    return (
      <div className='container col-md-10 offset-md-1 col-lg-8 offset-lg-2 pt-1'>
        <h2>Pomodoro Timer</h2>
        <hr></hr>
        <p className="lead">Share this URL with friends to work on tomatoes together! Everyone on this page will see the same timer.</p>
        <div className="row">
          <div className="col-12 col-sm-4 push-sm-8 text-center text-sm-right float-bottom">
            <ConnectInfo numConnected={this.state.numConnected}></ConnectInfo>
          </div>
          <div className="col-12 col-sm-8 pull-sm-4 text-center text-sm-left">
            <TimeSelector selectedOption={this.state.selectedTime} onClick={this.timerChange} started={this.state.started} time={this.state.time}></TimeSelector>
          </div>
        </div>
        <div className="jumbotron col-xs-12 text-center">
        <ProgressBar timePercent={this.state.time / this.state.totTime * 100}></ProgressBar>
        { this.state.time <= 0 &&
          <TimerMessage time={this.state.time}></TimerMessage>
        }
        { this.state.time > 0 &&
          <Timer formattedTime={millisToMinutesAndSeconds(this.state.time)}></Timer>
        }
        </div>
        <div className='row'>
          <div className='col-md-2'> </div>
          { this.state.time > 0 &&
            <div className='col-12 col-sm-6 col-md-4'>
              <StartButton started={this.state.started} paused={this.state.paused} onClick={this.StartBtnClick}></StartButton>
              <div className="hidden-sm-up">&nbsp;</div>
            </div>
          }
          { (this.state.time <= 0 || this.state.paused) &&
            <div className='col-12 col-sm-6 col-md-4'>
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
