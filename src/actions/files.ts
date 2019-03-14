import { ActionTypes } from "../constants";
import { UPLOAD_API } from "../middleware/upload";
import { ABORT_ERROR, ABORT_SUCCESS } from "../constants/ActionTypes";

export const uploadFile = (file: File) => {
  return {
    [UPLOAD_API]: {
      file: file,
      types: [
        ActionTypes.UPLOAD_REQUEST,
        ActionTypes.UPLOAD_SUCCESS,
        ActionTypes.UPLOAD_ERROR
      ]
    }
  };
};

export const cancelUpload = (file: File) => {
  return {
    [UPLOAD_API]: {
      file: file,
      types: [ActionTypes.ABORT_REQUEST, ABORT_SUCCESS, ABORT_ERROR]
    }
  };
};
