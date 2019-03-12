import { ActionTypes } from "../constants";
import { UPLOAD_API } from "../middleware/upload";

export const uploadFile = (filename: string, file: File, metadata: any) => {
  return {
    [UPLOAD_API]: {
      filename: filename,
      file: file,
      metadata: metadata,
      types: [
        ActionTypes.UPLOAD_REQUEST,
        ActionTypes.UPLOAD_SUCCESS,
        ActionTypes.UPLOAD_ERROR
      ]
    }
  };
};
