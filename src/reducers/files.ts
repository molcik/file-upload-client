import { AnyAction } from "redux";
import { IFilesState } from "./types";
import { ActionTypes } from "../constants";

export const initialState: IFilesState = {
  files: []
};

export default function files(
  state = initialState,
  action: AnyAction
): IFilesState {
  switch (action.type) {
    case ActionTypes.UPLOAD_REQUEST:
      return {
        files: [
          ...state.files,
          {
            name: action.file.name,
            size: action.file.size,
            progress: 0,
            type: action.file.type
          }
        ]
      };

    case ActionTypes.UPLOAD_SUCCESS:
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

    case ActionTypes.UPLOAD_ERROR:
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

    default:
      return state;
  }
}
