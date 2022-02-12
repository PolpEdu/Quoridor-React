import React from "react";
import { Pane } from "evergreen-ui";
import { Color } from "../../Utils";

interface Props {
  color: Color;
  width: number;
  height: number;
}

const WallIntersect = ({ color, width, height }: Props) => {
  return <Pane background={color} width={width} height={height}></Pane>;
};

export default WallIntersect;
