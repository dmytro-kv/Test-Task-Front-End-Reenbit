import React, { useState } from "react";
import { users } from "../database/users";
import { cities } from "../database/cities";

const AddTripPopup = ({ onClose, onSave }) => {
  const [city, setCity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [cityError, setCityError] = useState(false);
  const [startDateError, setStartDateError] = useState(false);
  const [endDateError, setEndDateError] = useState(false);

  // Функція для вибору лише наступних 15 днів починаючи з завтрашнього дня
  const getAvailableDates = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Додаємо 1 день до сьогоднішньої дати
    const availableDates = [];
    for (let i = 0; i < 15; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      availableDates.push(date.toISOString().split("T")[0]);
    }
    return availableDates;
  };

  const handleSave = () => {
    let valid = true;

    if (!city) {
      setCityError(true);
      valid = false;
    } else {
      setCityError(false);
    }

    if (!startDate) {
      setStartDateError(true);
      valid = false;
    } else {
      setStartDateError(false);
    }

    if (!endDate) {
      setEndDateError(true);
      valid = false;
    } else {
      setEndDateError(false);
    }

    // Перевірка на валідність дат
    const availableDates = getAvailableDates();
    const startDateValid = startDate && availableDates.includes(startDate);
    const endDateValid =
      endDate && availableDates.includes(endDate) && endDate >= startDate;

    if (!startDateValid) {
      setStartDateError(true);
      valid = false;
    }

    if (!endDateValid) {
      setEndDateError(true);
      valid = false;
    }

    if (!valid) {
      return;
    }

    // Генерація нового tripId
    const tripId =
      parseInt(
        users.flatMap((user) => user.trips.map((trip) => trip.tripId)).pop()
      ) + 1;

    function formatDate(date) {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${day < 10 ? "0" : ""}${day}.${
        month < 10 ? "0" : ""
      }${month}.${year}`;
    }

    // Перетворення початкової та кінцевої дат в новий формат
    const formattedStartDate = formatDate(new Date(startDate));
    const formattedEndDate = formatDate(new Date(endDate));

    // Збереження перетворених дат у відповідні поля
    onSave({
      tripId: tripId.toString(),
      city,
      date1: formattedStartDate,
      date2: formattedEndDate,
    });
  };

  return (
    <>
      <div className="create-trip-popup__overlay"></div>
      <div
        className={`create-trip-popup ${
          cityError || startDateError || endDateError
            ? "create-trip-popup-invalid"
            : ""
        }`}
        id="create-trip-popup"
      >
        <div className="create-trip-popup__header">
          <div className="create-trip-popup__wrapper">
            <h3 className="create-trip-popup__title">Create Trip</h3>
            <button
              onClick={onClose}
              className="create-trip-popup__close-button"
            >
              ×
            </button>
          </div>
        </div>
        <div className="create-trip-popup__body">
          <div className="create-trip-popup__input-group">
            <label htmlFor="city" className="create-trip-popup__label">
              City:
            </label>
            <select
              className={`create-trip-popup__select ${
                cityError ? "field-invalid" : ""
              }`}
              id="city"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setCityError(false);
              }}
            >
              <option value="">Select City</option>
              {cities
                .filter(
                  (c) =>
                    !users.some((user) =>
                      user.trips.some((trip) => trip.city === c.name)
                    )
                )
                .map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
            </select>
            {cityError && (
              <span className="create-trip-popup__invalid-alert">
                Please fill in this field
              </span>
            )}
          </div>
          <div className="create-trip-popup__input-group">
            <label htmlFor="startDate" className="create-trip-popup__label">
              Start Date:
            </label>
            <input
              className={`create-trip-popup__input ${
                startDateError ? "field-invalid" : ""
              }`}
              type="date"
              id="startDate"
              value={startDate}
              min={getAvailableDates()[0]} // Мінімальна доступна дата
              max={endDate || getAvailableDates()[14]} // Максимальна доступна дата (якщо вказано кінцеву дату)
              onChange={(e) => {
                setStartDate(e.target.value);
                setStartDateError(false);
              }}
            />
            {startDateError && (
              <span className="create-trip-popup__invalid-alert">
                Please fill in this field
              </span>
            )}
          </div>
          <div className="create-trip-popup__input-group">
            <label htmlFor="endDate" className="create-trip-popup__label">
              End Date:
            </label>
            <input
              className={`create-trip-popup__input ${
                endDateError ? "field-invalid" : ""
              }`}
              type="date"
              id="endDate"
              value={endDate}
              min={startDate || getAvailableDates()[0]} // Мінімальна доступна дата (якщо вказано початкову дату)
              max={getAvailableDates()[14]} // Максимальна доступна дата
              onChange={(e) => {
                setEndDate(e.target.value);
                setEndDateError(false);
              }}
            />
            {endDateError && (
              <span className="create-trip-popup__invalid-alert">
                Please fill in this field
              </span>
            )}
          </div>
        </div>
        <div className="create-trip-popup__footer">
          <div className="create-trip-popup__wrapper">
            <button
              onClick={onClose}
              className="create-trip-popup__cancel-button"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="create-trip-popup__save-button"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddTripPopup;
