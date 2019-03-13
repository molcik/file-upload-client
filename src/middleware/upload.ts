import { AnyAction, Dispatch, MiddlewareAPI } from "redux";
export const UPLOAD_API = "UPLOAD_API";
import splitWorker from "../services/splitWorker";
import WebWorker from "../services/WebWorker";
import axios, { CancelTokenSource } from "axios";

const cancelTokens: { [name: string]: CancelTokenSource } = {};

const processFile = async (file: File) => {
  let fileUploadWorker = new WebWorker(splitWorker) as any;
  fileUploadWorker.postMessage(file);
  fileUploadWorker.addEventListener("message", (event: any) => {
    processChunks(file, event.data.chunks, event.data.total, 0);
  });
};

const processChunks = (
  file: File,
  chunks: Blob[],
  total: number,
  index: number
) => {
  sendFile(file, chunks[index], total, index).then(
    res => {
      console.log(cancelTokens[file.name].token.reason);
      if (index < total - 1 && !cancelTokens[file.name].token.reason) {
        index++;
        processChunks(file, chunks, total, index);
      }

      if (index == 2) {
        cancelTokens[file.name].cancel();
      }
    },
    error => {}
  );
};

const sendFile = (file: File, chunk: Blob, total: number, index: number) => {
  const bodyFormData = new FormData();
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  cancelTokens[file.name] = source;

  bodyFormData.set("filename", file.name);
  bodyFormData.set("index", `${index}`);
  bodyFormData.set("total", `${total}`);
  bodyFormData.append("file", chunk);
  return axios.post("http://localhost:3001/upload", bodyFormData, {
    headers: { "Content-Type": "multipart/form-data" },
    cancelToken: source.token
  });
};

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

  processFile(file).then(
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
