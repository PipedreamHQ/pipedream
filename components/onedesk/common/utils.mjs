async function iterate(iterations) {
  const items = [];
  for await (const item of iterations) {
    items.push(item);
  }
  return items;
}

function getDateOnly(date) {
  const dateStr = date instanceof Date
    ? date.toISOString()
    : date;
  return dateStr.split("T")[0];
}

function getDateAfterToday(days = 1) {
  const dateAfterToday = new Date();
  dateAfterToday.setDate(dateAfterToday.getDate() + days);
  return getDateOnly(dateAfterToday);
}

export default {
  iterate,
  getDateOnly,
  getDateAfterToday,
};
