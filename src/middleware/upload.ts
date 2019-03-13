import axios from "axios";
import { AnyAction, Dispatch, MiddlewareAPI } from "redux";
import { IAbort, IError, ILoad, IProgress } from "../common/types";
export const UPLOAD_API = "UPLOAD_API";

async function sendFile(file: File) {
  const bodyFormData = new FormData();
  bodyFormData.set("filename", file.name);
  bodyFormData.append("file", file);
  return axios.post("http://localhost:3001/upload", bodyFormData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
}

export default (store: MiddlewareAPI) => (next: Dispatch) => (
  action: AnyAction
) => {
  const api = action[UPLOAD_API];

  // So the middleware doesn't get applied to every single action
  if (typeof api === "undefined") {
    return next(action);
  }

  let { file, types } = api;
  const [requestType, successType, errorType] = types;

  next({
    type: requestType,
    file: file
  });

  return sendFile(file).then(
    response => {
      next({
        type: successType,
        file: file,
        progress: 100
      });
    },
    error =>
      next({
        type: errorType,
        file: file,
        error: {
          type: error.error || error.type,
          message: error.message
        }
      })
  );
};
