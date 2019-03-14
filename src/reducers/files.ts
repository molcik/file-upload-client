import { AnyAction } from "redux";
import { IFile, IFilesState } from "./types";
import { ActionTypes } from "../constants";

export const initialState: IFilesState = {
  files: []
};

const createFile = (state: IFilesState, action: AnyAction) => {
  return {
    files: [
      ...state.files,
      {
        name: action.file.name,
        size: action.file.size,
        progress: -1,
        type: action.file.type
      }
    ]
  };
};

const setProgress = (state: IFilesState, action: AnyAction) => {
  return {
    files: state.files.map(file => {
      if (file.name !== action.file.name) {
        // This isn't the item we care about - keep it as-is
        return file;
      }

      // Otherwise, this is the one we want - return an updated value
      return {
        ...file,
        progress: action.progress
      };
    })
  };
};

const setError = (state: IFilesState, action: AnyAction) => {
  return {
    files: state.files.map(file => {
      if (file.name !== action.file.name) {
        // This isn't the item we care about - keep it as-is
        return file;
      }
      // Otherwise, this is the one we want - return an updated value
      return {
        ...file,
        error: action.error,
        progress: action.progress
      };
    })
  };
};

export default function files(
  state = initialState,
  action: AnyAction
): IFilesState {
  switch (action.type) {
    case ActionTypes.UPLOAD_REQUEST:
      return createFile(state, action);

    case ActionTypes.UPLOAD_SUCCESS:
      return setProgress(state, action);

    case ActionTypes.UPLOAD_ERROR:
      return setError(state, action);

    case ActionTypes.ABORT_SUCCESS:
      return setError(state, action);

    case ActionTypes.ABORT_ERROR:
      return setError(state, action);

    default:
      return state;
  }
}
