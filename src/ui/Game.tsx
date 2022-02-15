
import React from 'react'
import HistoryBar from "./HistoryBar";
import ThemeController from "./ThemeController";
import WallLeftIndicator from "../Player/WallLeftIndicator";
import { Pane } from "evergreen-ui";
import { GlobalStyle } from "./global-styles";
import styled, { ThemeProvider } from "styled-components";
import Board from "../Board";
import Winner from "./Winner";

import { v4 as uuid } from "uuid";

import {
  AppConfig,
  History,
  Step,
  isEven,
  lightTheme,
  darkTheme,
  ThemeType,
  canMove,
  canPut,
} from "../Utils";

const socket = require('../connection/socket').socket;

const Layout = styled(Pane)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
`;

const Section = styled(Pane)`
  flex: 1;
  width: 100%;
  flex-shrink: 0;
  padding: 24px;
`;

export const appConfig: AppConfig = {
  gameId: uuid(),
  boardHeight: 17,
  boardWidth: 17,
  wallLonger: 60,
  breadth: 12,
  numberOfWalls: 10,
  lengthOfWalls: 2,
  boardColor: lightTheme,
  player0Destination: new Array(17).fill(1).map((_, idx) => {
    return { x: idx, y: 16 };
  }),
  player1Destination: new Array(17).fill(1).map((_, idx) => {
    return { x: idx, y: 0 };
  }),
};

export const initialStep = {
  player0: {
    x: (appConfig.boardWidth - 1) / 2,
    y: 0,
    remainingWalls: appConfig.numberOfWalls,
  },
  player1: {
    x: (appConfig.boardWidth - 1) / 2,
    y: appConfig.boardHeight - 1,
    remainingWalls: appConfig.numberOfWalls,
  },
  walls: [],
  stepNumber: 0,
};

interface move {
  nextmove: Step;
  MoveDYellow: boolean;
  gameId: string;
};

type State = {
  isWin: boolean;
  isCheck: boolean;
  step: Step;
  history: History;
  isHover: boolean[][];
  theme: ThemeType;
}

type Props = {
  gameId: string;
  color: boolean;
};

type DataSent = {
  nextmove: Step;
  wallmove: boolean;
  playerColorThatJustMovedIsYellow: boolean;
  gameId: string;
};


class QuoridorGame extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      isWin: false,
      isCheck: false,
      step: initialStep,
      history: [initialStep],
      isHover: Array(appConfig.boardHeight).fill(false).map((_: boolean) => {
        return new Array(appConfig.boardWidth).fill(false)
      }),
      theme: ThemeType.light,
    };
    this.restart = this.restart.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  restart() {
    this.setState({
      step: initialStep,
      history: [initialStep],
      isWin: false,
    });
  }

  cancel() {
    this.setState({
      isWin: false,
    });
  }


  componentDidMount() {
    socket.on('opponent move', (datasent: DataSent) => {
      console.log("recieved move!")

      let move = datasent.nextmove;
      let isWallMove = datasent.wallmove;

      console.log("opponenet's move: " + move.stepNumber)

      console.log("should be yerllow? " + this.props.color)

      if (datasent.nextmove.stepNumber !== this.state.step.stepNumber) {
        console.log("recieved move is not the same as the current step")

        if (this.props.color) {
          console.log("player is yellow")
          this.playerMove(move.player0, isWallMove, false);
        } else {
          console.log("player is red")
          this.playerMove(move.player1, isWallMove, false);
        }

      }

      console.log("step number: " + this.state.step.stepNumber)
    })
  };

  playerMove = (position: { x: number, y: number }, isWall: boolean, isMyMove: boolean): void => {
    const { stepNumber, player0, player1 } = this.state.step;
    const [...walls] = this.state.step.walls;


    const nextStep = {
      walls: walls,
      player1: {
        x: this.state.step.player1.x,
        y: this.state.step.player1.y,
        remainingWalls: this.state.step.player1.remainingWalls,
      },
      player0: {
        x: this.state.step.player0.x,
        y: this.state.step.player0.y,
        remainingWalls: this.state.step.player0.remainingWalls,
      },
      stepNumber: this.state.step.stepNumber + 1,
    };

    let Walked = false;
    if (isWall) {
      console.log("wall turn")
      this.putWall(position, stepNumber, player1, player0, walls, nextStep);
    } else {
      console.log("move turn")
      this.moveTurn(position, stepNumber, player1, player0, walls, nextStep);
      Walked = true;
    }

    console.log(nextStep)

    if (nextStep === null || nextStep === undefined) {
      return;
    }

    if (isMyMove) {
      console.log("Emited!")
      socket.emit('new move', {
        nextmove: nextStep,
        wallmove: isWall,
        gameId: this.props.gameId
      });
    }

    const newHistory = [
      ...this.state.history.filter((step) => step.stepNumber < nextStep.stepNumber),
      nextStep
    ];

    this.setState({
      step: nextStep,
      history: newHistory,
    });


    if (Walked) {
      //check victory
      if (appConfig.player0Destination.find((dest) => dest.x === nextStep.player0.x && dest.y === nextStep.player0.y)) {
        alert("Player 0 Wins!");
        this.setState({ isWin: true });
      }
      else if (appConfig.player1Destination.find((dest) => dest.x === nextStep.player1.x && dest.y === nextStep.player1.y)) {
        alert("Player 1 Wins!");
        this.setState({ isWin: true });
      }
    }

  };

  moveTurn = (position: { x: number; y: number }, stepNumber: number, player1: any, player0: any, walls: any, nextStep: Step): any => {
    // move == [pieceId, finalPosition]

    if (stepNumber % 2 === 0) {
      if (!canMove({ desiredPosition: position, opponent: player1, me: player0, walls })) return null;

      nextStep.player0.x = position.x;
      nextStep.player0.y = position.y;

    } else {
      if (!canMove({ desiredPosition: position, opponent: player0, me: player1, walls, })) return null;

      nextStep.player1.x = position.x;
      nextStep.player1.y = position.y;
    };

    return nextStep;
  };

  putWall = (position: { x: number; y: number }, stepNumber: number, player1: any, player0: any, walls: any, nextStep: Step): any => {
    const { x, y } = position;
    const desiredPosition = [];

    if (!isEven(x) && isEven(y)) {
      //wallHorizontal
      if (y === appConfig.boardHeight - 1) {
        desiredPosition.push({ x, y }, { x, y: y - 1 }, { x, y: y - 2 });
      } else {
        desiredPosition.push({ x, y }, { x, y: y + 1 }, { x, y: y + 2 });
      }
    } else if (isEven(x) && !isEven(y)) {
      //wallVertical
      if (x === appConfig.boardWidth - 1) {
        desiredPosition.push({ x, y }, { x: x - 1, y }, { x: x - 2, y });
      } else {
        desiredPosition.push({ x, y }, { x: x + 1, y }, { x: x + 2, y });
      }
    }

    if (!canPut({ desiredPosition, walls, player0Position: { x: player0.x, y: player0.y }, player1Position: { x: player1.x, y: player1.y }, }))
      return;

    if (isEven(stepNumber)) {
      if (this.state.step.player0.remainingWalls === 0) return;
      nextStep.player0.remainingWalls -= 1;
    } else {
      if (this.state.step.player1.remainingWalls === 0) return;
      nextStep.player1.remainingWalls -= 1;
    }
    nextStep.walls = [...walls, ...desiredPosition];
  };

  hoverOver = (position: { x: number; y: number }) => {
    const temp = new Array(appConfig.boardHeight).fill(false).map((_) => {
      return new Array(appConfig.boardWidth).fill(false);
    });

    const { x, y } = position;
    if (isEven(x) && isEven(y)) {
      //Cell
      temp[x][y] = true;
    } else if (!isEven(x) && isEven(y)) {
      //wallHorizontal
      if (y === appConfig.boardHeight - 1) {
        temp[x][y] = true;
        temp[x][y - 1] = true;
        temp[x][y - 2] = true;
      } else {
        temp[x][y] = true;
        temp[x][y + 1] = true;
        temp[x][y + 2] = true;
      }
    } else if (isEven(x) && !isEven(y)) {
      //wallVertical
      if (x === appConfig.boardWidth - 1) {
        temp[x][y] = true;
        temp[x - 1][y] = true;
        temp[x - 2][y] = true;
      } else {
        temp[x][y] = true;
        temp[x + 1][y] = true;
        temp[x + 2][y] = true;
      }
    }
    // else: wallIntersect do nothing
    this.setState({
      isHover: temp
    });
  };

  leave = () => {
    const temp = new Array(appConfig.boardHeight).fill(false).map((_) => {
      return new Array(appConfig.boardWidth).fill(false);
    });

    this.setState({
      isHover: temp
    });
  };

  //History
  backward = (): void => {
    if (this.state.step.stepNumber === 0) return;

    this.setState({
      step: this.state.history[this.state.step.stepNumber - 1],
    });
  };

  //History
  forward = (): void => {
    if (this.state.history.length <= this.state.step.stepNumber + 1) return;

    this.setState({
      step: this.state.history[this.state.step.stepNumber + 1],
    });
  };

  toggleTheme = () => {
    if (this.state.theme === ThemeType.light) {
      this.setState({
        theme: ThemeType.dark
      })
      appConfig.boardColor = darkTheme;
    } else {
      this.setState({
        theme: ThemeType.light
      })
      appConfig.boardColor = lightTheme;
    }
    this.setState({
      isCheck: !this.state.isCheck
    })

  };


  render() {
    return (
      <ThemeProvider theme={this.state.theme === ThemeType.light ? lightTheme : darkTheme}>
        <GlobalStyle />
        <Layout>
          {this.state.isWin ? (
            <Winner
              isWin={this.state.isWin}
              restart={this.restart}
              cancel={this.cancel}
            ></Winner>
          ) : null}
          <Section>
            <Pane display="flex" alignItems="center" justifyContent="center">
              <WallLeftIndicator appConfig={appConfig} step={this.state.step} id={0} />
              <Board
                appConfig={appConfig}
                step={this.state.step}
                playerMove={this.playerMove}
                isHover={this.state.isHover}
                hoverOver={this.hoverOver}
                leave={this.leave}
                didredirect={this.props.color}
              />
              <WallLeftIndicator appConfig={appConfig} step={this.state.step} id={1} />
            </Pane>
            <HistoryBar backward={this.backward} forward={this.forward}></HistoryBar>
            <ThemeController
              isCheck={this.state.isCheck}
              toggleTheme={this.toggleTheme}
            ></ThemeController>
          </Section>
        </Layout>
      </ThemeProvider>
    );
  }
}

export default QuoridorGame;