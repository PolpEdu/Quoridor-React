import React from "react";
import { Pane, Text } from "evergreen-ui";
import { AppConfig, Step } from "../Utils";

interface Props {
  appConfig: AppConfig;
  step: Step;
  id: number;
}

const WallLeftIndicator = ({ appConfig, step, id }: Props) => {
  const { stepNumber } = step;
  const { boardColor, wallLonger, breadth } = appConfig;
  const { cellColor } = boardColor;
  const { click } = id === 0 ? cellColor.player0 : cellColor.player1;
  const { remainingWalls } = id === 0 ? step.player0 : step.player1;

  return (
    <Pane
      width={100}
      height={(16 + 20) * 10}
      marginLeft={20}
      marginRight={20}
      alignItems="center"
      justifyContent="center"
    >
      {new Array(remainingWalls >= 0 ? remainingWalls : 0)
        .fill(1)
        .map((_, idx) => {
          return (
            <Pane
              key={idx}
              background={click}
              float="left"
              width={wallLonger}
              height={breadth}
              margin={10}
              display="flex"
              alignItems="center"
              justifyContent="center"
            ></Pane>
          );
        })}
      {stepNumber % 2 === id ? <Text color={"#4287f5"}>{"YOUR TURN"}</Text> : null}
    </Pane>
  );
};

export default WallLeftIndicator;
