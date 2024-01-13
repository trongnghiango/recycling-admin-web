import { useLoader, useGraph } from "@react-three/fiber";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import * as THREE from "three";
//import { splitNumberFromString } from 'utils/utils';
import { useStateValue } from "@/state/AppProvider";
import { useEffect, useState } from "react";
import { Html } from "@react-three/drei";
import { angleToRadians } from "@/utils/utils";
import { ITooth, TeethPos } from "@/state/interfaces/teeth.interface";

const colorDefault = new THREE.Color("#FFF");

interface Props {
  objUrl: string;
  mtlUrl?: string | undefined;
  opacity?: number;
  color?: any;
  type: TeethPos;
  toothPosSel?: ITooth;
  onTouch?: (tooth?: ITooth) => void;
}

export default function Model(props: Props) {
  const {
    objUrl,
    mtlUrl = "",
    opacity = 1,
    color = colorDefault,
    type,
    toothPosSel,
    onTouch,
  } = props;
  // const { state } = useStateValue();
  // const [hovered, setHover] = useState(false);
  // console.log('url::', objUrl);
  const object = useLoader(OBJLoader, objUrl);

  const { nodes, materials } = useGraph(object);

  if (nodes) {
    Object.keys(nodes).forEach((k) => {
      const material = new THREE.MeshStandardMaterial({
        color: 0xcabaca, // red (can also use a CSS color string here)
        flatShading: false,
      });
      // Defines whether this material is transparent. This has an effect on rendering as transparent objects need special treatment and are rendered after non-transparent objects. When set to true, the extent to which the material is transparent is controlled by setting it's .opacity property.
      material.roughness = 0.2; // The roughness of the material - Defaults to 1
      material.metalness = 0.05;

      // console.log("---> ", nodes[k].visible, currentStep);

      materials[k] = material;

      if (!!toothPosSel && toothPosSel.type === type && toothPosSel.key === k) {
        // @ts-ignore
        materials[k].color.set(0x73a8d0);
      }

      //start: phan loai an hien rang
      // if (currentStep >= 18) {
      //const [a] = splitNumberFromString(k)!;
      // console.log('get rang so::', splitNumberFromString(k), a);
      // }
      //end: phan loai an hien rang

      if (opacity < 0.8) {
        // @ts-ignore
        materials[k].color.set(0x7b74e9);
        materials[k].transparent = true;
        materials[k].opacity = opacity;
      }

      if (isGums(k)) {
        // @ts-ignore
        materials[k].color.set(0xe2768f);
        // materials[k].color.set(0xf08c99);
        // @ts-ignore
        materials[k].roughness = 0.05;
        if (opacity < 0.8) materials[k].visible = false;
      }
    });
  }
  // console.log({ nodes, materials })

  function isToothSel(k: string): boolean {
    return toothPosSel?.key === k;
  }

  useEffect(() => {
    return () => {
      // console.log('unmount!!!');
      // object.clear();
    };
  }, []);

  /**
   *
   * @param k ::key for tooth data
   */
  const toothSelectionHandler = (key: string, e: any) => {
    e.stopPropagation(); //prevent xuyen khong
    setTimeout(() => {
      // this.setState({ showLoaderForPayment: true });

      // if (isGums(key)) return;
      Object.keys(materials).forEach((k) => {
        // @ts-ignore
        if (!isGums(k)) materials[k].color.set(0xbababa);
      });

      if (onTouch) {
        const mess = !!!isGums(key)
          ? { key, type }
          : { key, type: TeethPos.Other };
        onTouch(mess);
      }
    }, 200);
  };
  return nodes ? (
    <group
      dispose={null}
      // ref={refGroup}
      // rotation={[angleToRadians(0),-angleToRadians(90), -angleToRadians(180)]}
    >
      {Object.keys(nodes).map((k: string, i: number) => (
        <mesh
          visible={true}
          key={i}
          castShadow
          receiveShadow
          {...props}
          // ref={refMesh}
          // scale={active ? 1.5 : 1}
          // onPointerOver={(event) => setHover(true)}
          // onPointerOut={(event) => setHover(false)}
          onClick={(e) => toothSelectionHandler(k, e)}
        >
          {/* @ts-ignore */}
          <mesh geometry={nodes[k].geometry} material={materials[k]}></mesh>
          <meshPhongMaterial
            color={color}
            // roughness={opacity < 1 ? 0.1 : 0.9}
            opacity={opacity}
            transparent={opacity < 1 ? true : false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  ) : null;
}

const isGums = (name: string) => {
  const result =
    name.includes("mmGroup0") ||
    // || name.includes('mmGroup16')
    name.includes("Maxillary") ||
    name.includes("Mandibular");
  return result;
};
