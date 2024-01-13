import { ITeeth, TeethActions } from "state/interfaces/teeth.interface";
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
} from "../ActionTypes";
import { StateActions } from "../interfaces";

const teethReducer = (teethState: ITeeth, action: StateActions) => {
  const { type, payload } = action;
  switch (type) {
    case TOGGLE_MAXILLARY:
      return {
        ...teethState,
        maxi: payload.maxi,
      };
    case TOGGLE_MANDIBULAR:
      return {
        ...teethState,
        mand: payload.mand,
      };
    case TOGGLE_SUPER:
      return {
        ...teethState,
        isSuper: !teethState.isSuper,
      };
    case UPDATE_CLINIC_CODE:
      // console.log("Reducer::::", payload);
      return {
        ...teethState,
        clinicCode: payload.clinicCode,
      };

    case INC_STEP:
      return {
        ...teethState,
        currentStep: teethState.currentStep + 1,
      };

    case SET_STEP:
      return {
        ...teethState,
        ...payload,
      };

    case TOGGLE_PLAY:
      return {
        ...teethState,
        isPlaying: payload.isPlaying,
      };

    case SELECTED_TOOTH:
      return {
        ...teethState,
        selectedTooth: payload.selectedTooth,
      };

    case TOGGLE_UPPER:
      return {
        ...teethState,
        upperAction: !teethState.upperAction,
      };

    case SET_STEPS:
      return {
        ...teethState,
        ...payload,
      };

    default:
      return teethState;
  }
};
export default teethReducer;
