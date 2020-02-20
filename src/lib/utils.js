/**
 * @param {number[]} array
 * @return {number}
 */
export const arraySum = function arraySum(array) {
  return array.reduce((previous, current) => current + previous, 0);
};

/**
 * @param {number[]} array
 * @return {number}
 */
export const arrayAverage = function arrayAverage(array) {
  return array.length === 0 ? 0 : arraySum(array) / array.length;
};

/**
 * @param {Array} array
 * @return {*}
 */
export const mostFrequentElementInArray = function mostFrequentElementInArray(
  array
) {
  return array
    .sort(
      (a, b) =>
        array.filter(v => v === a).length - array.filter(v => v === b).length
    )
    .pop();
};
