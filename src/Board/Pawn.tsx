import React from "react";
import { FullCircleIcon } from "evergreen-ui";
import { CellColor, Color } from "../Utils";
import "./pane.css";
interface Props {
  color: CellColor;
  width: number;
  hoverState: boolean;
  background: Color;
  hover: Color;
  on0: boolean;
  onState: boolean;
}

const Pawn = ({
  onState,
  on0,
  color,
  hoverState,
  hover,
  background,
  width,
}: Props) => {
  return (
    <FullCircleIcon
      color={
        onState
          ? on0 === true
            ? color.player0.click
            : color.player1.click
          : hoverState
            ? hover
            : background
      }
      justifyContent={"center"}
      alignItems={"center"}
      size={width * 0.8}
      className="pawn"
    ></FullCircleIcon>
  );
};

export default Pawn;
