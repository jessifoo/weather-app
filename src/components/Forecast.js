import React from 'react';
import PropTypes from 'prop-types';

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import WeatherApi from '../lib/WeatherApi';
import WeatherContainer from './WeatherContainer';
import LocalStorage from '../lib/LocalStorage';

/**
 *  Forecast handles all weather searching and loading of weather containers
 */
export default class Forecast extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleAddFavourite = this.handleAddFavourite.bind(this);
    this.handleRemoveFavourite = this.handleRemoveFavourite.bind(this);
    this.handleTemperatureUnitChange = this.handleTemperatureUnitChange.bind(
      this
    );

    this.state = {
      weatherList: [],
      city: 'Edmonton',
      value: '',
      error: '',
      favourites: [],
      tempUnit: 1
    };
  }

  componentDidMount() {
    const favourites = LocalStorage.getItem('favourites');
    this.setState({ favourites });
  }

  /**
   * Handle focus event for form input
   * @param event
   */
  handleFocus(event) {
    if (this.state.error !== '') {
      // eslint-disable-next-line no-param-reassign
      event.target.value = '';
      this.setState({ error: '' });
    }
    event.preventDefault();
  }

  /**
   * Add a city to list of favourites
   * @param event
   * @param city
   */
  handleAddFavourite(event, city) {
    if (this.state.favourites.indexOf(city) === -1) {
      const { favourites } = this.state;
      favourites.unshift(city);
      LocalStorage.setItem('favourites', favourites);
      this.setState({ favourites });
    }
    event.preventDefault();
  }

  /**
   * Remove city from list of favourites
   * @param event
   * @param city
   */
  handleRemoveFavourite(event, city) {
    const { favourites } = this.state;
    const index = favourites.indexOf(city);
    if (index !== -1) {
      favourites.splice(index, 1);
    }
    LocalStorage.setItem('favourites', favourites);
    this.setState({ favourites });
    event.preventDefault();
  }

  /**
   * Handle city search submit
   * @param event
   */
  handleSubmit(event) {
    const inputVal = event.target.city.value;

    // Taken from https://stackoverflow.com/a/25677072
    const cityPattern = /^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/i;
    if (cityPattern.test(inputVal)) {
      this.setState({ city: inputVal });
    } else {
      this.setState({
        error: 'Please enter a valid city'
      });
    }

    event.preventDefault();
  }

  /**
   * Change temperature from Celsius to Fahrenheit and vice versa
   * @param val
   */
  handleTemperatureUnitChange(val) {
    if (this.state.tempUnit !== val) {
      this.setState({ tempUnit: val });
    }
  }

  /**
   * @param error
   */
  handleError(error) {
    this.setState({ error });
  }

  render() {
    return (
      <div className="forecast">
        <Form className="weather-form" onSubmit={this.handleSubmit}>
          <Form.Row>
            <Col sm={8}>
              <Form.Control
                type="text"
                name="city"
                placeholder="City"
                onFocus={this.handleFocus}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid city.
              </Form.Control.Feedback>
            </Col>
            <Col sm={4}>
              <Button type="submit">Search</Button>
            </Col>
          </Form.Row>
          <Form.Row>
            {this.state.error ? (
              <Alert variant="danger">{this.state.error}</Alert>
            ) : (
              ''
            )}
          </Form.Row>
        </Form>
        <ToggleButtonGroup
          type="radio"
          name="tempUnits"
          value={this.state.tempUnit}
          onChange={this.handleTemperatureUnitChange}
        >
          <ToggleButton value={1}>C&deg;</ToggleButton>
          <ToggleButton value={2}>F&deg;</ToggleButton>
        </ToggleButtonGroup>
        <WeatherContainer
          city={this.state.city}
          isFavourite={false}
          handleAddFavourite={event =>
            this.handleAddFavourite(event, this.state.city)
          }
          handleRemoveFavourite={event =>
            this.handleRemoveFavourite(event, this.state.city)
          }
          handleError={this.handleError}
          weatherApi={this.props.weatherApi}
          tempUnit={this.state.tempUnit}
        />
        {this.state.favourites && this.state.favourites.length > 0 && (
          <div className="favourites">
            <h2>Favourites</h2>
            {this.state.favourites.map(city => (
              <WeatherContainer
                key={city}
                city={city}
                isFavourite={true}
                handleAddFavourite={event =>
                  this.handleAddFavourite(event, city)
                }
                handleRemoveFavourite={event =>
                  this.handleRemoveFavourite(event, city)
                }
                handleError={this.handleError}
                weatherApi={this.props.weatherApi}
                tempUnit={this.state.tempUnit}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
}
Forecast.propTypes = {
  weatherApi: PropTypes.instanceOf(WeatherApi)
};
