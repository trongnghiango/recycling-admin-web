import { PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";
import { put, takeLatest } from "redux-saga/effects";
import { UserType, GET_USER_BY_ID } from "./types";
import { getUserErrorAction, getUserSuccessAction } from "./userSlice";
import config from "@/domains/common/config";
import agentApi from "@/api/agentApi";

// Generator function
function* getUserSaga({ payload: id }: PayloadAction<string>) {
  try {
    // You can also export the axios call as a function.
    const response: AxiosResponse<UserType> = yield agentApi.getList()
    //axios.get(`http://localhost:9000/api/v1/agent/list`);
    yield put(getUserSuccessAction(response.data));
  } catch (error: any) {
    yield put(getUserErrorAction(error.message));
  }
}

// Generator function
export function* watchGetUser() {
  yield takeLatest(GET_USER_BY_ID, getUserSaga);
}