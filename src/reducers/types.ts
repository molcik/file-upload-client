export interface IFilesState {
  files: IFile[];
}

export interface IFile {
  progress?: number;
  name: string;
  size: number;
  type?: string;
  error?: string;
}
