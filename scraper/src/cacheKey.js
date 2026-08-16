function createDetailCacheFile(url) {
  const urlObject = new URL(url);

  const pathname = urlObject.pathname
    .replace(/^\/+/, "")
    .replace(/\/+$/, "")
    .replace(/\//g, "_")
    .replace(/[^a-zA-Z0-9_-]/g, "_");

  return `detail-${pathname}.html`;
}

module.exports = {
  createDetailCacheFile,
};