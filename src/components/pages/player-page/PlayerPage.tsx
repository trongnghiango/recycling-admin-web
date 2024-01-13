import React from "react";
import {
  Canvas,
  useFrame,
  useLoader,
  useThree,
  extend,
} from "@react-three/fiber";
import { Suspense, useMemo, useState, useRef, useEffect } from "react";
import * as THREE from "three";
import {
  Html,
  PerspectiveCamera,
  OrthographicCamera,
  OrbitControls,
  useProgress,
  Center,
} from "@react-three/drei";

import { APP_STATE_NAME, useStateValue } from "state/AppProvider";
import {
  SELECTED_TOOTH,
  SET_LOADING,
  SET_STEP,
  SET_STEPS,
  TOGGLE_MANDIBULAR,
  TOGGLE_MAXILLARY,
  TOGGLE_SUPER,
  TOGGLE_UPPER,
} from "state/ActionTypes";
import { getListFiles } from "domains/upload/upload.services";
import {
  IOrthodontics,
  IStep,
  ITooth,
  TeethPos,
} from "state/interfaces/teeth.interface";
import { angleToRadians, splitNumberFromString } from "utils/utils";
import { fetchFileDataFromGit } from "utils/getDataFromGit";
import { ButtonGroupController } from "./ButtonGroupController";
import {
  executeAllTasks,
  exeTask,
  exportData,
  getBlobLinkV2,
} from "utils/aesUtil";

import { KPLoader } from "components/shared/main-layout/MainLayout";
import PopupModal from "components/ui/popup-modal/PopupModal";
import LModel from "./LModel";
import {
  getDataFromLocal,
  getDataFromLocalV2,
  getMultiFiles,
  syncData,
} from "./player.utils";
// import Model from "../about-page/Model";
import { Description } from "../about-page/Description";
import { Slogan } from "../about-page/Slogan";
import Image from "next/image";
import Link from "next/link";
import { InfoTable } from "./InfoTable";
import { startTimer } from "winston";
import Loading from "@/components/shared/loading";

extend({ OrbitControls });

interface IProps {
  stepsData?: any;
  gdata?: any;
  ldata?: any;
  userId?: string;
  clinic_id?: string;
}

export const enum ITe {
  RESET = 0,
  IDLE = 1, //active for render
  SET = 2, //active for render
}

type ISType = {
  active: boolean;
};

let _startTime = 0;

/**
 *
 * @param param0
 * @returns
 */
export default function PlayerPage({ userId, clinic_id, ldata }: IProps) {
  const [front, setFront] = useState<ISType>();
  const [up, setUp] = useState<ISType>();
  const [left, setLeft] = useState<ISType>();
  const [right, setRight] = useState<ISType>();
  const [down, setDown] = useState<ISType>();
  const [behind, setBehind] = useState<ISType>();
  const [max, setMax] = useState(true);
  const [man, setMan] = useState(true);
  const [upper, setUpper] = useState<ISType>();
  const [lower, setLower] = useState<ISType>();

  const [popup, setPopup] = useState<boolean>(false);
  const { state, dispatch } = useStateValue();

  const { currentStep, isSuper, stepsData, selectedTooth } = state.teeth;
  // Code to move the camera around
  const orbitControlsRef = useRef<any>();
  const refTimeout = useRef<NodeJS.Timer>(); //when using: .current

  const setLoading = (value: boolean) => {
    // if (value) setTimeOutForLoader();
    dispatch({
      type: SET_LOADING,
      payload: { loading: value },
    });
  };

  /**
   * setTimeout
   */
  const setTimeOutForLoader = (ms?: number) => {
    const TIMEOUT = 100;
    if (!ms) ms = TIMEOUT;
    if (!!refTimeout && refTimeout.current) {
      clearTimeout(refTimeout.current);
    }
    refTimeout.current = setTimeout(() => {
      console.log("Timeout:S", refTimeout, currentStep);
      finishedLoad3DHandler();
    }, ms);
  };

  /**
   * func resetStep:
   * desc: reset back to 0
   */
  const resetStep = () => {
    setLoading(false);
    dispatch({ type: SET_STEP, payload: { currentStep: 0 } });
  };
  useEffect(() => {
    /**
     * Load Data Step and Return textContent
     * @param userId
     * @returns
     */
    async function loadDataFromFiles(userId: string) {
      setLoading(true);
      // for test
      console.log("Start download DATA ...");
      _startTime = performance.now();
      if (!Array.isArray(ldata)) {
        alert("KHONG TIM THAY DU LIEU HOAC LOI KET NOI is ARR");
        // setLoading(false);
        return;
      }

      const fnameList = ldata.filter(
        (fileName: string) => fileName.length > 10
      );
      const thoData = await getMultiFiles({
        patientId: userId,
        inputList: fnameList,
      });
      // console.log("Finished Downloading.....", thoData);
      console.log("End download DATA ...", performance.now() - _startTime);

      const dataRes: IOrthodontics<IStep> = getDataFromLocalV2(thoData);

      // setLoading(false)
      if (dataRes && Object.values(dataRes).length > 3) {
        dispatch({
          type: SET_STEPS,
          payload: syncData(dataRes),
        });
      } else {
        dispatch({
          type: SET_STEPS,
          payload: { stepsData: {}, length: 0, manLength: 0, maxLength: 0 },
        });
      }
      // setLoading(false)

      finishedLoad3DHandler();
    }

    if (!!userId) {
      loadDataFromFiles(userId);
    } else {
      setLoading(false);
      resetStep();
    }

    return () => {
      setLoading(false);
      if (!!refTimeout && refTimeout.current) {
        clearTimeout(refTimeout.current);
        dispatch({ type: SET_STEP, payload: { currentStep: -1 } });
      }
    };
  }, []);

  useEffect(() => {
    /**
     * Load Data Step and Return Content File
     * @param userId
     * @returns
     */
    async function loadDataFromFiles(userId: string) {
      setLoading(true);
      console.log("Start download DATA ...");
      const start = performance.now();
      if (!Array.isArray(ldata)) {
        alert("KHONG TIM THAY DU LIEU HOAC LOI KET NOI is ARR");
        setLoading(false);
        return;
      }

      const fnameList = ldata.filter(
        (fileName: string) => fileName.length > 10
      );
      const thoData = await getMultiFiles({
        patientId: userId,
        inputList: fnameList,
      });
      // console.log('Finished Downloading.....', thoData)
      const dataRes: IOrthodontics<IStep> = getDataFromLocal(thoData);
      console.log("End download DATA ...", performance.now() - start, thoData);
      // setLoading(false)
      if (dataRes && Object.values(dataRes).length > 3) {
        dispatch({
          type: SET_STEPS,
          payload: syncData(dataRes),
        });
      } else {
        dispatch({
          type: SET_STEPS,
          payload: { stepsData: {}, length: 0, manLength: 0, maxLength: 0 },
        });
      }
      // setLoading(false)
    }

    if (!!userId) {
      //loadDataFromFiles(userId);
    } else {
      //setLoading(false);
      //resetStep();
    }

    return () => {
      // setLoading(false);
      if (!!refTimeout && refTimeout.current) {
        clearTimeout(refTimeout.current);
        dispatch({ type: SET_STEP, payload: { currentStep: -1 } });
      }
    };
  }, []);

  /**
   * clearTimeout
   */
  useEffect(() => {
    // setLoading(true);

    return () => {
      setLoading(false);
      if (!!refTimeout && refTimeout.current) {
        clearTimeout(refTimeout.current);
        dispatch({ type: SET_STEP, payload: { currentStep: -1 } });
      }
    };
  }, []);

  /**
   * get length for so luong step
   * @param list
   * @returns
   */
  const getSize = (list: []) => {
    return list.length;
  };

  /**
   * func: updata state with variable selectedTooth
   * @param toothKey
   */
  const setToothSelection = (toothKey?: ITooth) => {
    dispatch({ type: SELECTED_TOOTH, payload: { selectedTooth: toothKey } });
  };

  const touchHander = (toothSelection?: ITooth) => {
    setToothSelection(toothSelection);
    // hanler ...
  };

  /**
   * render tat ca ham
   * @param param0 stepsData
   *
   * @returns
   */
  const TeethRender = ({
    stepsData,
    curStep,
  }: {
    stepsData?: IOrthodontics<IStep>;
    curStep: number;
    isLoading?: boolean;
  }) => {
    useFrame((_state) => {
      if (!!orbitControlsRef.current) {
        // const { x, y } = state.mouse;

        if (front?.active) {
          // rotate to front
          orbitControlsRef.current.setAzimuthalAngle(1 * angleToRadians(0));
          orbitControlsRef.current.setPolarAngle(1 * angleToRadians(90));
          setFront({ ...front, active: false });
        }
        if (behind?.active) {
          //rotate to behind
          orbitControlsRef.current.setAzimuthalAngle(1 * angleToRadians(180));
          orbitControlsRef.current.setPolarAngle(1 * angleToRadians(90));
          setBehind({ ...behind, active: false });
        }
        if (down?.active) {
          //rotate to show man
          orbitControlsRef.current.setAzimuthalAngle(1 * angleToRadians(0));
          orbitControlsRef.current.setPolarAngle(1 * angleToRadians(0));
          setDown({ ...down, active: false });
        }

        if (up?.active) {
          //rotate to show max
          orbitControlsRef.current.setAzimuthalAngle(1 * angleToRadians(0));
          orbitControlsRef.current.setPolarAngle(1 * angleToRadians(180));
          setUp({ ...up, active: false });
        }
        if (left?.active) {
          //rotate to left
          orbitControlsRef.current.setAzimuthalAngle(1 * angleToRadians(90));
          orbitControlsRef.current.setPolarAngle(1 * angleToRadians(90));
          setLeft({ ...left, active: false });
        }
        if (right?.active) {
          //rotate to right
          orbitControlsRef.current.setAzimuthalAngle(1 * angleToRadians(-90));
          orbitControlsRef.current.setPolarAngle(1 * angleToRadians(90));
          setRight({ ...right, active: false });
        }

        orbitControlsRef.current.update();
      }
    });

    if (!stepsData) return null;

    // return (
    //   <group>
    //     {Object.keys(stepsData).map((key, index) => {
    //       //TH man = undefined => using pre man
    //       const urlMax =
    //         !!stepsData[key].hasOwnProperty("maxillary") && max
    //           ? stepsData[key]["maxillary"]
    //           : undefined;
    //       const urlMan =
    //         !!stepsData[key].hasOwnProperty("mandibular") && man
    //           ? stepsData[key]["mandibular"]
    //           : undefined;
    //       return (
    //         (curStep === -1 || curStep.toString() === key) && (
    //           // <Suspense fallback={<Loader onFinished={finishedLoad3DHandler} />}>
    //             <mesh key={index}>
    //               {urlMax && (
    //                 <LModel
    //                   // objUrl={urlMax}
    //                   content={urlMax}
    //                   type={TeethPos.Maxi}
    //                   toothPosSel={selectedTooth}
    //                   onTouch={touchHander}
    //                 />
    //               )}

    //               {urlMan && (
    //                 <LModel
    //                   // objUrl={urlMan}
    //                   content={urlMan}
    //                   type={TeethPos.Mand}
    //                   toothPosSel={selectedTooth}
    //                   onTouch={touchHander}
    //                 />
    //               )}

    //               {/* {!stepsData[key]['maxillary'] && } */}
    //             </mesh>
    //           // </Suspense>
    //         )
    //       );
    //     })}
    //     <>
    //       {/* {Object.keys(stepsData!).length - 1 > maxLength! && currentStep > maxLength! && max ? (
    //         <Model objUrl={stepsData![maxLength!]['maxillary']} />
    //         ) : null}
    //         {Object.keys(stepsData!).length - 1 > manLength! && currentStep > manLength! && mand ? (
    //           <Model objUrl={stepsData![manLength!]['mandibular']} />
    //         ) : null} */}
    //     </>
    //   </group>
    // );

    return (
      <group>
        {!!stepsData &&
          Object.keys(stepsData).map((key, index) => {
            //TH man = undefined => using pre man
            const contentMax =
              !!stepsData[key].hasOwnProperty("maxillary") && max
                ? stepsData[key]["maxillary"]
                : undefined;
            const contentMan =
              !!stepsData[key].hasOwnProperty("mandibular") && man
                ? stepsData[key]["mandibular"]
                : undefined;
            return (
              (curStep === -1 || curStep.toString() === key) && (
                <mesh key={index}>
                  {contentMax && (
                    <LModel
                      // objUrl={contentMax}
                      content={contentMax}
                      type={TeethPos.Maxi}
                      toothPosSel={selectedTooth}
                      onTouch={touchHander}
                    />
                  )}

                  {contentMan && (
                    <LModel
                      // objUrl={contentMan}
                      content={contentMan}
                      type={TeethPos.Mand}
                      toothPosSel={selectedTooth}
                      onTouch={touchHander}
                    />
                  )}
                </mesh>
              )
            );
          })}
      </group>
    );
  };

  /**
   * useable
   * @param _
   */
  const forLoop = async (data: any) => {
    const syncData = {};
    for (const step in data) {
      // console.log(data[step])
      if (data[step]["maxillary"]) {
        data[step]["maxillary"] = getBlobLinkV2(
          await exeTask(data[step]["maxillary"])
        );
      }

      if (data[step]["mandibular"]) {
        data[step]["mandibular"] = getBlobLinkV2(
          await exeTask(data[step]["mandibular"])
        );
      }
    }
  };

  //fetch file
  async function getFile(file: number) {
    const response = await fetch(
      `https://raw.githubusercontent.com/trongnghiango/rang-phong/main/assets/Mandibular-${file}.obj`
    );
    if (response && response.status === 200) {
      // console.log(response)
      const result = await response.blob();
      return URL.createObjectURL(result);
    }
    return null;
  }

  /**
   * func
   * desc: called after rendering successful
   */
  const finishedLoad3DHandler = () => {
    console.log("Loader is Finished");
    setLoading(false);
    resetStep();
    console.log("Duration time:::", performance.now() - _startTime);
  };

  // useShadowHelper(THREE.SpotLightHelper)

  /**
   * func
   * desc:
   */
  const setIdleAngle = () => {
    setUp(undefined);
    setDown(undefined);
    setLeft(undefined);
    setRight(undefined);
    setFront(undefined);
    setBehind(undefined);
    setLower(undefined);
    setUpper(undefined);
  };

  const saveGlobalState = () => {
    localStorage.setItem(APP_STATE_NAME, JSON.stringify(state));
  };

  /**
   * desc: render original man/max
   * @returns Component
   */
  const Super = () => {
    if (!stepsData || !stepsData.hasOwnProperty("0")) return <></>;

    const superMaxUrl = stepsData["0"].maxillary ?? undefined;
    const superManUrl = stepsData["0"].mandibular ?? undefined;
    return (
      <>
        {isSuper && (
          <mesh>
            {/* <Model objUrl={ } /> */}
            {/* <Model objUrl={'assets/hhh.obj'} opacity={1} onTouch={() => { }} type={TeethPos.Maxi} /> */}
            {max && superMaxUrl && (
              // <Model
              <LModel
                // objUrl={superMaxUrl}
                content={superMaxUrl}
                opacity={0.7}
                type={TeethPos.Maxi}
                onTouch={() => {}}
              />
            )}
            {man && superManUrl && (
              // <Model
              <LModel
                // objUrl={superManUrl}
                content={superManUrl}
                opacity={0.7}
                type={TeethPos.Maxi}
                onTouch={() => {}}
              />
            )}
            {/* <Model objUrl={ } /> */}
          </mesh>
        )}
      </>
    );
  };

  /**
   * up Rotation
   */
  const upRotationHandler = () => {
    // dispatch({ type: TOGGLE_MANDIBULAR, payload: { mand: false } })
    if (!!orbitControlsRef.current) {
      // orbitControlsRef.current.enableDamping = true;
    }
    setIdleAngle();
    setMax(true);
    setMan(false);
    setUp({ ...up, active: true });
  };

  /**
   * Down Rotation
   */
  const downRotationHandler = () => {
    if (!!orbitControlsRef.current) {
      // orbitControlsRef.current.enableDamping = true;
    }
    setIdleAngle();
    setMax(false);
    setMan(true);
    setDown({ ...down, active: true });
  };

  const leftRotationHandler = () => {
    if (!!orbitControlsRef.current && !orbitControlsRef.current.enableDamping) {
      // orbitControlsRef.current.enableDamping = true;
    }
    setIdleAngle();
    setMax(true);
    setMan(true);
    setLeft({ ...left, active: true });
  };

  const rightRotationHandler = () => {
    if (!!orbitControlsRef.current && !orbitControlsRef.current.enableDamping) {
      // orbitControlsRef.current.enableDamping = true;
    }
    setIdleAngle();
    setMax(true);
    setMan(true);
    setRight({ ...right, active: true });
  };

  const frontRotationHandler = () => {
    if (!!orbitControlsRef.current && !orbitControlsRef.current.enableDamping) {
      // orbitControlsRef.current.enableDamping = true;
    }
    setIdleAngle();
    setMax(true);
    setMan(true);
    setFront({ ...front, active: true });
  };

  const behindRotationHandler = () => {
    if (!!orbitControlsRef.current && !orbitControlsRef.current.enableDamping) {
      // orbitControlsRef.current.enableDamping = true;
    }
    setIdleAngle();
    setMax(true);
    setMan(true);
    setBehind({ ...behind, active: true });
  };

  /**
   * up Rotation
   */
  const upperHandler = () => {
    // dispatch({ type: TOGGLE_MANDIBULAR, payload: { mand: false } })
    setIdleAngle();
    setMax(true);
    setMan(false);
    setUpper({ ...upper, active: true });
  };

  const lowerHandler = () => {
    setIdleAngle();
    setMax(false);
    setMan(true);
    setLower({ ...lower, active: true });
  };

  console.log(`Player RENDER`);
  /**
   * RENDERING ...
   */
  return (
    <>
      {/* View Render 3D */}
      <Canvas
        // frameloop="demand"
        className={"h-full mx-auto z-40"}
        // dpr={[1, 2]}
        orthographic
        // camera={{ zoom: 5, position: [0, 0, 100] }}
        shadows
        onPointerEnter={(_e) => {
          if (
            !!orbitControlsRef.current &&
            orbitControlsRef.current.enableDamping
          ) {
            orbitControlsRef.current.enableDamping = false;
          }
        }}
        onClick={(_e) => {}}
        onAuxClick={() => setToothSelection()}
        onPointerMissed={() => setToothSelection()}
      >
        {stepsData && Object.keys(stepsData).length > 0 && (
          <Suspense fallback={<Loader onFinished={finishedLoad3DHandler} />}>
            {/* <Lights /> */}
            <OrthographicCamera
              makeDefault
              position={[0, 0, 50]}
              // zoom={10}
              // near={1}
              // fov={50}
              key={undefined}
              attach={undefined}
              args={undefined}
              onUpdate={undefined}
              name={undefined}
              view={undefined}
              id={undefined}
              castShadow={undefined}
              type={undefined}
              visible={undefined}
              uuid={undefined}
              parent={undefined}
              modelViewMatrix={undefined}
              normalMatrix={undefined}
              matrixWorld={undefined}
              matrixAutoUpdate={undefined}
              matrixWorldNeedsUpdate={undefined}
              receiveShadow={undefined}
              frustumCulled={undefined}
              renderOrder={undefined}
              animations={undefined}
              userData={undefined}
              customDepthMaterial={undefined}
              customDistanceMaterial={undefined}
              isObject3D={undefined}
              onBeforeRender={undefined}
              onAfterRender={undefined}
              applyMatrix4={undefined}
              applyQuaternion={undefined}
              setRotationFromAxisAngle={undefined}
              setRotationFromEuler={undefined}
              setRotationFromMatrix={undefined}
              setRotationFromQuaternion={undefined}
              rotateOnAxis={undefined}
              rotateOnWorldAxis={undefined}
              rotateX={undefined}
              rotateY={undefined}
              rotateZ={undefined}
              translateOnAxis={undefined}
              translateX={undefined}
              translateY={undefined}
              translateZ={undefined}
              localToWorld={undefined}
              worldToLocal={undefined}
              lookAt={undefined}
              add={undefined}
              remove={undefined}
              removeFromParent={undefined}
              clear={undefined}
              getObjectById={undefined}
              getObjectByName={undefined}
              getObjectByProperty={undefined}
              getWorldPosition={undefined}
              getWorldQuaternion={undefined}
              getWorldScale={undefined}
              getWorldDirection={undefined}
              raycast={undefined}
              traverse={undefined}
              traverseVisible={undefined}
              traverseAncestors={undefined}
              updateMatrix={undefined}
              updateMatrixWorld={undefined}
              updateWorldMatrix={undefined}
              toJSON={undefined}
              clone={undefined}
              copy={undefined}
              addEventListener={undefined}
              hasEventListener={undefined}
              removeEventListener={undefined}
              dispatchEvent={undefined}
              zoom={2}
              near={5}
              far={1000}
              updateProjectionMatrix={undefined}
              setViewOffset={undefined}
              clearViewOffset={undefined}
              matrixWorldInverse={undefined}
              projectionMatrix={undefined}
              projectionMatrixInverse={undefined}
              isCamera={undefined}
              // isPerspectiveCamera={undefined}
              // aspect={0.5}
            >
              <spotLight
                position={[0, 0, 100]}
                color={new THREE.Color(0xbababa)}
              />
            </OrthographicCamera>
            {/* <Suspense fallback={<Loader onFinished={finishedLoad3DHandler} />}> */}

            <Center position={[0, 0, 0]}>
              <Super />

              <TeethRender
                stepsData={stepsData}
                curStep={currentStep}
                isLoading={state.loading}
              />
            </Center>

            {/* </Stage> */}
            {/* <Controls initialCameraZ={{ value: 120 }} /> */}

            {/* {
          stepsData &&
          Object.keys(stepsData).length > 0 &&<Models data={stepsData} curStep={currentStep} isLoading={state.loading} />
        } */}
            {/* </Suspense> */}

            {/* <CameraControls /> */}
            <OrbitControls
              ref={orbitControlsRef}
              minPolarAngle={undefined}
              maxPolarAngle={undefined}
              // target={[0, 0, -10]}
              enableDamping={false}
              enablePan={false}
              dampingFactor={0.1}
              // rotateSpeed={80}
              minDistance={60}
              maxDistance={400}
              minZoom={0.5}
              maxZoom={20}
              rotation={[Math.PI, Math.PI / 2, 0]}
            />

            {/* <axesHelper args={[5]} /> */}

            {/* <gridHelper /> */}

            {/* Floor */}
            {/* Test shadow by using Plane */}
            {/* <mesh rotation={[-(angleToRadians(90)), 0, 0]} receiveShadow position={[0, -100, 0]}>
            <planeGeometry args={[200, 200]} />
            <meshStandardMaterial color="#1ea3d8" />
          </mesh> */}
            <Lights />
          </Suspense>
        )}
      </Canvas>

      {/* View controlling */}
      <ButtonGroupController
        front={front}
        up={up}
        left={left}
        right={right}
        down={down}
        behind={behind}
        upper={upper}
        lower={lower}
        onUpRotate={upRotationHandler}
        onLeftRotate={leftRotationHandler}
        onRightRotate={rightRotationHandler}
        onDownRotate={downRotationHandler}
        onFrontRotate={frontRotationHandler}
        onBehindRotate={behindRotationHandler}
        onUpperShow={upperHandler}
        onLowerShow={lowerHandler}
      />

      {/* Description */}
      <Description />

      {/* Slogan */}
      <Slogan />

      {/* Modal Dialog */}
      <PopupModal
        show={false}
        // setCancel={}
      >
        <div className="modal-dialog modal-dialog-centered relative w-auto mx-auto pointer-events-none">
          <div className="modal-content border-none z-50 shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
            <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
              <h5
                className="text-xl font-semibold leading-normal text-gray-800"
                id="exampleModalScrollableLabel"
              >
                Alert
              </h5>
              <button
                type="button"
                className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body relative p-4 text-gray-700 flex flex-col items-center justify-center">
              <div
                className={`relative mt-4 h-[50px] w-[250px] hover:scale-105 cursor-pointer`}
              >
                <Image
                  src={"/assets/images/logo1.png"}
                  // height={35}
                  // width={150}
                  // logo ty le 1hx3w

                  alt={"logo"}
                  layout={"fill"}
                />
              </div>
              <span className="text-white text-2xl">
                Clear Orthodonic Solution
                <span className="flex text-lg">
                  <Link href={"https://www.dentallab.vn"} passHref>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-300"
                    >
                      https://www.dentallab.vn
                    </a>
                  </Link>
                </span>
              </span>
            </div>
            <div className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-between p-4 border-t border-gray-200 rounded-b-md">
              <button
                type="button"
                className="inline-block px-6 py-2.5 bg-purple-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out"
                data-bs-dismiss="modal"
                onClick={() => window.location.reload()}
              >
                Reload
              </button>
              <button
                type="button"
                className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out ml-1"
                onClick={() => {
                  if (currentStep < 0) window.location.reload();
                  setPopup(false);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </PopupModal>

      {/* Info Table */}
      <InfoTable />

      {state.loading && <Loading />}
    </>
  );
}

function Loader({ onFinished }: any) {
  const { progress } = useProgress();
  const { state, dispatch } = useStateValue();

  useEffect(() => {
    return () => {
      dispatch({ type: SET_STEP, payload: { currentStep: 0 } });
      // console.log('out loader.')
    };
  }, []);

  if (progress >= 100) onFinished();
  return (
    <Html center className="loading h-screen w-screen bg-white">
      {/* <div className=" z-50 h-screen w-screen flex flex-col justify-center items-center">
        <svg
          role="status"
          className="w-16 h-16 text-gray-200 animate-spin dark:text-gray-700 fill-[#29d] dark:fill-[#29d]"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        {progress.toFixed(0)}%
      </div> */}
      <KPLoader />
      <div className="effect-loading blur-2xl"></div>
    </Html>
  );
}

function Lights() {
  const ambientRef = useRef<any>();
  const directionalRef = useRef<any>();
  const pointRef = useRef<any>();
  const spotRef = useRef<any>();

  useEffect(() => {
    if (!!ambientRef && ambientRef.current) {
      ambientRef.current.visible = false;
      ambientRef.current.color = new THREE.Color(0xbababa);
    }

    if (!!directionalRef && directionalRef.current) {
      directionalRef.current.visible = true;
      directionalRef.current.color = new THREE.Color(0xbababa);
      // Object3D.DefaultUp (0, 1, 0)
    }

    if (!!pointRef && pointRef.current) {
      pointRef.current.visible = true;
      // pointRef.current.color = new THREE.Color(0x936767)
      pointRef.current.color = new THREE.Color(0xbababa);
    }
  }, []);

  if (!!spotRef && spotRef.current) {
    spotRef.current.visible = true;
    // spotRef.current.position.set(0.5, 0, 100);
    // spotRef.current.position.multiplyScalar(700);

    // spotRef.current.castShadow = true;

    // spotRef.current.shadow.mapSize.width = 2048;
    // spotRef.current.shadow.mapSize.height = 2048;

    // spotRef.current.shadow.camera.near = 200;
    // spotRef.current.shadow.camera.far = 1500;

    // spotRef.current.shadow.camera.fov = 40;

    // spotRef.current.shadow.bias = -0.005;
    // spotRef.current.color = new THREE.Color(0xBABABA);
  }

  return (
    <>
      <ambientLight ref={ambientRef} intensity={-0.005} />
      <directionalLight ref={directionalRef} position={[0, 10, 0]} />
      <pointLight ref={pointRef} position={[0, -10, 0]} />
      {/* <spotLight ref={spotRef} /> */}

      {/* phia truoc */}
      <spotLight
        ref={spotRef}
        castShadow
        position={[150, 50, 100]}
        color={new THREE.Color(0xbababa)}
      />
      <spotLight
        ref={spotRef}
        castShadow
        position={[-150, 50, 100]}
        color={new THREE.Color(0xbababa)}
      />
      {/* phia sau */}
      {/* <spotLight position={[100, 50, -100]} color={new THREE.Color(0xBABABA)} />
        <spotLight position={[-100, 50, -100]} color={new THREE.Color(0xBABABA)} /> */}

      {/* phia duoi */}
      {/* <spotLight position={[-30, -100, -50]} color={new THREE.Color(0xBABABA)} /> */}
      {/* <spotLight position={[-10, -100, -50]} color={new THREE.Color(0xBABABA)} /> */}

      {/* phia tren */}
      {/* <spotLight position={[10, 10, 100]} color={new THREE.Color(0xBABABA)} /> */}

      {/* <hemisphereLight color={new THREE.Color(0xBABABA)} /> */}
      {/* <ambientLight intensity={-0.005} /> */}
    </>
  );
}

PlayerPage.displayName = "PlayerPage";
