import React, { useState } from "react";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { WeekView, DayView } from "./CalendarViews";

dayjs.extend(isToday);
dayjs.extend(localizedFormat);

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("month");

  const startDay = view === "month"
    ? currentDate.startOf("month").startOf("week")
    : currentDate.startOf("week");

  const totalDays = view === "month" ? 42 : 7;
  const days = Array.from({ length: totalDays }, (_, i) => startDay.add(i, "day"));

  const handleAddOrEditEvent = (date, existingTitle = "") => {
    const title = prompt("Enter event title:", existingTitle);
    if (!title) return;
  
    const time = prompt("Enter event time (HH:mm)", "10:00");
    if (!time) return;
  
    const formattedDate = date.format("YYYY-MM-DD");
  
    const newEvent = { date: formattedDate, title, time };
  
    const updatedEvents = existingTitle
      ? events.map((e) =>
          e.date === formattedDate && e.title === existingTitle ? { ...e, title, time } : e
        )
      : [...events, newEvent];
  
    setEvents(updatedEvents);
    toast.success(existingTitle ? "Event updated!" : "Event added!");
  };

  const handleDeleteEvent = (date, title) => {
    const updated = events.filter(
      (e) => !(e.date === date.format("YYYY-MM-DD") && e.title === title)
    );
    setEvents(updated);
    toast.info("Event deleted.");
  };

  const handleToday = () => setCurrentDate(dayjs());

  const handleSearch = (query) => {
    setSearchQuery(query);
    const found = events.find((e) =>
      e.title.toLowerCase().includes(query.toLowerCase())
    );
    if (found) setCurrentDate(dayjs(found.date));
  };

  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-gradient-to-br from-blue-100 to-purple-200 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <div>
          <button onClick={() => setCurrentDate(currentDate.subtract(1, view))} className="btn">Prev</button>
          <button onClick={handleToday} className="btn mx-2">Today</button>
          <button onClick={() => setCurrentDate(currentDate.add(1, view))} className="btn">Next</button>
        </div>
        <h2 className="text-3xl font-bold text-center flex-1">{currentDate.format("MMMM YYYY")}</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="px-2 py-1 rounded border"
          />
          <select value={view} onChange={(e) => setView(e.target.value)} className="px-2 py-1 rounded border">
            <option value="month">Month</option>
            <option value="week">Week</option>
            <option value="day">Day</option>
          </select>
        </div>
      </div>

      {view === "month" && (
        <div className="grid grid-cols-7 gap-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="font-semibold text-center">{d}</div>
          ))}
          {days.map((day) => {
            const isCurrentMonth = day.month() === currentDate.month();
            const isToday = dayjs().isSame(day, "day");
            const dayEvents = filteredEvents.filter(
              (e) => e.date === day.format("YYYY-MM-DD")
            );

            return (
              <div
                key={day.format("DD-MM-YYYY")}
                className={`p-2 border rounded-md cursor-pointer ${
                  !isCurrentMonth ? "opacity-40" : "bg-white"
                }`}
                onClick={() => handleAddOrEditEvent(day)}
              >
                <div className={`text-sm ${isToday ? "bg-pink-500 text-white rounded-full w-6 h-6 text-center" : ""}`}>
                  {day.date()}
                </div>
                {dayEvents.map((event, i) => (
                  <div
                    key={i}
                    className="mt-1 p-1 bg-indigo-200 text-xs rounded cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      const action = prompt("Type 'edit' or 'delete':");
                      if (action === "edit") handleAddOrEditEvent(day, event.title);
                      if (action === "delete") handleDeleteEvent(day, event.title);
                    }}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {view === "week" && (
        <WeekView
          currentDate={currentDate}
          events={events}
          handleAddOrEditEvent={handleAddOrEditEvent}
          handleDeleteEvent={handleDeleteEvent}
        />
      )}

      {view === "day" && (
        <DayView
          currentDate={currentDate}
          events={events}
          handleAddOrEditEvent={handleAddOrEditEvent}
          handleDeleteEvent={handleDeleteEvent}
        />
      )}
    </div>
  );
};

export default Calendar;
