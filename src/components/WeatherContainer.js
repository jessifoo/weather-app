import React from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import Tooltip from 'react-tooltip-lite';
import * as utils from '../lib/utils';
import WeatherApi from '../lib/WeatherApi';

/**
 *  WeatherContainer shows a five day forecast for a city
 */
export default class WeatherContainer extends React.Component {
  /**
   * @type {WeatherApi}
   */
  weatherApi = null;

  constructor(props) {
    super(props);
    this.weatherApi = this.props.weatherApi;

    this.state = {
      weatherList: [],
      city: '',
      error: '',
      isLoading: true
    };
  }

  /**
   * Get the weather forecast for a given city
   * @param {string} city
   */
  async getWeatherForecast(city) {
    this.setState({ isLoading: true });
    if (!city) {
      return;
    }

    let weatherList;
    try {
      weatherList = await this.weatherApi.getForecast(city);
    } catch (error) {
      this.props.handleError(
        "Sorry, that city wasn't found, try adding a country after a comma"
      );
      return;
    }

    /**
     * @typedef {Object} DailyForecast
     * @property {number[]} hourlyTemps
     * @property {number} minTemp
     * @property {number} maxTemp
     * @property {string[]} weatherConditions
     * @property {number} averageTemp
     * @property {string} mostFrequentWeatherCondition
     */

    /**
     * @type {Object.<string, DailyForecast>}
     */
    const dailyForecasts = {
      // 'Feb 7 2020': {
      //   hourlyTemps: [],
      //   min: 123,
      //   max: 123,
      //   weatherConditions: [],
      //   averageTemp: 123,
      //   mostFrequentWeatherCondition: clouds
      // },
    };

    // The weather list comes in a list of weather data every 3 hours, starting from now, for five days
    // This function converts the results into 5 days of values
    weatherList.forEach(item => {
      const dayString = `${new Date(item.timestamp * 1000).toLocaleString(
        'default',
        {
          month: 'long'
        }
      )} ${new Date(item.timestamp * 1000).getDate()}, ${new Date(
        item.timestamp * 1000
      ).getFullYear()}`;

      if (!dailyForecasts[dayString]) {
        dailyForecasts[dayString] = {
          hourlyTemps: [],
          minTemp: null,
          maxTemp: null,
          weatherConditions: [],
          averageTemp: null,
          mostFrequentWeatherCondition: null
        };
      }
      dailyForecasts[dayString].hourlyTemps.push(item.temp);

      if (
        !dailyForecasts[dayString].minTemp ||
        item.temp_min < dailyForecasts[dayString].minTemp
      ) {
        dailyForecasts[dayString].minTemp = item.temp_min;
      }
      if (
        !dailyForecasts[dayString].maxTemp ||
        item.temp_max > dailyForecasts[dayString].maxTemp
      ) {
        dailyForecasts[dayString].maxTemp = item.temp_max;
      }
      dailyForecasts[dayString].weatherConditions.push(item.weather);
    });

    for (const day in dailyForecasts) {
      const averageDailyTemp = utils.arrayAverage(
        dailyForecasts[day].hourlyTemps
      );
      dailyForecasts[day].averageTemp = averageDailyTemp;
      dailyForecasts[
        day
      ].mostFrequentWeatherCondition = utils.mostFrequentElementInArray(
        dailyForecasts[day].weatherConditions
      );
    }

    this.setState({
      weatherList: dailyForecasts,
      city,
      isLoading: false
    });
  }

  componentDidMount() {
    this.getWeatherForecast(this.props.city);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.city !== this.props.city) {
      this.getWeatherForecast(this.props.city);
    }
  }

  /**
   * Convert from Celsius to Fahrenheit
   * @param {number} temp
   * @param {number} unit 1 = Celsius and 2 = Fahrenheit
   * @returns {number}
   */
  convertTempUnits(temp, unit) {
    if (unit === 2) {
      return temp * 1.8 + 32;
    }
    return temp;
  }

  render() {
    return (
      <div className="weather-container">
        {!this.state.isLoading && (
          <div>
            <div className="city-heading">
              <h3>{this.props.city}</h3>
              {this.props.isFavourite ? (
                <Tooltip
                  content="Remove from favourites"
                  direction="right"
                  useDefaultStyles={true}
                >
                  <span
                    className="minus-favourite"
                    onClick={event =>
                      this.props.handleRemoveFavourite(event, this.props.city)
                    }
                  >
                    <FontAwesomeIcon icon={faMinusCircle} />
                  </span>
                </Tooltip>
              ) : (
                <Tooltip
                  content="Save to favourites"
                  direction="right"
                  useDefaultStyles={true}
                >
                  <span
                    className="add-favourite"
                    onClick={event =>
                      this.props.handleAddFavourite(event, this.props.city)
                    }
                  >
                    <FontAwesomeIcon icon={faPlusCircle} />
                  </span>
                </Tooltip>
              )}
            </div>
            <div className="weather-container-row">
              {Object.keys(this.state.weatherList).map(day => (
                <div key={day}>
                  <div
                    className={`weather-box ${this.state.weatherList[
                      day
                    ].mostFrequentWeatherCondition.toLowerCase()}`}
                    data-testid="weather-box"
                  >
                    <div className="date">{day}</div>
                    <div className="high-temp">
                      {this.convertTempUnits(
                        this.state.weatherList[day].maxTemp,
                        this.props.tempUnit
                      ).toFixed(0)}
                      &deg;{this.props.tempUnit === 1 ? 'C' : 'F'}
                    </div>
                    <div>
                      Night:{' '}
                      {this.convertTempUnits(
                        this.state.weatherList[day].minTemp,
                        this.props.tempUnit
                      ).toFixed(0)}
                      &deg;{this.props.tempUnit === 1 ? 'C' : 'F'}
                    </div>
                    <div>
                      Average:{' '}
                      {this.convertTempUnits(
                        this.state.weatherList[day].averageTemp,
                        this.props.tempUnit
                      ).toFixed(0)}
                      &deg;{this.props.tempUnit === 1 ? 'C' : 'F'}
                    </div>
                    <div>
                      {this.state.weatherList[day].mostFrequentWeatherCondition}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}
WeatherContainer.defaultProps = {
  city: 'Edmonton',
  tempUnit: 1
};
WeatherContainer.propTypes = {
  city: PropTypes.string,
  weatherApi: PropTypes.instanceOf(WeatherApi),
  tempUnit: PropTypes.number,
  handleRemoveFavourite: PropTypes.func,
  handleAddFavourite: PropTypes.func,
  handleError: PropTypes.func,
  isFavourite: PropTypes.bool
};
