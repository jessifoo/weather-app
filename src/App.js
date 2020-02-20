import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import Forecast from './components/Forecast';
import WeatherApi from './lib/WeatherApi';

const weatherApi = new WeatherApi('3e76b8f85261f692f5b4390756569646');

function App() {
  return (
    <div className="app">
      <header className="app-header">Weather App</header>
      <Forecast weatherApi={weatherApi} />
    </div>
  );
}

export default App;
