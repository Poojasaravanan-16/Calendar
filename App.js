import React, { useState } from 'react';
import CalendarGrid from './components/CalendarGrid';
import dayjs from 'dayjs';
import './styles/Calendar.css';

function App() {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');

  const handleDateClick = (date) => {
    const title = prompt("Enter event title:");
    if (title) {
      const newEvent = {
        id: Date.now(),
        title,
        date: dayjs(date).toISOString()
      };
      setEvents([...events, newEvent]);
    }
  };
  const handleDeleteEvent = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (confirmDelete) {
      setEvents(events.filter(event => event.id !== id));
    }
  };
  
  const handleEditEvent = (eventToEdit) => {
    const newTitle = prompt("Edit event title:", eventToEdit.title);
    if (newTitle && newTitle !== eventToEdit.title) {
      setEvents(events.map(event =>
        event.id === eventToEdit.id ? { ...event, title: newTitle } : event
      ));
    }
  };

  const handleSearch = () => {
    const found = events.find(e => e.title.toLowerCase().includes(search.toLowerCase()));
    if (found) {
      setCurrentDate(dayjs(found.date)); // ✅ ensure it's dayjs object
    } else {
      alert('Event not found!');
    }
  };

  return (
    <div className="container">
      <h1>Calendar</h1>

      <div className="header">
        <button onClick={() => setCurrentDate(currentDate.subtract(1, 'month'))}>Prev</button>
        <button onClick={() => setCurrentDate(dayjs())}>Today</button>

        <button onClick={() => setCurrentDate(currentDate.add(1, 'month'))}>Next</button>
        <input
          type="text"
          placeholder="Search event"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch}>Go</button>
      </div>

      <CalendarGrid
  currentDate={currentDate}
  events={events}
  onDateClick={handleDateClick}
  onDeleteEvent={handleDeleteEvent}
  onEditEvent={handleEditEvent}
/>
    </div>
  );
}

export default App;
