import {
  PresentationControls,
  Environment,
  Center,
  Float,
  Html,
  Text,
  ContactShadows,
} from "@react-three/drei";
import { PDFObject } from "react-pdfobject";
import { useGLTF } from "@react-three/drei";

export default function Experience() {
  const laptopModel = useGLTF(
    "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/macbook/model.gltf"
  );

  return (
    <>
      <Environment preset="city" />

      <color attach="background" args={["#1b1a1d"]} />

      <PresentationControls
        global
        rotation={[0.13, 0.1, 0]}
        polar={[-0.4, 0.2]}
        azimuth={[-1, 0.75]}
        config={{ mass: 2, tension: 400 }}
        snap={{ mass: 4, tension: 400 }}
      >
        <Float rotationIntensity={0.4}>
          <rectAreaLight
            width={2.5}
            height={1.65}
            intensity={50}
            color={"#a6a2c4"}
            rotation={[-0.1, Math.PI, 0]}
            position={[0, 0.55, -1.15]}
          />

          <Center>
            <primitive object={laptopModel.scene}>
              <Html
                transform
                wrapperClass="html-screen"
                distanceFactor={1.17}
                position={[0, 1.56, -1.4]}
                rotation-x={-0.256}
              >
                {/* <iframe src="https://bruno-simon.com/html/" /> */}
                <PDFObject
                  url="./some.pdf"
                  width={1024}
                  height={670}
                  pdfOpenParams={{ view: "FitH" }}
                />
              </Html>
            </primitive>
          </Center>

          <Text
            font="./bangers-v20-latin-regular.woff"
            color={"#7974a1"}
            fontSize={0.8}
            position={[2.1, 0.75, 0.35]}
            rotation-y={-1}
            rotation-x={-0.1}
            maxWidth={2}
            textAlign="left"
          >
            Nicholas Klaman
          </Text>
        </Float>
      </PresentationControls>

      <ContactShadows position-y={-1.6} opacity={0.8} scale={5} blur={2.4} />
    </>
  );
}
