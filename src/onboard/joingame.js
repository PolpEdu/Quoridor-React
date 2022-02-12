import React from 'react'
import { useParams } from 'react-router-dom'
const socket  = require('../connection/socket').socket

const JoinGameRoom = (gameid, userName, isCreator) => {
    /**
     * For this browser instance, we want 
     * to join it to a gameRoom. For now
     * assume that the game room exists 
     * on the backend. 
     *  
     * 
     * TODO: handle the case when the game room doesn't exist. 
     */
    let idData = {
        gameId : gameid,
        userName : userName,
        isCreator: isCreator
    }

    console.log("emiting join game:\n"+ idData.gameId + ", " + idData.userName
    + ", " + idData.isCreator)

    socket.emit("playerJoinGame", idData)
}
  
const JoinGame = (props) => {
    /**
     * Extract the 'gameId' from the URL. 
     * the 'gameId' is the gameRoom ID. 
     */
    const { gameid } = useParams()
    JoinGameRoom(gameid, props.userName, props.isCreator)
    return <div>
        <h1 style = {{textAlign: "center"}}>Welcome to Corridor.io!</h1>
        <h3 style = {{textAlign: "center"}}>Made with React, Socket.io, and Node.js</h3>
        <h3 style = {{textAlign: "center"}}>Rules: <a href='https://en.wikipedia.org/wiki/Quoridor'>Wikipedia</a></h3>

    </div>
}

export default JoinGame
  
