// Load polyfills for IE Array.prototype.fill and Object.entries
require('./iePolyfills')();

/**
 * Returns a comparison function used to compare entries during ranking
 *
 * @param {boolean} reverse ranking in ascending order if true, descending order otherwise
 * @returns {function} the comparison function takes 2 params and return a signed number
 */
function getCompareFn(reverse) {
  if (reverse) return (a, b) => a[0] - b[0];
  return (a, b) => b[0] - a[0];
}

/**
 * Returns a ranking function. There are 5 ranking methods as explained at
 * https://en.wikipedia.org/wiki/Ranking#Strategies_for_assigning_rankings

 * @param {string} strategy used for ranking.
 * @returns {function} ranking function
 */
function getRankingFn(strategy) {
  if (strategy === 'modified-competition') {
    // Modified competition ranking ("1334" ranking)
    return (start, length) => ({
      current: Array(length).fill(start + (length - 1)),
      next: start + length,
    });
  }

  if (strategy === 'dense') {
    // Dense ranking ("1223" ranking)
    return (start, length) => ({
      current: Array(length).fill(start),
      next: start + 1,
    });
  }

  if (strategy === 'ordinal') {
    // Ordinal ranking ("1234" ranking)
    return (start, length) => ({
      current: Array(length).fill(null).map((_, i) => start + i),
      next: start + length,
    });
  }

  if (strategy === 'fractional') {
    // Fractional ranking ("1 2.5 2.5 4" ranking)
    return (start, length) => ({
      current: Array(length).fill(start + ((length - 1) / 2)),
      next: start + length,
    });
  }

  // Standard competition ranking ("1224" ranking)
  return (start, length) => ({
    current: Array(length).fill(start),
    next: start + length,
  });
}

module.exports = {

  /**
   * Assign ranking to every item of an array
   *
   * @param {array} items to be ranked
   * @param {function} scoreFn a function to extract the score from an item
   * @param {object} options optional parameters
   *   options.reverse: ranking in ascending order if true, descending order otherwise
   *   options.start: the first rank number. Default to 1
   *   options.strategy: to use for ranking. Valid values are:
   *     competition: Standard competition ranking ("1224" ranking)
   *     modified-competition: Modified competition ranking ("1334" ranking)
   *     dense: Dense ranking ("1223" ranking)
   *     ordinal: Ordinal ranking ("1234" ranking)
   *     fractional: Fractional ranking ("1 2.5 2.5 4" ranking)
   * @returns {array} items with their ranking
   */
  ranking(items, scoreFn, options) {
    const reverse = options && options.reverse !== undefined ? options.reverse : false;
    const strategy = options && options.strategy !== undefined ? options.strategy : 'competition';
    const start = options && options.start !== undefined ? options.start : 1;

    const compareFn = getCompareFn(reverse);
    const rankingFn = getRankingFn(strategy);

    let buckets = {};

    items.forEach((e) => {
      const score = scoreFn(e);
      if (buckets[score]) {
        buckets[score].push(e);
      } else {
        buckets[score] = [e];
      }
    });

    // convert to array for sorting
    buckets = Object.entries(buckets);

    // sort based on the score
    buckets.sort(compareFn);

    // assign ranks
    const ranked = [];
    let rank = { next: start };
    buckets.forEach((b) => {
      const bucket = b[1];
      rank = rankingFn(rank.next, bucket.length);
      bucket.forEach((item, index) => {
        ranked.push({ rank: rank.current[index], item });
      });
    });

    return ranked;
  },
};
