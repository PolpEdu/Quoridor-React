import React from "react";
import { Pane, Switch } from "evergreen-ui";


interface Props {
  isCheck: boolean;
  toggleTheme: () => void;
}

const ThemeController = ({ isCheck, toggleTheme }: Props) => {
  return (
    <Pane
      display="flex"
      alignItems="center"
      justifyContent="center"
      marginTop={30}
    >
      <Switch height={20} checked={isCheck} onChange={toggleTheme} />
    </Pane>
  );
};

export default ThemeController;
