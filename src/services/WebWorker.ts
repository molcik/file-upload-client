export default class WebWorker {
  private worker: Worker;

  constructor(worker: any, lib?: any) {
    const code = worker.toString();
    if (lib) {
      lib = lib.toString();
    }
    const blob = new Blob(["(" + code + ")(" + lib + ")"]);
    this.worker = new Worker(URL.createObjectURL(blob));
  }

  public async process(data: any): Promise<any> {
    const result: Promise<any> = new Promise<any>((resolve, reject) => {
      this.worker.postMessage(data);
      this.worker.onmessage = (e: MessageEvent) => {
        resolve(e.data);
      };
    });
    return result;
  }

  public terminate(): void {
    this.worker.terminate();
  }
}
