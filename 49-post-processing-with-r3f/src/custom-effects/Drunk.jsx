import { forwardRef, useMemo } from "react";
import { DrunkEffect } from "./drunk-effect";

export const Drunk = forwardRef(
  ({ frequency, amplitude, blendFunction }, ref) => {
    // TODO: probably it would make sense to create instance just once and then update the uniforms when props change...
    const effect = useMemo(
      () => new DrunkEffect({ frequency, amplitude, blendFunction }),
      [frequency, amplitude, blendFunction]
    );

    return <primitive ref={ref} object={effect} dispose={null} />;
  }
);
