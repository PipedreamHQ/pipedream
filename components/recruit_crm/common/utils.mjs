function toSnakeCase(str) {
  return str?.replace(/([A-Z])/g, "_$1").toLowerCase();
}

function keysToSnakeCase(data = {}) {
  return Object.entries(data)
    .reduce((acc, [
      key,
      value,
    ]) => ({
      ...acc,
      [toSnakeCase(key)]: value,
    }), {});
}

function dataToCommaSeparatedList(data = {}) {
  return Object.entries(data)
    .reduce((acc, [
      key,
      value,
    ]) => ({
      ...acc,
      [key]: Array.isArray(value)
        ? value.join(",")
        : value,
    }), {});
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
  keysToSnakeCase,
  sortArrayByDate,
  dataToCommaSeparatedList,
};
