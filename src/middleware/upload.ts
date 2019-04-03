import axios, { CancelTokenSource } from "axios";
import { AnyAction, Dispatch, MiddlewareAPI } from "redux";
import { ActionTypes } from "../constants";
import crcWorker from "../services/crc.worker";
import splitWorker from "../services/split.worker";
import WebWorker from "../services/WebWorker";

export const UPLOAD_API = "UPLOAD_API";

const cancelTokens: { [id: number]: CancelTokenSource } = {};
const fileCrc = new WebWorker(crcWorker) as any;
const fileSplit = new WebWorker(splitWorker) as any;

const getPercentage = (index: number, total: number) => {
  return Math.ceil(((index + 1) / total) * 100);
};

const checkFile = (file: File) => {
  if (file.size > 5e8) {
    throw new Error("file size exceeded (500MB)");
  }
};

const processFile = async (
  id: number,
  file: File,
  next: Dispatch,
  types: any[]
) => {
  const data = await fileSplit.process(file);
  next({ id, type: types[1], file, progress: 0 });
  processChunks(id, file, data.chunks, data.total, 0, next, types);
};

const processChunks = async (
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
        file,
        id,
        progress: getPercentage(index, total),
        type: types[1],
        url: res.data.permanent || null
      });
      if (index < total - 1 && !cancelTokens[id].token.reason) {
        index++;
        processChunks(id, file, chunks, total, index, next, types);
      }
    },
    error => {
      next({ type: types[2], id, file, error: error.message });
    }
  );
};

const sendFile = async (
  id: number,
  file: File,
  chunk: Blob,
  total: number,
  index: number
) => {
  const md5 = await fileCrc.process(chunk);
  const bodyFormData = new FormData();
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  cancelTokens[id] = source;

  bodyFormData.set("filename", file.name);
  bodyFormData.set("id", `${id}`);
  bodyFormData.set("md5", `${md5}`);
  bodyFormData.set("index", `${index}`);
  bodyFormData.set("total", `${total}`);
  bodyFormData.append("file", chunk);
  return axios.post("http://localhost:3001/upload", bodyFormData, {
    cancelToken: source.token,
    headers: { "Content-Type": "multipart/form-data" }
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

  const { file, id, types } = api;
  const [requestType, successType, errorType] = types;

  try {
    switch (requestType) {
      case ActionTypes.UPLOAD_REQUEST:
        next({ file, id, type: requestType });
        checkFile(file);
        processFile(id, file, next, types);
        break;
      case ActionTypes.ABORT_REQUEST:
        cancelTokens[id].cancel("canceled");
    }
  } catch (e) {
    next({ type: errorType, id, file, error: e.message });
  }
};
