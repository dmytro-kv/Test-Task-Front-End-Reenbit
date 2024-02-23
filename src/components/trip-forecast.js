import React from "react";

const TripForecast = ({ weatherData }) => {
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
    <div className="trip-forecast__wrap">
      <h2 className="trip-forecast__title">Trip forecast</h2>
      <ul className="trip-forecast__list">
        {weatherData.days.map((day, index) => (
          <li key={index} className="trip-forecast__item">
            <h5 className="trip-forecast__item-title">
              {formatDate(day.datetime)}
            </h5>
            <div className="trip-forecast__icon">
              <img
                src={`./images/weather-icons/${day.icon}.svg`}
                alt="Weather Icon"
              />
            </div>
            <div className="trio-forecast__temp">
              {parseInt(convertToCelsius(day.tempmax), 10)}°/
              {parseInt(convertToCelsius(day.tempmin), 10)}°
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TripForecast;
