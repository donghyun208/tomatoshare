import React, { PropTypes, Component } from 'react'
import {browserHistory} from 'react-router';

import Timer from './Timer';
import StartButton from './StartButton';
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
    this.btnClick = this.btnClick.bind(this)
    console.log('home')
  }

  componentDidMount() {
    this.initSockets()
    this.timerID = setInterval(
      () => {
        if (this.state.started && !this.state.paused) {
          this.setState((prevState) => {
            time: prevState.time -= 1000
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
  }

  tick() {
    let elapsedTime = Date.now() - this.state.started
  }

  btnClick() {
    if (this.state.started === false) {
      this.socket.emit('start')
    }
    else {
      this.socket.emit('pause')
    }
  }

  render() {
    return (
      <div className='home-container'>
        <div className="jumbotron col-xs-12 text-center">
          <Timer time={this.state.time}></Timer>
        </div>
        {this.props.children}
        <div className='col-sm-12'>
          <StartButton started={this.state.started} paused={this.state.paused} onClick={this.btnClick}></StartButton>
        </div>
      </div>
    );
  }
};

Home.contextTypes = {
  socket: React.PropTypes.object
};

//   return props.isLoading === true
//     ? <p>LOADING</p>
//         <div className='col-sm-8 col-sm-offset-2'>
//           <UserDetailsWrapper header='Player 1'>
//             <UserDetails info={props.playersInfo[0]} />
//           </UserDetailsWrapper>
//           <UserDetailsWrapper header='Player 2'>
//             <UserDetails info={props.playersInfo[1]} />
//           </UserDetailsWrapper>
//         </div>
//         <div className='col-sm-8 col-sm-offset-2'>
//           <div className='col-sm-12' style={styles.space}>
//             <button type='button' className='btn btn-lg btn-success' onClick={props.onInitiateBattle}>Initiate Battle!</button>
//           </div>
//           <div className='col-sm-12' style={styles.space}>
//             <Link to='/playerOne'>
//             </Link>
//           </div>
//         </div>
//       </div>

export default Home
