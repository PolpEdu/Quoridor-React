import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import JoinRoom from './onboard/joinroom'
import { ColorContext } from './context/colorcontext'
import Onboard from './onboard/onboard'
import JoinGame from './onboard/joingame'
import BoardGame from './ui/chessgame'

import './style/font.css';

function App() {
  const [didRedirect, setDidRedirect] = React.useState(false)

  const playerDidRedirect = React.useCallback(() => {
    setDidRedirect(true)
  }, [])

  const playerDidNotRedirect = React.useCallback(() => {
    setDidRedirect(false)
  }, [])

  const [userName, setUserName] = React.useState('')

  return (
    <ColorContext.Provider value = {{didRedirect: didRedirect, playerDidRedirect: playerDidRedirect, playerDidNotRedirect: playerDidNotRedirect}}>
      <Router>
        <Routes>
          <Route path = "/" element={<Onboard setUserName = {setUserName}/>}>
          </Route>
          <Route path = "/game/:gameid" element={didRedirect ? 
              <React.Fragment>
                    <JoinGame userName = {userName} isCreator = {true}/> {/* <JoinGame /> is the top side (wikipedia link) */}
                    <BoardGame myUserName = {userName}/> {/* <BoardGame /> can be the actual game or the link to join */}
              </React.Fragment>  
              :
              <JoinRoom/>}> {/* <JoinRoom /> asks for the Player's 2 username route*/}
          </Route>
        </Routes>
      </Router>
    </ColorContext.Provider>
    
  );
}

export default App;
