import { Physics } from "@react-three/rapier";
import { Environment } from "@react-three/drei";
import Lights from "./Lights.jsx";
import {
  Level,
  AxeTrapBlock,
  LimboTrapBlock,
  SpinnerTrapBlock,
} from "./Level.jsx";
import { Player } from "./Player.jsx";
import { useGameStore } from "./game-store";

export default function Experience() {
  const level = useGameStore((store) => store.level);
  const restartCount = useGameStore((store) => store.restartCount);

  const trapCount = level * 5;
  const key = `w${level}-${restartCount}`;

  return (
    <>
      <Lights />

      <Physics>
        <Level
          key={`level-${key}`}
          trapCount={trapCount}
          trapBlocks={[AxeTrapBlock, LimboTrapBlock, SpinnerTrapBlock]}
        />
        <Player key={`player-${key}`} />
      </Physics>
      <Environment
        files={"syferfontein_18d_clear_puresky_2k.hdr"}
        background
        environmentIntensity={0.4}
      />
    </>
  );
}
