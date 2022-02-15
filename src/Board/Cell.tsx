import React from "react";
import Pawn from "./Pawn";
import { Pane } from "evergreen-ui";
import { CellColor, Step, isEven } from "../Utils";
import "./cell.css";
import "./pane.css"
interface Props {
  position: { x: number; y: number };
  color: CellColor;
  width: number;
  height: number;
  isHover: boolean[][];
  playerMove: (position: { x: number; y: number }, isWall: boolean, isMyMove: boolean) => void;
  hoverOver: (position: { x: number; y: number }) => void;
  leave: () => void;
  step: Step;
  didredirect: boolean
}

const Cell = ({
  position,
  color,
  width,
  height,
  isHover,
  playerMove,
  hoverOver,
  leave,
  step,
  didredirect
}: Props) => {
  const { player0, player1, stepNumber } = step;
  const { background, hover } = isEven(stepNumber)
    ? color.player1
    : color.player0;

  const { x, y } = position;
  const on0 = player0.x === x && player0.y === y;
  const on1 = player1.x === x && player1.y === y;
  const onState = on0 || on1;

  const hoverState = isHover[x][y];

  const coords = "abcdefghi";
  const coordx = coords[Math.abs(y / 2)];
  const coordy = Math.abs(x / 2);


  //is it my turn? (didredirect && this.state.stepNumber % 2 === 1) || (!didredirect && this.state.stepNumber % 2 === 0)

  if (x === 16 && y === 16) {
    return (
      <Pane
        alignItems="center"
        justifyContent="center"
        background={background}
        width={width}
        height={height}
        onClick={() => {
          playerMove(position, false, (didredirect && step.stepNumber % 2 === 1) || (!didredirect && step.stepNumber % 2 === 0));
        }}
        onMouseOver={() => {
          hoverOver(position);
        }}
        onMouseLeave={() => {
          leave();
        }}
        className="pane"
      >
        <div className="coordcssY coord">{coordy}</div>
        <div className="coordcssX coord">{coordx}</div>
        {onState && (
          <Pawn
            onState={onState}
            hoverState={hoverState}
            on0={on0}
            color={color}
            hover={hover}
            background={background}
            width={width}
          ></Pawn>
        )}

      </Pane>
    );
  }
  else if (x === 16) {
    return (
      <Pane
        alignItems="center"
        justifyContent="center"
        background={background}
        width={width}
        height={height}
        onClick={() => {
          playerMove(position, false, true);
        }}
        onMouseOver={() => {
          hoverOver(position);
        }}
        onMouseLeave={() => {
          leave();
        }}
        className="pane"

      >
        <div className="coordcssX coord">{coordx}</div>

        {onState && (
          <Pawn
            onState={onState}
            hoverState={hoverState}
            on0={on0}
            color={color}
            hover={hover}
            background={background}
            width={width}
          ></Pawn>
        )
        }
      </Pane>
    );
  }
  else if (y === 16) {
    return (
      <Pane
        alignItems="center"
        justifyContent="center"
        background={background}
        width={width}
        height={height}
        onClick={() => {
          playerMove(position, false, true);
        }}
        onMouseOver={() => {
          hoverOver(position);
        }}
        onMouseLeave={() => {
          leave();
        }}
        className="pane"
      >
        <div className="coordcssY coord">{coordy}</div>

        {onState && (
          <Pawn
            onState={onState}
            hoverState={hoverState}
            on0={on0}
            color={color}
            hover={hover}
            background={background}
            width={width}
          ></Pawn>
        )}
      </Pane>
    );
  }
  return (
    <Pane
      alignItems="center"
      justifyContent="center"
      background={background}
      width={width}
      height={height}
      onClick={() => {
        playerMove(position, false, true);
      }}
      onMouseOver={() => {
        hoverOver(position);
      }}
      onMouseLeave={() => {
        leave();
      }}
      className="pane"
    >
      {onState && (
        <Pawn
          onState={onState}
          hoverState={hoverState}
          on0={on0}
          color={color}
          hover={hover}
          background={background}
          width={width}
        ></Pawn>
      )}
    </Pane>
  );
};

export default Cell;
