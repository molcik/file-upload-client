import { ActionTypes } from "../constants";
import { UPLOAD_API } from "../middleware/upload";

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
