export interface IProcess {
  (
    filename: string,
    file: File,
    metadata: any,
    error: IError,
    progress: IProgress,
    abort: IAbort,
    load: ILoad
  ): void;
}

export interface IServer {
  process: IProcess;
  revert?: string;
  restore?: string;
  load?: string;
  fetch?: string;
}

export interface IError {
  (e: string): void;
}

export interface IProgress {
  (lengthComputable: boolean, loaded: number, total: number): void;
}

export interface ILoad {
  (text: string): void;
}

export interface IAbort {
  (): void;
}
