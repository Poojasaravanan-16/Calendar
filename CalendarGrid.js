import React from 'react';
import { generateMonthDays } from './CalendarUtils';
import dayjs from 'dayjs';
import '../styles/Calendar.css';

const CalendarGrid = ({ currentDate, events, onDateClick, onDeleteEvent, onEditEvent }) => {
  const days = generateMonthDays(currentDate);
  const today = dayjs();

  const getEventsForDate = (date) => {
    return events.filter((event) => dayjs(event.date).isSame(date, 'day'));
  };

  return (
    <div>
      <h2 className="month-name">
        {dayjs(currentDate).format('MMMM YYYY')}
      </h2>

      <div className="grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="day-label">{day}</div>
        ))}

        {days.map((day, index) => {
          const isToday = today.isSame(day, 'day');
          const isCurrentMonth = day.month() === currentDate.month();
          const eventsForDay = getEventsForDate(day);

          return (
            <div
              key={index}
              className={`day ${isToday ? 'today' : ''} ${!isCurrentMonth ? 'dimmed' : ''}`}
              onClick={() => onDateClick(day)} // ✅ Handles adding new event
            >
              <div className="day-number">{day.date()}</div>

              {eventsForDay.map((event) => (
                <div key={event.id} className="event">
                  {event.title}
                  <span
                    className="edit-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditEvent(event);
                    }}
                  >
                    ✏️
                  </span>
                  <span
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteEvent(event.id);
                    }}
                  >
                    🗑️
                  </span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
