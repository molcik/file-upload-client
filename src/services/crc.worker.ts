export default () => {
  importScripts(
    "https://cdn.jsdelivr.net/npm/js-md5@0.7.3/src/md5.min.js" // TODO: using webpack import require eject, find out better way
  );
  self.addEventListener("message", e => {
    if (!e.data) {
      return;
    }
    const reader = new FileReader();
    reader.onload = res => {
      // @ts-ignore
      const hash = md5(reader.result);
      postMessage(hash);
    };
    reader.readAsArrayBuffer(e.data);
  });
};
