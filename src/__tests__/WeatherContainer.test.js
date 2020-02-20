import React from 'react';
import { render } from '@testing-library/react';

import WeatherContainer from '../components/WeatherContainer';
import WeatherApi from '../lib/WeatherApi';

import mockData from './mockForecastData.json';

jest.mock('../lib/WeatherApi');

describe('Weather Container', () => {
  it('should render', async () => {
    const weatherApi = new WeatherApi('random');
    const mockGetForecast = jest.fn();
    weatherApi.getForecast = mockGetForecast;
    mockGetForecast.mockReturnValue(Promise.resolve(mockData));

    const { getByText } = render(
      <WeatherContainer
        city={'Edmonton'}
        isFavourite={false}
        handleAddFavourite={jest.fn()}
        handleRemoveFavourite={jest.fn()}
        weatherApi={weatherApi}
      />
    );

    await new Promise(resolve => setImmediate(resolve));

    expect(weatherApi.getForecast).toHaveBeenCalled();
    expect(getByText('Edmonton')).toBeInTheDocument();
    expect(getByText('February 20, 2020')).toBeInTheDocument();
  });
});
