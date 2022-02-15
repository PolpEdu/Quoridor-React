import React from "react";
import Cell from "./Cell";
import WallHorizontal from "./Wall/WallHorizontal";
import WallVertical from "./Wall/WallVertical";
import WallIntersect from "./Wall/WallIntersect";
import { Pane } from "evergreen-ui";
import { AppConfig, Step, isEven, WallColor, Color } from "../Utils";

interface Props {
  appConfig: AppConfig;
  step: Step;
  playerMove: (position: { x: number; y: number }, isWall: boolean, isMyMove: boolean) => void;
  isHover: boolean[][];
  hoverOver: (position: { x: number; y: number }) => void;
  leave: () => void;
  didredirect: boolean;
}

export const Board = ({
  appConfig,
  step,
  playerMove,
  isHover,
  hoverOver,
  leave,
  didredirect
}: Props) => {
  const {
    boardHeight,
    boardWidth,
    boardColor,
    wallLonger,
    breadth,
  } = appConfig;

  const { cellColor, wallColor } = boardColor;
  const { stepNumber } = step;
  const is0Turn = isEven(stepNumber) ? false : true;

  const selectWallColor = (
    is0Turn: boolean,
    wallColor: WallColor,
    step: Step,
    position: { x: number; y: number },
    isHover: boolean
  ): Color => {
    const { x, y } = position;
    const wallColor2 = is0Turn ? wallColor.player0 : wallColor.player1;
    const isClick = step.walls.find((wall) => wall.x === x && wall.y === y)
      ? true
      : false;
    const { background, hover, click } = wallColor2;

    return isClick ? click : isHover ? hover : background;
  };

  return (
    <Pane>
      {new Array(boardHeight).fill(1).map((_, x) => {
        return (
          <Pane display="flex" key={x}>
            {new Array(boardWidth).fill(1).map((_, y) => {
              if (isEven(x) && isEven(y)) {
                return (
                  <Cell
                    key={x ** 2 + y}
                    position={{ x, y }}
                    color={cellColor}
                    width={wallLonger}
                    height={wallLonger}
                    isHover={isHover}
                    step={step}
                    hoverOver={hoverOver}
                    leave={leave}
                    playerMove={playerMove}
                    didredirect={didredirect}
                  ></Cell>
                );
              } else if (!isEven(x) && isEven(y)) {
                return (
                  <WallHorizontal
                    key={x ** 2 + y}
                    position={{ x, y }}
                    color={selectWallColor(
                      is0Turn,
                      wallColor,
                      step,
                      { x, y },
                      isHover[x][y]
                    )}
                    step={step}
                    width={wallLonger}
                    height={breadth}
                    hoverOver={hoverOver}
                    leave={leave}
                    playerMove={playerMove}
                    didredirect={didredirect}
                  ></WallHorizontal>
                );
              } else if (isEven(x) && !isEven(y)) {
                return (
                  <WallVertical
                    key={x ** 2 + y}
                    position={{ x, y }}
                    color={selectWallColor(
                      is0Turn,
                      wallColor,
                      step,
                      { x, y },
                      isHover[x][y]
                    )}
                    step={step}
                    width={breadth}
                    height={wallLonger}
                    hoverOver={hoverOver}
                    leave={leave}
                    playerMove={playerMove}
                    didredirect={didredirect}
                  ></WallVertical>
                );
              } else {
                return (
                  <WallIntersect
                    key={x ** 2 + y}
                    color={selectWallColor(
                      is0Turn,
                      wallColor,
                      step,
                      { x, y },
                      isHover[x][y]
                    )}
                    width={breadth}
                    height={breadth}
                  ></WallIntersect>
                );
              }
            })}
          </Pane>
        );
      })}
    </Pane>
  );
};

export default Board;
