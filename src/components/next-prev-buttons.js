import React, { useState } from "react";

const NextPrevButtons = () => {
  const [scrollPosition, setScrollPosition] = useState(0); // Додали стейт для відстеження поточної позиції прокрутки
  const tripsItem = document.querySelector(".trips__item");
  // Функція для переміщення вперед
  const scrollForward = () => {
    const tripsList = document.querySelector(".trips__list");
    if (tripsList) {
      tripsList.scrollLeft += tripsItem.offsetWidth + 50; // Прокручуємо вперед на ширину елемента списку
      setScrollPosition(tripsList.scrollLeft); // Оновлюємо поточну позицію прокрутки
    }
  };

  // Функція для переміщення назад
  const scrollBackward = () => {
    const tripsList = document.querySelector(".trips__list");
    if (tripsList) {
      tripsList.scrollLeft -= tripsItem.offsetWidth + 50; // Прокручуємо назад на ширину елемента списку
      setScrollPosition(tripsList.scrollLeft); // Оновлюємо поточну позицію прокрутки
    }
  };

  return (
    <div className="next-perv-buttons">
      <button className="next-perv-buttons__prev" onClick={scrollBackward}>
        Назад
      </button>
      <button className="next-perv-buttons__next" onClick={scrollForward}>
        Вперед
      </button>
    </div>
  );
};

export default NextPrevButtons;
