const sliceChunks = (data) => {
  let chunks = [];

  const slice = (data) => {
    if (data.length > 30) {
      chunks = [...chunks, data.slice(0, 30)];
      return slice(data);
    }
    chunks = [...chunks, data];
  }

  return slice(data);
}

module.exports = sliceChunks;
