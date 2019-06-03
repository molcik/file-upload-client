import axios, { AxiosError, AxiosResponse, CancelTokenSource } from "axios";
import { AnyAction, Dispatch, MiddlewareAPI } from "redux";
import { ActionTypes } from "../constants";
import crcWorker from "../services/crc.worker";
import splitWorker from "../services/split.worker";
import WebWorker from "../services/WebWorker";
import { IProcessedFile } from "./types";

export const UPLOAD_API = "UPLOAD_API";

const processedFiles: IProcessedFile[] = [];

const getPercentage = (processedFile: IProcessedFile) => {
  return Math.ceil(
    ((processedFile.index + 1) / processedFile.totalChunks) * 100
  );
};

const checkFile = (file: File) => {
  if (file.size > 5e8) {
    throw new Error("file size exceeded (500MB)");
  }
};

// split file to chunks and
const processFile = async (
  processedFile: IProcessedFile,
  next: Dispatch,
  crcFile: WebWorker,
  splitFile: WebWorker
) => {
  const data = await splitFile.process(processedFile.file);
  splitFile.terminate();
  processedFile.chunks = data.chunks;
  processedFile.totalChunks = data.totalChunks;
  processChunks(processedFile, next, crcFile);
};

// sending chunks recursively, also handles progress and errors
const processChunks = async (
  processedFile: IProcessedFile,
  next: Dispatch,
  crcFile: WebWorker
) => {
  sendChunk(processedFile, crcFile).then(
    res => handleResponse(res, processedFile, next, crcFile),
    error => handleError(error, processedFile, next, crcFile)
  );
};

const handleResponse = (
  res: AxiosResponse,
  processedFile: IProcessedFile,
  next: Dispatch,
  crcFile: WebWorker
) => {
  next({
    id: processedFile.id,
    progress: getPercentage(processedFile),
    type: processedFile.types[1],
    url: res.data.permanent || null
  });
  if (
    processedFile.index < processedFile.totalChunks - 1 &&
    !processedFile.cancelToken.token.reason
  ) {
    processedFile.index++;
    processChunks(processedFile, next, crcFile);
  } else {
    crcFile.terminate();
  }
};

const handleError = (
  error: AxiosError,
  processedFile: IProcessedFile,
  next: Dispatch,
  crcFile: WebWorker
) => {
  crcFile.terminate();
  next({
    error: error.message,
    id: processedFile.id,
    type: processedFile.types[2]
  });
};

// handle sending, counting CRC and canceling of file chunk
const sendChunk = async (processedFile: IProcessedFile, crcFile: WebWorker) => {
  const bodyFormData = new FormData();
  processedFile.md5 = await crcFile.process(
    processedFile.chunks[processedFile.index]
  );
  bodyFormData.set("filename", processedFile.file.name);
  bodyFormData.set("id", `${processedFile.id}`);
  bodyFormData.set("md5", `${processedFile.md5}`);
  bodyFormData.set("index", `${processedFile.index}`);
  bodyFormData.set("total", `${processedFile.totalChunks}`);
  bodyFormData.append("file", processedFile.chunks[processedFile.index]);
  return axios.post(
    process.env.REACT_APP_ENDPOINT_UPLOAD || "localhost:3001/upload",
    bodyFormData,
    {
      cancelToken: processedFile.cancelToken.token,
      headers: { "Content-Type": "multipart/form-data" }
    }
  );
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
  const fileSplit = new WebWorker(splitWorker) as any; // every file has its own worker
  const fileCrc = new WebWorker(crcWorker) as any; // every file has its own worker
  const cancelToken = axios.CancelToken.source();
  const processedFile = {
    cancelToken,
    chunks: [],
    file,
    id,
    index: 0,
    md5: "",
    totalChunks: 0,
    types
  };

  try {
    switch (requestType) {
      case ActionTypes.UPLOAD_REQUEST:
        next({ file, id, type: requestType });
        checkFile(file);
        // split to chunks, upload and count CRC one by one
        processFile(processedFile, next, fileCrc, fileSplit);
        processedFiles.push(processedFile);
        console.log("upload");
        break;
      case ActionTypes.ABORT_REQUEST:
        const fileToCancel = processedFiles.find(item => item.id === id);
        if (fileToCancel) fileToCancel.cancelToken.cancel("canceled");
    }
  } catch (e) {
    next({ type: errorType, id, file, error: e.message });
  }
};
