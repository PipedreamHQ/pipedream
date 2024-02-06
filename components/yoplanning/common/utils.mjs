async function streamIterator(stream) {
  const resources = [];
  for await (const resource of stream) {
    resources.push(resource);
  }
  return resources;
}

function summaryEnd(count, singular, plural) {
  if (!plural) {
    plural = singular + "s";
  }
  const noun = count === 1 && singular || plural;
  return `${count} ${noun}`;
}

function sortArrayByDate(array, dateField = "") {
  const isDescending = dateField.startsWith("-");
  const field = dateField.replace(/^-/, "");
  return Array.from(array)
    .sort((a, b) => {
      const aDate = new Date(a[field]);
      const bDate = new Date(b[field]);
      return isDescending
        ? bDate - aDate
        : aDate - bDate;
    });
}

export default {
  streamIterator,
  summaryEnd,
  sortArrayByDate,
};
