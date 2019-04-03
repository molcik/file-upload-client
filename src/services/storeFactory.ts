import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import upload from "../middleware/upload";
import rootReducer from "../reducers";
import { IFile, IFilesState } from "../reducers/types";

export interface IState {
  files: IFilesState;
}

const middleware = () => [thunk, upload];
const initialState: IState = { files: { files: [] } };

const storeFactory = (state: IState = initialState) =>
  composeWithDevTools(applyMiddleware(...middleware()))(createStore)(
    rootReducer,
    state
  );

export default storeFactory;
