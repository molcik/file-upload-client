import { CancelTokenSource } from "axios";

export interface IProcessedFile {
  id: number;
  file: File;
  chunks: Blob[];
  totalChunks: number;
  index: number;
  types: any[];
  md5: string;
  cancelToken: CancelTokenSource;
}
