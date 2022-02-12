import io from 'socket.io-client'

const URL = 'https://quorridor-back-end.herokuapp.com/'

const socket = io(URL, { transports: ["websocket"],forceNew: true })

var mySocketId
// register preliminary event listeners here:

socket.on("connection", status => {
    console.log("connected to server")
})

socket.on('connect_error', (err) => {
    console.log(`connect_error due to ${err.message}`);
});

socket.on("createNewGame", statusUpdate => {
    console.log("A new game has been created! Username: " + statusUpdate.userName + ", Game id: " + statusUpdate.gameId + " Socket id: " + statusUpdate.mySocketId)
    mySocketId = statusUpdate.mySocketId
})

export {
    socket,
    mySocketId
}