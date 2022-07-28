const spliceChunks = (data) => {
  let chunks = [];

  const splice = (data) => {
    if (data.length > 30) {
      chunks = [...chunks, data.splice(0, 30)];
      return splice(data);
    }
    return [...chunks, data];
  }

  return splice(data);
}

module.exports = spliceChunks;
