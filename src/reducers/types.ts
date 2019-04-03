export interface IFilesState {
  files: IFile[];
}

export interface IFile {
  id: number;
  url?: string;
  progress: number;
  name: string;
  size: number;
  type?: string;
  error?: string;
}
