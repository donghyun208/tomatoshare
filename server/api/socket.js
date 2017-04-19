

const idGen = () => {
  return Math.random().toString(36).substr(2, 6)
}

let clients = [];

module.exports = (socket, io, roomList) => {
  // on connection, first join a random room.
  //
  clients[socket.id] = socket;
  console.log('connected')
  let debug = false

  let currRoom = null;

  socket.on('disconnect', () => {
    if (currRoom !== null) {
      currRoom.numConnected -= 1;
      updateTimer(currRoom)
      io.sockets.in(currRoom.id).emit('updating', currRoom);
    }
    console.log('deleting')
    delete clients[socket.id];
  });

  socket.on('roomID', (roomID, cb) => {
    console.log('trying to join room: ' + roomID)
    let tryJoin = false
    if (roomID !== '') {
      // try to join room
      if (roomID in roomList) {
        socket.join(roomID)
      }
      else {
        roomID = ''
      }
    }
    if (roomID === '') {
      roomID = idGen()
      socket.join(roomID)
      roomList[roomID] = {
        id: roomID,
        totTime: 1500000,
        timeStart: null,
        time: 1500000,
        started: false,
        paused: false,
        numConnected: 0
      }
    }
    currRoom = roomList[roomID];
    currRoom.numConnected += 1;

    if (currRoom.started) {
      // modifiedRoom = {
      //   id: currRoom.id,
      //   timeStart: currRoom.timeStart,
      //   totTime: currRoom.totTime,
      //   time: currRoom.time,
      //   started: currRoom.started,
      //   paused: currRoom.paused,
      //   numConnected: currRoom.numConnected
      // }
      // updateTimer(modifiedRoom)
      // cb(modifiedRoom)
      updateTimer(currRoom)
      cb(currRoom)
    }
    else {
      cb(currRoom)
    }
    if (debug) {
      console.log(currRoom)
      // console.log(roomList)
      console.log(roomID in roomList)
    }
    socket.broadcast.to(currRoom.id).emit('updating', currRoom);
  })

  socket.on('start', () => {
    console.log(currRoom.id + ' is starting')
    io.sockets.in(currRoom.id).emit('starting');
    currRoom.started = true;
    currRoom.timeStart = Date.now();
  })

  socket.on('pause', () => {
    updateTimer(currRoom)
    currRoom.paused = !currRoom.paused
    io.sockets.in(currRoom.id).emit('pausing', currRoom);

    if (!currRoom.paused ) {
      console.log(currRoom + 'paused')
    }
    else {
      console.log(currRoom + 'resumed')
    }

  })

  socket.on('reset', () => {
    console.log('reseting room')
    resetRoom(currRoom)
    io.sockets.in(currRoom.id).emit('updating', currRoom);
  })

  socket.on('changeTime', (newTime) => {
    let newTimeMS = parseFloat(newTime) * 60 * 1000;
    currRoom.totTime = newTimeMS
    resetRoom(currRoom)
    io.sockets.in(currRoom.id).emit('updating', currRoom);
  })

  socket.on('syncRoom', () => {
    updateTimer(currRoom)
    socket.emit('updating', currRoom);
  })

};

resetRoom = (room) => {
  room.timeStart = null
  room.time = room.totTime
  room.started = false
  room.paused = false
}

updateTimer = (room) => {
  // this fcn can create race conditions if multiple clients reconnect or pause/resume at the same time
    if (!room.paused ) {
      if (room.timeStart !== null) {
        let elapsedTime = Date.now() - room.timeStart
        room.timeStart = Date.now()
        console.log('elapsed' + elapsedTime)
        room.time -= elapsedTime
      }
    }
    else {
      room.timeStart = Date.now()
    }
}


