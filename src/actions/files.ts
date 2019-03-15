import { ActionTypes } from "../constants";
import { UPLOAD_API } from "../middleware/upload";
import { ABORT_ERROR, ABORT_SUCCESS } from "../constants/ActionTypes";
import { IFile } from "../reducers/types";

let nextFileId = 0;

export const uploadFile = (file: File) => {
  return {
    [UPLOAD_API]: {
      file: file,
      id: nextFileId++,
      types: [
        ActionTypes.UPLOAD_REQUEST,
        ActionTypes.UPLOAD_SUCCESS,
        ActionTypes.UPLOAD_ERROR
      ]
    }
  };
};

export const cancelUpload = (file: IFile) => {
  return {
    [UPLOAD_API]: {
      file: file,
      id: file.id,
      types: [ActionTypes.ABORT_REQUEST, ABORT_SUCCESS, ABORT_ERROR]
    }
  };
};

export const removeFile = (file: IFile) => {
  return { type: ActionTypes.REMOVE_FILE, id: file.id, file: file };
};
