import React, { useState } from "react";

const api = {
  key: "63ab5b543a9a8b6a21c5a1214e0e2caf",
  base: "https://api.openweathermap.org/data/2.5/"
};

const dateBuilder = (d) => {
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day} ${date} ${month} ${year}`;
};

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = (evt) => {
    if (evt.key === 'Enter') {
      setLoading(true);
      setError(null);

      Promise.all([
        fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`).then((res) => res.json()),
        fetch(`${api.base}forecast?q=${query}&units=metric&APPID=${api.key}`).then((res) => res.json())
      ])
        .then(([currentWeather, forecastData]) => {
          setWeather(currentWeather);
          setQuery('');

          const dailyForecast = forecastData.list.filter(entry => entry.dt_txt.includes("12:00:00"));

          setForecast(dailyForecast);
        })
        .catch((error) => {
          setError(<div className="err">This location does not exist. Look for something else.</div>);

          if (error.message === 'Location not found') {
            alert('This location does not exist. Look for something else.');
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

 

  return (
    <div className="app">
      <main>
        <div className="title">Enter a city to see the humidity percentage</div>
        <div className="search-box">
          <input
            type="text"
            className="search-bar"
            placeholder="Search..."
            onChange={(e) => setQuery(e.target.value)}
            value={query}
            onKeyPress={search}
          />
        </div>
        {loading && <div className="loading-spinner"></div>}
        {error && <div>{error}</div>}
        {typeof weather.main !== 'undefined' && !loading && !error && (
          <div>
            <div className="location-box">
              <div className="location">
                {weather.name}, {weather.sys.country}
              </div>
              <div className="date">{dateBuilder(new Date())}</div>
            </div>
            <div className="weather-box">
              {weather.main.humidity > 70 ? (
                <div className="emoji" role="img" aria-label="Sad Face">
                  😟
                </div>
              ) : (
                <div className="emoji" role="img" aria-label="Happy Face">
                  😊
                </div>
              )}
              <div className="temp">{weather.main.humidity}% humidity</div>
              <div className="weather">{weather.weather[0].main}</div>
            </div>
            <div className="forecast-box">
              <h2>7-Day Forecast</h2>
              <ul>
                {forecast.map((entry) => (
                  <li key={entry.dt}>
                    {`Day: ${entry.dt_txt.slice(8, 10)}.${entry.dt_txt.slice(5, 7)} ${dateBuilder(new Date(entry.dt_txt))}: ${entry.main.humidity}% humidity`}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
