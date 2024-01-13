import {
  INC_STEP,
  SET_STEP,
  SET_STEPS,
  TOGGLE_MANDIBULAR,
  TOGGLE_MAXILLARY,
  TOGGLE_PLAY,
  TOGGLE_SUPER,
  TOGGLE_UPPER,
  SELECTED_TOOTH,
  UPDATE_CLINIC_CODE,
} from "state/ActionTypes";

export interface ITeeth {
  userId: string | undefined;
  stepsData: IOrthodontics<IStep> | undefined;
  currentStep: number;
  maxi?: boolean;
  mand?: boolean;
  isSuper?: boolean;
  isPlaying?: boolean;
  upperAction?: boolean;
  length?: number;
  maxLength?: number;
  manLength?: number;
  doctor?: string;
  clinicCode?: string;
  selectedTooth?: ITooth;
}

export interface IOrthodontics<T> {
  [Key: string]: T; // Key tuong duong voi step
}

export interface IStep {
  maxillary?: string; //IOrth;
  mandibular?: string; //IOrth;
  mxSize?: number;
  mnSize?: number;
}

export interface IOrth {
  name: string;
  url: string;
  info?: string;
}

export enum TeethPos {
  Maxi = "maxillary",
  Mand = "mandibular",
  Other = "Other",
}

export interface ITooth {
  key: string;
  type: TeethPos;
  label?: string;
}

//for action
// action an/hien ham Tren
export interface IMaxillaryToggle {
  type: typeof TOGGLE_MAXILLARY;
  payload: { maxi: boolean };
  // payload: {};
}
export interface IMandibularToggle {
  type: typeof TOGGLE_MANDIBULAR;
  payload: { mand: boolean };
}

export interface ISuperToggle {
  type: typeof TOGGLE_SUPER;
  payload: undefined;
}

export interface IUpdateClinicAction {
  type: typeof UPDATE_CLINIC_CODE;
  payload: { clinicCode: string };
}

export interface IStepIncre {
  type: typeof INC_STEP;
  payload: any;
}

export interface IStepSetValue {
  type: typeof SET_STEP;
  payload: { currentStep: number };
}

export interface IPlayToggle {
  type: typeof TOGGLE_PLAY;
  payload: { isPlaying: boolean };
}

export interface IToothSelection {
  type: typeof SELECTED_TOOTH;
  payload: { selectedTooth: ITooth | undefined };
}

export interface ISetOrths {
  type: typeof SET_STEPS;
  payload: {
    stepsData: IOrthodontics<IStep>;
    length: number;
    maxLength: number;
    manLength: number;
  };
}

export interface IUpperAction {
  type: typeof TOGGLE_UPPER;
  payload: undefined;
}

export type TeethActions =
  | IMaxillaryToggle
  | IMandibularToggle
  | IStepIncre
  | IStepSetValue
  | IPlayToggle
  | ISetOrths
  | ISuperToggle
  | IUpperAction
  | IUpdateClinicAction
  | IToothSelection;
