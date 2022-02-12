import React from "react";
import {
  Pane,
  DoubleChevronLeftIcon,
  DoubleChevronRightIcon,
  Text,
} from "evergreen-ui";

interface Props {
  backward: () => void;
  forward: () => void;
}

const HistoryBar = ({ backward, forward }: Props) => {
  return (
    <Pane
      display="flex"
      alignItems="center"
      justifyContent="center"
      marginTop={30}
    >
      <DoubleChevronLeftIcon
        onClick={() => {
          backward();
        }}
      ></DoubleChevronLeftIcon>
      <Text marginLeft={5} marginRight={5}>
        History
      </Text>
      <DoubleChevronRightIcon
        onClick={() => {
          forward();
        }}
      ></DoubleChevronRightIcon>
    </Pane>
  );
};

export default HistoryBar;
