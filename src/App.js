import { useEffect, useRef, useState } from "react";
import { ARENA_LEN, directs, dirKey } from "./constants";
import { GameControls } from "./GameControls";
import { controls } from "./constants";

function App() {
  const defaultArena = Array(ARENA_LEN)
    .fill(0)
    .map(() => Array(ARENA_LEN).fill(0));
  const defaultSnake = [
    { x: 1, y: 2 },
    { x: 1, y: 1 },
  ];

  const [arena, setArena] = useState(defaultArena);
  const [snake, setSnake] = useState([...defaultSnake]);
  const [snakeDir, setSnakeDir] = useState(dirKey.RIGHT); // It signifies DELTA
  const [apple, setApple] = useState();
  const [lastTail, setLastTail] = useState();
  const score = useRef(0);

  useEffect(() => {
    let newArena = defaultArena.map((row) => [...row]);
    snake.forEach((cell) => {
      newArena[cell.x][cell.y] = 1;
    });

    // console.log("gets called");
    newArena = createApple(newArena, apple);

    setArena(newArena);
  }, [snake]);

  const createApple = (arenaVal, appleVal) => {
    let newApple = appleVal ? { ...appleVal } : undefined;

    if (!appleVal) {
      newApple = getRandomApple();
    }
    if (snake[0].x === appleVal?.x && snake[0].y === appleVal?.y) {
      console.log("APPLE EATEN !!!", appleVal);

      let newSnake = [...snake];
      newSnake.push(lastTail); //Re-insert last tail
      setSnake([...newSnake]);
      score.current += 1;

      appleVal = undefined;

      newApple = getRandomApple();
    }

    if (arenaVal[newApple.x][newApple.y] == 1) {
      // means its on snake, then make recursive call
      console.log("came");
      return createApple(arenaVal, appleVal);
    }

    let tempArena = arenaVal.map((row) => [...row]);
    tempArena[newApple.x][newApple.y] = -1;

    setApple(newApple);

    return tempArena;
  };

  const getRandomApple = () => ({
    x: Math.floor(Math.random() * ARENA_LEN),
    y: Math.floor(Math.random() * ARENA_LEN),
  });

  const calcNewDirect = (newDirKey) => {
    if (
      directs[snakeDir].x + directs[newDirKey].x == 0 &&
      directs[snakeDir].y + directs[newDirKey].y == 0
    ) {
      gameOver();
      return;
    }

    setSnakeDir(newDirKey);
  };

  const createNewSnake = (newDirKey) => {
    let newHead = {
      x: snake[0].x + directs[newDirKey].x,
      y: snake[0].y + directs[newDirKey].y,
    };

    //check bounds
    if (
      newHead.x >= ARENA_LEN ||
      newHead.y >= ARENA_LEN ||
      newHead.x < 0 ||
      newHead.y < 0
    ) {
      gameOver();
      return;
    }

    //self eating check
    if (arena[newHead.x][newHead.y] === 1) {
      gameOver();
      return;
    }

    let newSnake = [...snake];
    newSnake.unshift(newHead); //insert new head
    const oldTail = newSnake.pop(); // reduce tail
    setLastTail(oldTail);

    setSnake([...newSnake]);
  };

  const gameOver = () => {
    setSnakeDir(dirKey.STOP);
    setSnake([...defaultSnake]);
    setApple(undefined);
    score.current = 0;
    alert("GAME OVER");
  };

  const handleKeyPress = (e) => {
    console.log(e.key);
    // if (controls[e.key]) {
    //   calcNewDirect(controls[e.key]);
    //   createNewSnake(controls[e.key]);
    // } else {
    //   console.error("FALSE key");
    // }
  };

  onkeyup = (e) => {
    if (controls[e.key]) {
      calcNewDirect(controls[e.key]);
      createNewSnake(controls[e.key]);
    } else {
      console.error("FALSE key");
    }
  };

  return (
    <div id="game-container" className="flex flex-col items-center gap-5">
      <h1 className="text-red-500 text-5xl font-black">SNAKE GAME</h1>
      <div
        id="arena"
        className={`flex flex-col items-center w-1/2 border-2 mx-auto`}
      >
        {arena.map((row, iRow) => (
          <div key={iRow} className="flex border-collapse">
            {row.map((col, iCol) => (
              <div
                key={iCol}
                className={` p-1 h-6 w-6 border  border-black  text-black bg-white ${
                  col === 1 && "text-white !bg-black"
                } ${col === -1 && " text-white !bg-red-700 rounded-full"}`}
              >
                {/* ({iRow},{iCol}) */}
              </div>
            ))}
          </div>
        ))}
      </div>
      <p>{JSON.stringify(snake.length)}</p>
      <p>apple{JSON.stringify(apple)}</p>
      <p>SCORE: {score.current}</p>

      {/* <GameControls
        createNewSnake={createNewSnake}
        calcNewDirect={calcNewDirect}
      /> */}
    </div>
  );
}

export default App;

//DONE  create random fruit pos  -  fruit cant be outside arena and inside/on snake
//DONE eat fruit and increase length
//DONE handle circular/self eatten case
// create proper game controls
// then add setInterval to auto crawl
