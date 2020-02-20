/**
 * Wrapper for LocalStorage for easier testing
 */
export default class LocalStorage {
  /**
   * @param {string} key
   * @returns {string[]}
   */
  static getItem(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
  }

  /**
   * @param {string} key
   * @param {*[]} value
   */
  static setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
