import React, { useState, useEffect, useRef } from "react";
import "./css/style.css";
import "./css/null.css";
import "./css/container.css";
import { cities } from "./database/cities";
import { users as initialUsers } from "./database/users";
import TripForecast from "./components/trip-forecast";
import DayForecast from "./components/day-forecast";
import AddTrip from "./components/add-trip";
import SearchTrip from "./components/search-trip";
import TripTimer from "./components/trip-timer";
import NextPrevButtons from "./components/next-prev-buttons";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  googleLogout,
} from "@react-oauth/google";

googleLogout();
const imageUrl = (cityName) =>
  `./images/cities/${cityName.toLowerCase().replace(/\s+/g, "-")}-img.jpg`;

const citiesWithImages = cities.map((city) => ({
  ...city,
  image: imageUrl(city.name),
}));

const MyApp = () => {
  const tripsListRef = useRef(null); // Створюємо референцію на список подорожей
  const [showNextPrevButtons, setShowNextPrevButtons] = useState(false);
  const [users, setUsers] = useState(initialUsers);
  const [weatherData, setWeatherData] = useState(null);
  const [weatherData2, setWeatherData2] = useState({ data: null, city: null }); // Додали другий стан для другого набору даних про погоду
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Додаємо стан для відстеження авторизації

  useEffect(() => {
    const tripsList = tripsListRef.current;
    if (tripsList) {
      setShowNextPrevButtons(tripsList.scrollWidth > tripsList.clientWidth);
    }
  }, [tripsListRef, users]);

  useEffect(() => {
    const tripsList = tripsListRef.current;
    if (tripsList) {
      // Перевіряємо, чи є горизонтальна прокрутка
      setShowNextPrevButtons(tripsList.scrollWidth > tripsList.clientWidth);
    }
  }, [tripsListRef, users]);

  const handleClick = async (event) => {
    const tripItems = document.querySelectorAll(".trips__item");
    tripItems.forEach((item) => {
      item.classList.remove("trips__item-active");
    });
    event.currentTarget.classList.add("trips__item-active");
    const tripId = event.currentTarget.id.replace("trip-", "");
    const foundTrip = users.flatMap((user) =>
      user.trips.find((trip) => trip.tripId === tripId)
    );

    if (foundTrip) {
      const { city, date1, date2 } = foundTrip[0];

      const formattedDate1 = `${date1.substring(6)}-${date1.substring(
        3,
        5
      )}-${date1.substring(0, 2)}`;
      const formattedDate2 = `${date2.substring(6)}-${date2.substring(
        3,
        5
      )}-${date2.substring(0, 2)}`;

      const today = new Date();
      const formattedToday = today.toISOString().split("T")[0]; // Отримуємо сьогоднішню дату у форматі 'YYYY-MM-DD'

      const apiUrlTrip = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/${formattedDate1}/${formattedDate2}/?iconSet=icons1&key=7XV9LX6FD25HCTATDBNXPUMLH`;
      const apiUrlDay = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/${formattedToday}/?iconSet=icons1&key=7XV9LX6FD25HCTATDBNXPUMLH`;

      try {
        const response1 = await fetch(apiUrlTrip);
        const response2 = await fetch(apiUrlDay);

        if (response1.ok && response2.ok) {
          const weatherData1 = await response1.json();
          const weatherData2 = await response2.json();
          // Обробка даних з першого запиту
          setWeatherData(weatherData1);

          // Обробка даних з другого запиту
          setWeatherData2({ data: weatherData2, city }); // Передача даних та назви міста
        } else {
          console.error("Failed to fetch weather data");
        }
      } catch (error) {
        console.error("Error fetching weather data:", error.message);
      }
    }
  };

  localStorage.setItem("users", JSON.stringify(users));
  let storedUsers = JSON.parse(localStorage.getItem("users"));
  console.log(storedUsers);

  // Сортуємо елементи за датою date1 перед відображенням
  const sortedTripsListItems = users
    .flatMap((user) =>
      user.trips.map(({ city, date1, date2, tripId }) => ({
        city,
        date1: new Date(
          `${date1.substring(6)}-${date1.substring(3, 5)}-${date1.substring(
            0,
            2
          )}`
        ),
        tripId,
      }))
    )
    .sort((a, b) => a.date1 - b.date1)
    .map(({ city, tripId }) => {
      const cityData = citiesWithImages.find((c) => c.name === city);
      const imageUrl = cityData ? cityData.image : "";
      const trip = users.flatMap((user) =>
        user.trips.find((trip) => trip.tripId === tripId)
      );
      const dates = `${trip[0].date1} - ${trip[0].date2}`;
      return (
        <li
          className="trips__item"
          key={tripId}
          id={`trip-${tripId}`}
          onClick={handleClick}
        >
          <img src={imageUrl} alt={city} className="trips__image" />
          <div className="trips__text-wrap">
            <h4 className="trips__title">{city}</h4>
            <div className="trips__date">{dates}</div>
          </div>
        </li>
      );
    });

  return (
    <GoogleOAuthProvider clientId="219682125772-d93t2dm4i6e12b1ev44jn7sv7s1bm07k.apps.googleusercontent.com">
      {isAuthenticated ? ( // Перевіряємо, чи користувач авторизований
        <div className="container trips-weather__container">
          <div className="trips-weather__left">
            <h1>Weather Forecast</h1>
            <SearchTrip />
            <div className="trips__wrapper">
              <div className="trips__list-wrap">
                <ul className="trips__list" ref={tripsListRef}>
                  {sortedTripsListItems}
                </ul>
                {showNextPrevButtons && <NextPrevButtons />}
              </div>
              <AddTrip users={users} setUsers={setUsers} />
            </div>
            {weatherData && <TripForecast weatherData={weatherData} />}
          </div>
          <div className="trips-weather__right">
            {weatherData2.data && (
              <DayForecast
                weatherData={weatherData2.data}
                cityName={weatherData2.city}
              />
            )}
            <TripTimer />
          </div>
        </div>
      ) : (
        // Якщо користувач не авторизований, показуємо кнопку авторизації
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            console.log(credentialResponse);
            setIsAuthenticated(true); // Встановлюємо isAuthenticated в true після успішної авторизації
          }}
          onError={() => {
            console.log("Login Failed");
          }}
          useOneTap
        />
      )}
    </GoogleOAuthProvider>
  );
};

export default MyApp;
