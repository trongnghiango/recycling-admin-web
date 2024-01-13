import { all, fork } from "redux-saga/effects";
import { watchGetUser } from "./users/sagas";

const rootSaga = function* () {
  yield all([
    fork(watchGetUser),
    // Other forks
  ]);
};

export default rootSaga;