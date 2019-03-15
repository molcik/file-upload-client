import { AnyAction, Dispatch, MiddlewareAPI } from "redux";
import splitWorker from "../services/split.worker";
import WebWorker from "../services/WebWorker";
import axios, { CancelTokenSource } from "axios";
import { ActionTypes } from "../constants";
export const UPLOAD_API = "UPLOAD_API";

const cancelTokens: { [id: number]: CancelTokenSource } = {};

const getPercentage = (index: number, total: number) => {
  return Math.ceil(((index + 1) / total) * 100);
};

const checkFile = (file: File) => {
  if (file.size > 5e8) throw new Error("file size exceeded (500MB)");
};

const processFile = (id: number, file: File, next: Dispatch, types: any[]) => {
  let fileSplit = new WebWorker(splitWorker) as any;
  fileSplit.postMessage(file);
  fileSplit.addEventListener("message", (event: any) => {
    next({
      id: id,
      type: types[1],
      file: file,
      progress: 0
    });
    processChunks(
      id,
      file,
      event.data.chunks,
      event.data.total,
      0,
      next,
      types
    );
  });
};

const processChunks = (
  id: number,
  file: File,
  chunks: Blob[],
  total: number,
  index: number,
  next: Dispatch,
  types: any[]
) => {
  sendFile(id, file, chunks[index], total, index).then(
    res => {
      next({
        type: types[1],
        id: id,
        file: file,
        url: res.data.permanent || null,
        progress: getPercentage(index, total)
      });
      if (index < total - 1 && !cancelTokens[id].token.reason) {
        index++;
        processChunks(id, file, chunks, total, index, next, types);
      }
    },
    error => {
      console.error(error);
      next({ type: types[2], id: id, file: file, error: error.message });
    }
  );
};

const sendFile = (
  id: number,
  file: File,
  chunk: Blob,
  total: number,
  index: number
) => {
  const bodyFormData = new FormData();
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  cancelTokens[id] = source;

  bodyFormData.set("filename", file.name);
  bodyFormData.set("id", `${id}`);
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

  let { file, id, types } = api;
  let [requestType, successType, errorType] = types;

  try {
    switch (requestType) {
      case ActionTypes.UPLOAD_REQUEST:
        next({
          type: requestType,
          id: id,
          file: file
        });
        checkFile(file);
        processFile(id, file, next, types);
        break;
      case ActionTypes.ABORT_REQUEST:
        cancelTokens[id].cancel("canceled");
    }
  } catch (e) {
    console.error(e);
    next({ type: errorType, id: id, file: file, error: e.message });
  }
};
