import { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useControls } from "leva";

export const FoxModel = (props) => {
  const model = useGLTF("./Fox/glTF/Fox.gltf");

  const animations = useAnimations(model.animations, model.scene);

  const controls = useControls("fox", {
    animation: {
      options: animations.names,
    },
  });

  useEffect(() => {
    const action = animations.actions[controls.animation];

    action.reset().fadeIn(0.5).play();

    return () => {
      action.fadeOut(0.5);
    };
  }, [controls.animation]);

  return <primitive object={model.scene} {...props}></primitive>;
};
