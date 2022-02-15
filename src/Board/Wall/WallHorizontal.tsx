import React from "react";
import { Pane } from "evergreen-ui";
import { Color, Step } from "../../Utils";

interface Props {
  position: { x: number; y: number };
  color: Color;
  width: number;
  height: number;
  step: Step;
  playerMove: (position: { x: number; y: number }, isWall: boolean, isMyMove: boolean) => void;
  hoverOver: (position: { x: number; y: number }) => void;
  leave: () => void;
  didredirect: boolean
}

const WallHorizontal = ({
  position,
  color,
  width,
  height,
  step,
  playerMove,
  hoverOver,
  leave,
  didredirect
}: Props) => {
  return (
    <Pane
      background={color}
      width={width}
      height={height}
      onClick={() => {
        playerMove(position, true, (didredirect && step.stepNumber % 2 === 1) || (!didredirect && step.stepNumber % 2 === 0));
      }}
      onMouseOver={() => {
        hoverOver(position);
      }}
      onMouseLeave={() => {
        leave();
      }}
    ></Pane>
  );
};

export default WallHorizontal;
