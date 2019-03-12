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
      console.log(action);
      return {
        files: [
          ...state.files,
          {
            file: action.file,
            filename: action.filename,
            metadata: action.metadata
          }
        ]
      };

    default:
      return state;
  }
}
