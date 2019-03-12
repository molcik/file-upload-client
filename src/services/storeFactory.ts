import { createStore, applyMiddleware } from "redux";
import upload from "../middleware/upload";
import thunk from "redux-thunk";
import rootReducer from "../reducers";
import { IFilesState } from "../reducers/types";
import { composeWithDevTools } from "redux-devtools-extension";

export interface IState {
  files?: IFilesState;
}

const middleware = () => [thunk, upload];

const storeFactory = (initialState: IState = {}) =>
  composeWithDevTools(applyMiddleware(...middleware()))(createStore)(
    rootReducer,
    initialState
  );

export default storeFactory;
