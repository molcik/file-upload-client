export default () => {
  self.addEventListener("message", e => {
    if (!e.data) return;

    let chunks = [];
    let blob = e.data;

    const BYTES_PER_CHUNK = 1024 * 1024; // 1MB chunk sizes.
    let realFileSize = blob.size;

    let start = 0;
    let end = BYTES_PER_CHUNK;

    let totalChunks = Math.ceil(realFileSize / BYTES_PER_CHUNK);

    while (start < realFileSize) {
      const chunk = blob.slice(start, end);
      chunks.push(chunk);
      start = end;
      end = start + BYTES_PER_CHUNK;
    }
    postMessage({ chunks: chunks, total: totalChunks });
  });
};