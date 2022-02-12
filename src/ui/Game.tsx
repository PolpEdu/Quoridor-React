
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
  gameId: string;
};

type State = {
  isWin: boolean;
  isCheck: boolean;
  step: Step;
  history: History;
  isHover: boolean[][];
  theme: ThemeType;
  isF: boolean;
}

type Props = {
  gameId: string;
  color: boolean;
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
      isF: this.props.color,
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
    socket.on('opponent move', (move: move) => {

      console.log("opponenet's move: " + move.nextmove.stepNumber)

      if (move.nextmove.stepNumber !== this.state.step.stepNumber) {
        if (this.state.step.stepNumber % 2 == 0 || this.state.isF) {
          this.moveTurn(move.nextmove.player0); //moveTurn() already updates the step number state
          this.setState({
            isF: false
          });
        }
        else {
          this.moveTurn(move.nextmove.player1); //moveTurn() already updates the step number state
        }
      }

      console.log("step number: " + this.state.step.stepNumber)
    })
  };

  moveTurn = (position: { x: number; y: number }) => {
    // move == [pieceId, finalPosition]

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


    if (stepNumber % 2 === 0) { //is my move?
      console.log("my move")
      if (!canMove({ desiredPosition: position, opponent: player1, me: player0, walls })) return;

      nextStep.player0.x = position.x;
      nextStep.player0.y = position.y;

      //check victory
      if (appConfig.player0Destination.find((dest) => dest.x === nextStep.player0.x && dest.y === nextStep.player0.y)) {
        this.setState({ isWin: true });
      }

    } else {
      console.log("opponenet's move: ")

      if (!canMove({ desiredPosition: position, opponent: player0, me: player1, walls, })) return;
      nextStep.player1.x = position.x;
      nextStep.player1.y = position.y;

      if (appConfig.player1Destination.find((dest) => dest.x === nextStep.player1.x && dest.y === nextStep.player1.y)) {
        this.setState({ isWin: true });
      }
    };


    this.setState({ step: nextStep });
    const newHistory = [
      ...this.state.history.filter((step) => step.stepNumber < nextStep.stepNumber),
      nextStep
    ];

    this.setState({
      history: newHistory
    });

    socket.emit('new move', {
      nextmove: nextStep,
      gameId: this.props.gameId
    });
  };

  putWall = (position: { x: number; y: number }) => {
    const { stepNumber, player0, player1 } = this.state.step;
    const [...walls] = this.state.step.walls;
    const { x, y } = position;

    const nextStep = {
      walls,
      player0: {
        x: this.state.step.player0.x,
        y: this.state.step.player0.y,
        remainingWalls: this.state.step.player0.remainingWalls,
      },
      player1: {
        x: this.state.step.player1.x,
        y: this.state.step.player1.y,
        remainingWalls: this.state.step.player1.remainingWalls,
      },
      stepNumber: this.state.step.stepNumber + 1,
    };

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

    if (
      !canPut({
        desiredPosition,
        walls,
        player0Position: { x: player0.x, y: player0.y },
        player1Position: { x: player1.x, y: player1.y },
      })
    )
      return;

    if (isEven(stepNumber)) {
      if (this.state.step.player0.remainingWalls === 0) return;
      nextStep.player0.remainingWalls -= 1;
    } else {
      if (this.state.step.player1.remainingWalls === 0) return;
      nextStep.player1.remainingWalls -= 1;
    }
    nextStep.walls = [...walls, ...desiredPosition];

    this.setState({ step: nextStep });

    const newHistory = [
      ...this.state.history.filter((step) => step.stepNumber < nextStep.stepNumber),
      nextStep,
    ];

    this.setState({
      history: newHistory
    });
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
                move={this.moveTurn}
                put={this.putWall}
                isHover={this.state.isHover}
                hoverOver={this.hoverOver}
                leave={this.leave}
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