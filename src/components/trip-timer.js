import React, { useState, useEffect } from "react";
import { users } from "../database/users";

const TripTimer = () => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    let intervalId; // Змінна для зберігання ідентифікатору інтервалу

    const handleClick = (event) => {
      const tripsItem = event.target.closest(".trips__item");
      // Перевіряємо, чи знайдено елемент з класом trips-item
      if (tripsItem) {
        const tripId = tripsItem.id.split("-")[1]; // Отримання id подорожі

        // Пошук подорожі з таким же tripId в масиві users
        const trip = users.reduce((foundTrip, user) => {
          if (!foundTrip) {
            return user.trips.find((t) => t.tripId === tripId);
          }
          return foundTrip;
        }, null);

        // Якщо подорож знайдена
        if (trip) {
          // Отримання сьогоднішньої дати
          const currentDate = new Date();
          // Парсинг дати початку подорожі
          const tripStartDateParts = trip.date1.split(".");
          const tripStartDate = new Date(
            parseInt(tripStartDateParts[2], 10),
            parseInt(tripStartDateParts[1], 10) - 1,
            parseInt(tripStartDateParts[0], 10)
          );

          // Обчислення різниці в мілісекундах
          const difference = tripStartDate - currentDate;

          // Перевірка, чи подорож вже почалася
          if (difference <= 0) {
            setTimeLeft("Ваша подорож відбудеться сьогодні");
            clearInterval(intervalId);
            return;
          }

          // Обчислення днів, годин, хвилин і секунд
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
            (difference % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);

          setTimeLeft({ days, hours, minutes, seconds });

          // Встановлення інтервалу тільки якщо подорож ще не почалася
          if (days !== 0 || hours !== 0 || minutes !== 0 || seconds !== 0) {
            clearInterval(intervalId);
            intervalId = setInterval(() => {
              const currentDate = new Date();
              const difference = tripStartDate - currentDate;

              // Обчислення днів, годин, хвилин і секунд
              const days = Math.floor(difference / (1000 * 60 * 60 * 24));
              const hours = Math.floor(
                (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
              );
              const minutes = Math.floor(
                (difference % (1000 * 60 * 60)) / (1000 * 60)
              );
              const seconds = Math.floor((difference % (1000 * 60)) / 1000);

              setTimeLeft({ days, hours, minutes, seconds });
            }, 1000); // 1000 мілісекунд = 1 секунда
          }
        }
      }
    };

    document.addEventListener("click", handleClick);
    // Під час вибуття компонента забираємо обробник події
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []); // Порожній масив означає, що цей ефект запускається лише один раз після монтування компонента

  return (
    <div className="trip-timer">
      {timeLeft && typeof timeLeft === "object" && (
        <div>
          <p>
            {timeLeft.days} <span>Days</span>
          </p>
          <p>
            {timeLeft.hours} <span>Hours</span>
          </p>
          <p>
            {timeLeft.minutes} <span>Minutes</span>
          </p>
          <p>
            {timeLeft.seconds} <span>Seconds</span>
          </p>
        </div>
      )}
      {timeLeft && typeof timeLeft === "string" && (
        <div>
          <p>{timeLeft}</p>
        </div>
      )}
    </div>
  );
};

export default TripTimer;
