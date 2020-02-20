import axios from 'axios';

/**
 * @typedef {Object} WeatherSegment
 * @property {number} timestamp
 * @property {number} temp
 * @property {number} temp_min
 * @property {number} temp_max
 * @property {string} weather
 */

/**
 * @typedef {Object} OpenWeatherApiSegment
 * @property {number} dt
 * @property {Object} main
 * @property {number} main.temp
 * @property {number} main.temp_min
 * @property {number} main.temp_max
 * @property {{main: string}[]} weather
 */

export default class WeatherApi {
  apiKey = '';

  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  /**
   * @param {{ data: { list: OpenWeatherApiSegment[] } }} response
   * @returns {WeatherSegment[]}
   */
  static convertOpenWeatherApiResponse(response) {
    return response.data.list.map(segment => {
      return {
        timestamp: segment.dt,
        temp: segment.main.temp,
        temp_min: segment.main.temp_min,
        temp_max: segment.main.temp_max,
        weather: segment.weather[0].main
      };
    });
  }

  /**
   * Fetches the weather forecast every 3 hours starting from now for 5 days in Celsius
   * @param {string} city
   * @return {Promise<WeatherSegment[]>}
   */
  async getForecast(city) {
    /**
     * @type {{ data: { list: OpenWeatherApiSegment[] } }}
     */
    const resp = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city},ca&appid=${this.apiKey}&units=metric`
    );
    return WeatherApi.convertOpenWeatherApiResponse(resp);
  }
}
