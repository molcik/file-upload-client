export default () => {
  importScripts(
    "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/md5.js" // TODO: use webpack import
  );
  self.addEventListener("message", e => {
    if (!e.data) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      // @ts-ignore
      const hash = CryptoJS.MD5(reader.result).toString(CryptoJS.enc.Hex);
      postMessage(hash);
    };
    reader.readAsBinaryString(e.data);
  });
};
