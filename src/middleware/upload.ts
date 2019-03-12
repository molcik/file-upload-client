import axios from "axios";
import { AnyAction, Dispatch, MiddlewareAPI } from "redux";
export const UPLOAD_API = "UPLOAD_API";

async function sendFile(filename: string, file: File, metadata: string) {
  const bodyFormData = new FormData();
  bodyFormData.set("filename", name);
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

  let { filename, file, metadata, types } = api;
  const [requestType, successType, errorType] = types;

  next({
    type: requestType,
    file: file,
    filename: filename,
    metadata: metadata
  });

  return sendFile(filename, file, metadata).then(
    response =>
      next({
        type: successType
      }),
    error =>
      next({
        type: errorType,
        error: {
          type: error.error || error.type,
          message: error.message
        }
      })
  );
};
