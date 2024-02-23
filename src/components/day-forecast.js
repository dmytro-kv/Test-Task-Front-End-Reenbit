import React from "react";

const DayForecast = ({ weatherData, cityName }) => {
  const city = weatherData.city;
  function convertToCelsius(fahrenheit) {
    return ((fahrenheit - 32) * 5) / 9;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: "long" };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  if (!weatherData || !weatherData.days) {
    return <div>Loading...</div>;
  }

  return (
    <div className="day-forecast__wrap">
      {weatherData.days.map((day, index) => (
        <div key={index} className="day-forecast__item">
          <h2 className="day-forecast__item-title">
            {formatDate(day.datetime)}
          </h2>
          <div className="day-forecast__temp">
            <div className="day-forecast__icon">
              <img
                src={`./images/weather-icons/${day.icon}.svg`}
                alt="Weather Icon"
              />
            </div>
            {parseInt(convertToCelsius(day.temp), 10)}
            <span className="day-forecast__temp-symbol">°C</span>
          </div>
          <h3 className="day-forecast__name">{cityName}</h3>
        </div>
      ))}
    </div>
  );
};

export default DayForecast;
