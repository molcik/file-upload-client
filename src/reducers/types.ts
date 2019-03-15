export interface IFilesState {
  files: IFile[];
}

export interface IFile {
  id: number;
  progress: number;
  name: string;
  size: number;
  type?: string;
  error?: string;
}
