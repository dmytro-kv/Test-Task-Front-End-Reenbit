import React, { useState } from "react";
import AddTripPopup from "./add-trip-popup";

const AddTrip = ({ users, setUsers }) => {
  // Приймання масиву users та функції setUsers як проп
  const [showPopup, setShowPopup] = useState(false);

  const handleClick = () => {
    setShowPopup(true);
  };

  const handleSave = (tripData) => {
    const tripId = (
      parseInt(
        users.flatMap((user) => user.trips.map((trip) => trip.tripId)).pop()
      ) + 1
    ).toString();

    const updatedTrips = [...users[0].trips, { tripId, ...tripData }];
    const updatedUsersCopy = [...users];
    updatedUsersCopy[0].trips = updatedTrips;

    setUsers(updatedUsersCopy); // Виклик функції setUsers для оновлення масиву users
    setShowPopup(false);
  };

  return (
    <>
      <button className="add-trip" id="add-trip-btn" onClick={handleClick}>
        <img
          className="add-trip__icon"
          src="./images/other-icons/icon-plus.png"
          alt="Add trip"
        />
        <div className="add-trip__text">Add trip</div>
      </button>
      {showPopup && (
        <AddTripPopup onClose={() => setShowPopup(false)} onSave={handleSave} />
      )}
    </>
  );
};

export default AddTrip;
