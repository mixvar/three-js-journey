import { useEffect } from "react";
import { useKeyboardControls } from "@react-three/drei";
import { useGameStore } from "./game-store";

export const Interface = () => {
  const forward = useKeyboardControls((keys) => keys.forward);
  const backward = useKeyboardControls((keys) => keys.backward);
  const leftward = useKeyboardControls((keys) => keys.leftward);
  const rightward = useKeyboardControls((keys) => keys.rightward);
  const jump = useKeyboardControls((keys) => keys.jump);
  const confirm = useKeyboardControls((keys) => keys.confirm);

  const state = useGameStore((store) => store.state);
  const restart = useGameStore((store) => store.restart);

  useEffect(() => {
    if (state === "gameOver" && confirm) {
      restart();
    }
  }, [state, confirm]);

  return (
    <div className="ui-container">
      {/* <div className="ui-time">0.00</div> */}

      <div className="controls">
        <div className="raw">
          <div className={`key ${forward ? "active" : ""}`}></div>
        </div>
        <div className="raw">
          <div className={`key ${leftward ? "active" : ""}`}></div>
          <div className={`key ${backward ? "active" : ""}`}></div>
          <div className={`key ${rightward ? "active" : ""}`}></div>
        </div>
        <div className="raw">
          <div className={`key large ${jump ? "active" : ""}`}></div>
        </div>
      </div>
      <div className={`game-over ${state === "gameOver" ? "" : "hidden"}`}>
        GAME OVER
      </div>
      <div
        className={`restart ${state === "gameOver" ? "" : "hidden"}`}
        onClick={restart}
      >
        Restart
      </div>
    </div>
  );
};
