const dateSplitter = '/';
const pairSplitter = '-';
const pairsSplitter = '. '
const datePosition = 0

const split = (date, splitter, position = 0) => date.split(splitter)[position];

const groupDates = (dates) => {
  return dates.reduce((acc, item) => {
    const pairs = acc.split(pairsSplitter);
    const lastPair = pairs[pairs.length - 1];
    const isLastPair = lastPair.split(pairSplitter).length === 2;
    const lastDay = isLastPair ? split(lastPair, pairSplitter, 1) : lastPair;

    if (split(item, dateSplitter, datePosition) - split(lastDay, dateSplitter, datePosition) !== 1) {
      return acc + pairsSplitter + item;
    }

    pairs[pairs.length - 1] = isLastPair 
      ? [split(lastPair, pairSplitter), item].join(pairSplitter) 
      : [lastDay, item].join(pairSplitter);
    return pairs.join(pairsSplitter);
  });
}

module.exports = groupDates;
