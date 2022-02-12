import React from "react";
import { Pane } from "evergreen-ui";
import { Color } from "../../Utils";

interface Props {
  position: { x: number; y: number };
  color: Color;
  width: number;
  height: number;
  put: (position: { x: number; y: number }) => void;
  hoverOver: (position: { x: number; y: number }) => void;
  leave: () => void;
}

const WallHorizontal = ({
  position,
  color,
  width,
  height,
  put,
  hoverOver,
  leave,
}: Props) => {
  return (
    <Pane
      background={color}
      width={width}
      height={height}
      onClick={() => {
        put(position);
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
