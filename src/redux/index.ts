import createSagaMiddleware from "@redux-saga/core";
import { configureStore } from "@reduxjs/toolkit";
import rootReducers from "./rootReducers";
// Add the import
import rootSaga from "./features/rootSagas";

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: rootReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(sagaMiddleware),

});
// Added line
sagaMiddleware.run(rootSaga);

export default store;