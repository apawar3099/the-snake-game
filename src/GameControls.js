import { useEffect, useRef } from "react";
import { controls } from "./constants";

export const GameControls = ({ calcNewDirect, createNewSnake }) => {
  const controlKeys = useRef();
  useEffect(() => {
    controlKeys.current.focus();
  }, []);

  const handleKeyPress = (e) => {
    if (controls[e.key]) {
      calcNewDirect(controls[e.key]);
      createNewSnake(controls[e.key]);
    } else {
      console.error("FALSE key");
    }
  };
  return (
    <div className="">
      <h3>Controls</h3>
      <input ref={controlKeys} onKeyUp={handleKeyPress} />
    </div>
  );
};
