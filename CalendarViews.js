// CalendarViews.js
import React from "react";
import dayjs from "dayjs";

export const WeekView = ({ currentDate, events, handleAddOrEditEvent, handleDeleteEvent }) => {
  const weekStart = currentDate.startOf("week");
  const days = Array.from({ length: 7 }, (_, i) => weekStart.add(i, "day"));

  return (
    <div className="grid grid-cols-7 gap-2 mt-4">
      {days.map((day) => {
        const dayEvents = events.filter(e => e.date === day.format("YYYY-MM-DD"));
        return (
          <div key={day} className="p-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg shadow-md">
            <h4 className="font-semibold mb-2">{day.format("ddd, MMM D")}</h4>
            {dayEvents.map((event, i) => (
              <div
                key={i}
                className="bg-purple-300 text-white p-2 rounded mb-1 cursor-pointer"
                onClick={() => {
                  const action = prompt("Type 'edit' or 'delete'");
                  if (action === "edit") handleAddOrEditEvent(day, event.title);
                  if (action === "delete") handleDeleteEvent(dayjs(event.date), event.title);
                }}
              >
                {event.title}
              </div>
            ))}
            <button
              onClick={() => handleAddOrEditEvent(day)}
              className="text-blue-600 text-sm mt-2 underline"
            >
              + Add Event
            </button>
          </div>
        );
      })}
    </div>
  );
};

export const DayView = ({ currentDate, events, handleAddOrEditEvent, handleDeleteEvent }) => {
  const dayEvents = events.filter(e => e.date === currentDate.format("YYYY-MM-DD"));

  return (
    <div className="p-6 bg-gradient-to-br from-pink-100 to-yellow-100 rounded-lg shadow-md max-w-md mx-auto mt-6">
      <h3 className="text-xl font-bold mb-4 text-center">{currentDate.format("dddd, MMMM D, YYYY")}</h3>
      {dayEvents.length > 0 ? (
        dayEvents.map((event, i) => (
          <div
            key={i}
            className="bg-green-300 text-white p-3 rounded mb-2 cursor-pointer"
            onClick={() => {
              const action = prompt("Type 'edit' or 'delete'");
              if (action === "edit") handleAddOrEditEvent(currentDate, event.title);
              if (action === "delete") handleDeleteEvent(currentDate, event.title);
            }}
          >
            {event.title}
          </div>
        ))
      ) : (
        <p className="text-gray-600 text-center">No events for this day.</p>
      )}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => handleAddOrEditEvent(currentDate)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          + Add Event
        </button>
      </div>
    </div>
  );
};
