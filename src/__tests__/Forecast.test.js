import React from 'react';
import { render } from '@testing-library/react';
import Forecast from '../components/Forecast';
import WeatherApi from '../lib/WeatherApi';
import LocalStorage from '../lib/LocalStorage';

import mockData from './mockForecastData.json';

jest.mock('../lib/WeatherApi');

jest.mock('../lib/LocalStorage');

describe('Forecast', () => {
  it('Should render', async () => {
    const weatherApi = new WeatherApi('random');
    const mockGetForecast = jest.fn();
    weatherApi.getForecast = mockGetForecast;
    mockGetForecast.mockReturnValue(Promise.resolve(mockData));

    const { getByText } = render(<Forecast weatherApi={weatherApi} />);

    await new Promise(resolve => setImmediate(resolve));

    expect(weatherApi.getForecast).toHaveBeenCalled();
    expect(getByText('Search')).toBeInTheDocument();
    expect(getByText('Edmonton')).toBeInTheDocument();
    expect(getByText('February 20, 2020')).toBeInTheDocument();
  });

  it('Should render favourites', async () => {
    const favourites = ['Edmonton'];

    const mockGetItem = jest.fn();
    LocalStorage.getItem = mockGetItem;
    mockGetItem.mockReturnValue(favourites);

    const weatherApi = new WeatherApi('random');
    const mockGetForecast = jest.fn();
    weatherApi.getForecast = mockGetForecast;
    mockGetForecast.mockReturnValue(Promise.resolve(mockData));

    const { getByText, getAllByText } = render(
      <Forecast weatherApi={weatherApi} />
    );

    await new Promise(resolve => setImmediate(resolve));

    expect(getAllByText('Edmonton')).toHaveLength(2);
    expect(getByText('Favourites')).toBeInTheDocument();
  });
});
