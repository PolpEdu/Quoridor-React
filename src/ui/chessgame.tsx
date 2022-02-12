import React from 'react'
import { useParams } from 'react-router-dom'
import QuoridorGame from './Game'
import { ColorContext } from '../context/colorcontext'

const socket = require('../connection/socket').socket

const QUOGameWrapper = (props: any) => {

  // get the gameId from the URL here and pass it to the chessGame component as a prop. 
  const domainName = 'https://quorridor.herokuapp.com/'
  const color = React.useContext(ColorContext)
  const { gameid } = useParams()
  const [opponentSocketId, setOpponentSocketId] = React.useState('')
  const [opponentDidJoinTheGame, didJoinGame] = React.useState(false)
  const [opponentUserName, setUserName] = React.useState('')
  const [gameSessionDoesNotExist, doesntExist] = React.useState(false)

  React.useEffect(() => {

    socket.on("playerJoinedRoom", (statusUpdate: any) => {
      console.log("A new player has joined the room! Username: " + statusUpdate.userName + ", Game id: " + statusUpdate.gameId + " Socket id: " + statusUpdate.mySocketId)

      if (socket.id !== statusUpdate.mySocketId) {
        setOpponentSocketId(statusUpdate.mySocketId)
      }
    })

    socket.on("status", (statusUpdate: any) => {
      console.log(statusUpdate)
      if (statusUpdate === 'This game session does not exist.' || statusUpdate === 'There are already 4 people playing in this room.') {
        doesntExist(true)
      }
    })


    socket.on('start game', (opponentUserName: any) => {
      console.log("START!")
      console.log("op user name: " + opponentUserName)
      if (opponentUserName !== props.myUserName) {
        setUserName(opponentUserName)
        didJoinGame(true)
      } else {
        // in chessGame, pass opponentUserName as a prop and label it as the enemy. 
        // in chessGame, use reactContext to get your own userName
        // socket.emit('myUserName')

        console.log("requesting userName")
        socket.emit('request username', gameid)
      }
    })


    socket.on('give userName', (socketId: any) => {
      if (socket.id !== socketId) {
        console.log("give userName stage: " + props.myUserName)
        socket.emit('recieved userName', { userName: props.myUserName, gameId: gameid })
      }
    })


    socket.on('get Opponent UserName', (data: any) => {
      console.log("gettting name")
      if (socket.id !== data.socketId) {
        setUserName(data.userName)
        setOpponentSocketId(data.socketId)
        didJoinGame(true)
      }
    })


  }, [])

  //console.log("op did join game: " + opponentDidJoinTheGame)

  return (
    <React.Fragment>
      {opponentDidJoinTheGame ? (
        <div>
          <h2> Opponent: {opponentUserName} </h2>
          <QuoridorGame
            gameId={gameid == null ? "" : gameid}
            color={color.didRedirect}

          />
          <h2> You: {props.myUserName} </h2>
        </div>
      ) : gameSessionDoesNotExist ? (
        <div>
          <h1 style={{ textAlign: "center", marginTop: "200px" }}>Game does not exist :( </h1>
        </div>
      ) : (
        <div>
          <h1
            style={{
              textAlign: "center",
              marginTop: String(window.innerHeight / 8) + "px",
            }}
          >
            Hey <strong>{props.myUserName}</strong>, copy and paste the URL
            below to send to your friend:
          </h1>
          <textarea
            style={{ marginLeft: String((window.innerWidth / 2) - 290) + "px", marginTop: "30" + "px", width: "580px", height: "30px" }}
            onFocus={(event) => {
              event.target.select()
            }}
            value={domainName + "/game/" + gameid}
            readOnly={true}
          >
          </textarea>
          <br></br>

          <h1 style={{ textAlign: "center", marginTop: "100px" }}>
            {" "}
            Waiting for other opponent to join the game...{" "}
          </h1>
        </div>
      )}
    </React.Fragment>
  );
};

export default QUOGameWrapper
