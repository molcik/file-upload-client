export default () => {
  importScripts(
    "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/md5.js" // TODO: using webpack import require eject, find out better way
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
