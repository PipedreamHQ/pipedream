async function iterate(iterations) {
  const items = [];
  for await (const item of iterations) {
    items.push(item);
  }
  return items;
}

function getDateFormatted(dateStr, yearsAgo = 0) {
  const date = dateStr && new Date(dateStr) || new Date();
  const year = date.getFullYear() - yearsAgo;
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month}-${day}`;
}

export default {
  iterate,
  getDateFormatted,
};
