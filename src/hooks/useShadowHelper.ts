// Components==============
import { useFrame, useThree } from "@react-three/fiber";
import React, { useRef } from "react";
import { CameraHelper, Light } from "three";
// =========================

export default function useShadowHelper(
  ref: React.MutableRefObject<Light | undefined>
) {
  const helper = useRef<CameraHelper>();
  const scene = useThree((state) => state.scene);

  React.useEffect(() => {
    if (!ref.current) return;

    helper.current = new CameraHelper(ref.current?.shadow.camera);
    if (helper.current) {
      // @ts-ignore
      scene.add(helper.current);
    }

    return () => {
      if (helper.current) {
        // @ts-ignore
        scene.remove(helper.current);
      }
    };
  }, [helper.current?.uuid, ref.current]);

  useFrame(() => {
    if (helper.current?.update) {
      helper.current.update();
    }
  });
}
