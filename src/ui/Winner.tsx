import React from "react";
import { Pane, Dialog } from "evergreen-ui";
import State, { initialStep } from "./Game";

interface Props {
  isWin: boolean;
  restart: () => void;
  cancel: () => void;
}

const Winner = (props: Props) => {
  return (
    <Pane>
      <Dialog
        isShown={props.isWin}
        onCancel={() => {

          props.cancel();

        }}
        cancelLabel="Back to board"
        hasHeader={false}
        onConfirm={() => {

          props.restart();
        }}
        confirmLabel="Restart"
      >
        <Pane
          height={100}
          alignItems="center"
          justifyContent="center"
          width="100%"
        >
          Congratz bro u won.
        </Pane>
      </Dialog>
    </Pane>
  );
};

export default Winner;
