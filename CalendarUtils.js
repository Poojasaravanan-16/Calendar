import dayjs from 'dayjs';

export const generateMonthDays = (date) => {
  const start = date.startOf('month').startOf('week');
  const end = date.endOf('month').endOf('week');
  const days = [];
  let current = start;

  while (current.isBefore(end, 'day') || current.isSame(end, 'day')) {
    days.push(current);
    current = current.add(1, 'day');
  }

  return days;
};
