

const idGen = () => {
  return Math.random().toString(36).substr(2, 9)
}

let clients = [];

module.exports = (socket, io, roomList) => {
  // on connection, first join a random room.
  //
  clients[socket.id] = socket;
  console.log('connected')
  let debug = true

  let currRoom = null;

  socket.on('disconnect', () => {
    console.log('deleting')
    delete clients[socket.id];
  });

  socket.on('roomID', (roomID, cb) => {
    console.log('trying to join room: ' + roomID)
    let tryJoin = false
    if (roomID !== '') {
      console.log(roomID in roomList)
      // try to join room
      if (roomID in roomList) {
        console.log('exists!')
        socket.join(roomID)
      }
      else {
        console.log('does not exist')
        roomID = ''
      }
    }
    if (roomID === '') {
      roomID = idGen()
      socket.join(roomID)
      roomList[roomID] = {
        id: roomID,
        timeStart: null,
        time: 1500000,
        started: false,
        paused: false
      }
    }
    currRoom = roomList[roomID];

    if (currRoom.started) {
      modifiedRoom = {
        id: currRoom.id,
        timeStart: currRoom.timeStart,
        time: currRoom.time,
        started: currRoom.started,
        paused: currRoom.paused
      }
      updateTimer(modifiedRoom)
      cb(modifiedRoom)
    }
    else {
      cb(currRoom)
    }
    if (debug) {
      console.log(currRoom)
      // console.log(roomList)
      console.log(roomID in roomList)
    }
  })

  socket.on('start', () => {
    console.log(currRoom.id + ' is starting')
    io.sockets.in(currRoom.id).emit('starting');
    currRoom.started = true;
    currRoom.timeStart = Date.now();
    console.log(currRoom)
  })

  socket.on('pause', () => {
    if (!currRoom.paused ) {
      updateTimer(currRoom)
      currRoom.paused = !currRoom.paused
      io.sockets.in(currRoom.id).emit('pausing', currRoom);
      console.log(currRoom + 'paused')
    }
    else {
      currRoom.paused = !currRoom.paused
      currRoom.timeStart = Date.now()
      io.sockets.in(currRoom.id).emit('pausing', currRoom);
      console.log(currRoom + 'resumed')
    }

  })

};


updateTimer = (room) => {

  console.log('updating TIMER!!!!!')
  // this fcn can create race conditions if multiple clients reconnect or pause/resume at the same time
  if (room.timeStart !== null) {
    let elapsedTime = Date.now() - room.timeStart
    room.timeStart = Date.now()
    console.log('elapsed' + elapsedTime)
    room.time -= elapsedTime
  }
}


