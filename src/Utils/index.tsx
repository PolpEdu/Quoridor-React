export type Player = {
  id: number;
  numOfWallLeft: number;
  stepSize: number;
};

export enum Color {
  tint1 = "#F9F9FB",
  tint2 = "#F5F6F7",
  white = "#FFFFFF",
  N3 = "#EDF0F2",
  N5 = "#C7CED4",
  N8 = "#66788A",
  N9 = "#425A70",
  B6 = "#8FBCE6",
  B9 = "#1070CA",
  N10 = "#234361",
  NotionDark = "#2F3437",
  NotionWhite = "#ebebeb",
  RedBase = "#EC4C47",
  RedLight = "#FAE2E2",
  YellowBase = "#F7D154",
  YellowLight = "#FBE6A2",
  White = "#FFFFFF",
  Black = "#000000",
  Hex = "#2F3437",
  eb = "#ebebeb",
  b8 = "#6B8096",
}

export const lightTheme = {
  bgColor: Color.White,
  textColor: Color.Black,
  toggleBorder: Color.Black,
  gradient: "linear-gradient(#39598A, #79D7ED)",
  wallColor: {
    player1: {
      background: Color.NotionWhite,
      hover: Color.N5,
      click: Color.NotionDark,
    },
    player0: {
      background: Color.NotionWhite,
      hover: Color.N5,
      click: Color.NotionDark,
    },
  },
  cellColor: {
    player1: {
      background: Color.white,
      hover: Color.N5,
      click: Color.RedBase,
    },
    player0: {
      background: Color.white,
      hover: Color.N5,
      click: Color.YellowBase,
    },
  },
};

export const darkTheme = {
  bgColor: Color.Hex,
  textColor: Color.eb,
  toggleBorder: Color.b8,
  gradient: "linear-gradient(#091236, #1E215D)",
  wallColor: {
    player1: {
      background: Color.N9,
      hover: Color.N5,
      click: Color.Black,
    },
    player0: {
      background: Color.N9,
      hover: Color.N5,
      click: Color.Black,
    },
  },
  cellColor: {
    player1: {
      background: Color.NotionDark,
      hover: Color.N5,
      click: Color.RedBase,
    },
    player0: {
      background: Color.NotionDark,
      hover: Color.N5,
      click: Color.YellowBase,
    },
  },
};

export enum Theme {
  lightTheme,
  darkTheme,
}

export enum ThemeType {
  "light",
  "dark",
}

export type BoardColor = {
  wallColor: WallColor;
  cellColor: CellColor;
  bgColor: Color;
  textColor: Color;
  toggleBorder: Color;
  gradient: string;
};

export type PlayerColor = {
  background: Color;
  hover: Color;
  click: Color;
};

export type WallColor = {
  player1: PlayerColor;
  player0: PlayerColor;
};

export type CellColor = {
  player1: PlayerColor;
  player0: PlayerColor;
};

export type AppConfig = {
  gameId: string;
  boardColor: BoardColor;
  boardHeight: number;
  boardWidth: number;
  breadth: number;
  wallLonger: number;
  numberOfWalls: number;
  lengthOfWalls: number;
  numberOfPlayers?: number;
  player0Destination: { x: number; y: number }[];
  player1Destination: { x: number; y: number }[];
};

export type History = Step[];

export type Step = {
  walls: { x: number; y: number }[];
  player1: {
    x: number;
    y: number;
    remainingWalls: number;
  };
  player0: {
    x: number;
    y: number;
    remainingWalls: number;
  };
  stepNumber: number;
};

export const isEven = (number: number) => {
  if (number % 2 === 0) return true;
  return false;
};

interface Props {
  opponent: { x: number; y: number };
  me: { x: number; y: number };
  desiredPosition: { x: number; y: number };
  walls: { x: number; y: number }[];
}

export const canMove = ({
  opponent,
  me,
  desiredPosition,
  walls,
}: Props): boolean => {
  // Q1. What is the desired travel distance of 2? Is it 4? otherwise?
  // Q2. Is there an opponent in desiredPosition?
  // Q3. Is there a wall between desiredPosition and me?
  // Q4. Are me and opponent attached?

  //The rules are identical to those for two players, but it is forbidden to jump more than one pawn at a time.
  console.log("---------")

  console.log(desiredPosition);
  console.log(me);
  console.log(opponent);
  //opponent is in desiredPosition
  if (
    Math.abs(desiredPosition.x - opponent.x) +
    Math.abs(desiredPosition.y - opponent.y) ===
    0
  )
    return false;

  if (
    walls.find(
      (wall) =>
        (wall.x - me.x) * (wall.x - desiredPosition.x) <= 0 &&
        (wall.y - me.y) * (wall.y - desiredPosition.y) <= 0
    )
  ) {
    //TO-DO: Get positions where walls can block moving. Then verify that there is a wall at the position.
    return false;
  }

  if (
    Math.abs(me.x - desiredPosition.x) + Math.abs(me.y - desiredPosition.y) ===
    4 &&
    me.x + desiredPosition.x === opponent.x * 2 &&
    me.y + desiredPosition.y === opponent.y * 2
  )
    return true;

  if (
    Math.abs(me.x - desiredPosition.x) + Math.abs(me.y - desiredPosition.y) !==
    2
  )//TO-DO: replace RHS 2 with each player's stepSize in appConfig.
    return false;

  return true;
};

const canMoveForCanPut = ({
  opponent,
  me,
  desiredPosition,
  walls,
}: Props): boolean => {
  if (
    walls.find(
      (wall) =>
        wall.x === (me.x + desiredPosition.x) / 2 &&
        wall.y === (me.y + desiredPosition.y) / 2
    )
      ? true
      : false
  ) {
    //TO-DO: Get positions where walls can block moving. Then verify that there is a wall at the position.
    return false;
  }

  if (
    Math.abs(me.x - desiredPosition.x) + Math.abs(me.y - desiredPosition.y) !==
    2
  )
    //TO-DO: replace RHS 2 with each player's stepSize in appConfig.
    return false;

  return true;
};

export const canPut = ({
  desiredPosition,
  walls,
  player0Position,
  player1Position,
}: {
  desiredPosition: { x: number; y: number }[];
  walls: { x: number; y: number }[];
  player0Position: { x: number; y: number };
  player1Position: { x: number; y: number };
}): boolean => {
  if (!walls.length) return true;

  if (
    walls.reduce((acc, wall) => {
      return (
        acc ||
        desiredPosition.reduce((acc2, p) => {
          return acc2 || (p.x === wall.x && p.y === wall.y);
        }, false)
      );
    }, false)
  )
    return false;

  let exploredCells0 = new Set<{ x: number; y: number }>();
  exploredCells0.clear();
  exploredCells0.add({ x: player0Position.x, y: player0Position.y });

  let exploredCells1 = new Set<{ x: number; y: number }>();
  exploredCells1.clear();
  exploredCells1.add({ x: player1Position.x, y: player1Position.y });

  let newPathsFound0: number = 1;
  let newPathsFound1: number = 1;
  let nextStepWalls: { x: number; y: number }[] = [];
  nextStepWalls = [...walls, ...desiredPosition];

  let pathIsAvailable0: boolean = false;
  let pathIsAvailable1: boolean = false;

  function checkForDuplicates(
    value: { x: number; y: number },
    set: Set<{ x: number; y: number }>
  ) {
    for (var item of Array.from(set.values())) {
      if (item.x === value.x && item.y === value.y) {
        return true;
      }
    }
  }

  function exploreCells(
    opponent: { x: number; y: number },
    newPathsFound: number,
    value: { x: number; y: number },
    value2: { x: number; y: number },
    set: Set<{ x: number; y: number }>
  ) {
    if (!checkForDuplicates({ x: value.x, y: value.y + 2 }, set) === true) {
      if (value.y + 2 <= 16) {
        if (
          canMoveForCanPut({
            opponent: opponent,
            me: { x: value.x, y: value.y },
            desiredPosition: { x: value.x, y: value.y + 2 },
            walls: nextStepWalls,
          })
        ) {
          set.add({ x: value.x, y: value.y + 2 });
          newPathsFound += 1;
        }
      }
    }
    if (!checkForDuplicates({ x: value.x, y: value.y - 2 }, set) === true) {
      if (value.y - 2 >= 0) {
        if (
          canMoveForCanPut({
            opponent: opponent,
            me: { x: value.x, y: value.y },
            desiredPosition: { x: value.x, y: value.y - 2 },
            walls: nextStepWalls,
          })
        ) {
          set.add({ x: value.x, y: value.y - 2 });
          newPathsFound += 1;
        }
      }
    }
    if (!checkForDuplicates({ x: value.x + 2, y: value.y }, set) === true) {
      if (value.x + 2 <= 16) {
        if (
          canMoveForCanPut({
            opponent: opponent,
            me: { x: value.x, y: value.y },
            desiredPosition: { x: value.x + 2, y: value.y },
            walls: nextStepWalls,
          })
        ) {
          set.add({ x: value.x + 2, y: value.y });
          newPathsFound += 1;
        }
      }
    }
    if (!checkForDuplicates({ x: value.x - 2, y: value.y }, set) === true) {
      if (value.x - 2 >= 0) {
        if (
          canMoveForCanPut({
            opponent: opponent,
            me: { x: value.x, y: value.y },
            desiredPosition: { x: value.x - 2, y: value.y },
            walls: nextStepWalls,
          })
        ) {
          set.add({ x: value.x - 2, y: value.y });
          newPathsFound += 1;
        }
      }
    }
  }

  function checkFinishLine0(value: { x: number; y: number }) {
    if (value.y === 16) {
      pathIsAvailable0 = true;
      return true;
    }
  }

  function checkFinishLine1(value: { x: number; y: number }) {
    if (value.y === 0) {
      pathIsAvailable1 = true;
      return true;
    }
  }

  while (newPathsFound0 > 0) {
    newPathsFound0 = 1;
    exploredCells0.forEach(
      exploreCells.bind(null, player1Position, newPathsFound0)
    );
    exploredCells0.forEach(checkFinishLine0);
    newPathsFound0 -= 1;
  }

  while (newPathsFound1 > 0) {
    newPathsFound1 = 1;
    exploredCells1.forEach(
      exploreCells.bind(null, player0Position, newPathsFound1)
    );
    exploredCells1.forEach(checkFinishLine1);
    newPathsFound1 -= 1;
  }

  if (pathIsAvailable0 === false || pathIsAvailable1 === false) {
    return false;
  } else {
    return true;
  }
};
