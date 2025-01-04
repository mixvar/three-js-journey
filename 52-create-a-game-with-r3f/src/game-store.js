import { create } from "zustand";

export const useGameStore = create((set) => {
  return {
    state: "ready",
    level: 1,
    restartCount: 0,

    start() {
      set((state) => {
        if (state.state === "ready") {
          return { state: "playing" };
        }
        return {};
      });
    },
    finishLevel() {
      set((state) => {
        if (state.state === "playing") {
          return {
            state: "ready",
            level: state.level + 1,
          };
        }
        return {};
      });
    },
    gameOver() {
      set((state) => {
        if (state.state === "playing") {
          return { state: "gameOver" };
        }
        return {};
      });
    },
    restart() {
      set((state) => {
        return {
          state: "ready",
          level: 1,
          restartCount: state.restartCount + 1,
        };
      });
    },
  };
});
