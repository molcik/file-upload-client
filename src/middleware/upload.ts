import { AnyAction, Dispatch, MiddlewareAPI } from "redux";
import splitWorker from "../services/splitWorker";
import WebWorker from "../services/WebWorker";
import axios, { CancelTokenSource } from "axios";
import { ActionTypes } from "../constants";

export const UPLOAD_API = "UPLOAD_API";

const cancelTokens: { [name: string]: CancelTokenSource } = {};

const getPercentage = (index: number, total: number) => {
  return Math.ceil(((index + 1) / total) * 100);
};

const checkFile = (file: File) => {
  if (file.size > 5e8) throw new Error("file size exceeded (500MB)");
};

const processFile = (file: File, next: Dispatch, types: any[]) => {
  let fileUploadWorker = new WebWorker(splitWorker) as any;
  fileUploadWorker.postMessage(file);
  fileUploadWorker.addEventListener("message", (event: any) => {
    next({
      type: types[1],
      file: file,
      progress: 0
    });
    processChunks(file, event.data.chunks, event.data.total, 0, next, types);
  });
};

const processChunks = (
  file: File,
  chunks: Blob[],
  total: number,
  index: number,
  next: Dispatch,
  types: any[]
) => {
  return sendFile(file, chunks[index], total, index).then(
    res => {
      next({
        type: types[1],
        file: file,
        progress: getPercentage(index, total)
      });
      if (index < total - 1 && !cancelTokens[file.name].token.reason) {
        index++;
        processChunks(file, chunks, total, index, next, types);
      }
    },
    error => {
      console.log(error);
      next({ type: types[2], file: file, error: error.message });
    }
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
  let [requestType, successType, errorType] = types;

  try {
    switch (requestType) {
      case ActionTypes.UPLOAD_REQUEST:
        next({
          type: requestType,
          file: file
        });
        checkFile(file);
        processFile(file, next, types);
        break;
      case ActionTypes.ABORT_REQUEST:
        cancelTokens[file.name].cancel("canceled");
    }
  } catch (e) {
    next({ type: errorType, file: file, error: e.message });
  }
};
