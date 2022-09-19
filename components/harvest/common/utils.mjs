const removeNullEntries = (obj) =>
  obj && Object.entries(obj).reduce((acc, [
    key,
    value,
  ]) => {
    const isNumber = typeof value === "number";
    const isBoolean = typeof value === "boolean";
    const isNotEmpyString = typeof value === "string" && value.trim() !== "";
    const isNotEmptyArray = Array.isArray(value) && value.length;
    const isNotEmptyObject =
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      Object.keys(value).length !== 0;
    isNotEmptyObject && (value = removeNullEntries(value));
    return ((value || value === false) &&
      (isNotEmpyString || isNotEmptyArray || isNotEmptyObject || isBoolean || isNumber))
      ? {
        ...acc,
        [key]: value,
      }
      : acc;
  }, {});

/* This function checks for date strings with the format YYYY-MM-DD
    examples
    2022-09-28
    2021-12-10
*/
const isValidDate = (dateString) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  const date = new Date(dateString);
  if (!dateString) {
    return false;
  }
  if (dateString.match(regex) === null) {
    return false;
  }
  const timestamp = date.getTime();
  if (typeof timestamp !== "number" || Number.isNaN(timestamp)) {
    return false;
  }
  return date.toISOString().startsWith(dateString);
};

/* This function checks for time strings with the format HH:MM AM/PM
    examples
    11:45PM
    11:45 PM
    11:45 pm
    11:45pm
    11:45AM
    11:45 AM
    11:45 am
    11:45am
*/
const isValidTime = (timeString) => {
  const regex = /([0-9]|0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])\s*([AaPp][Mm])$/;
  return timeString
    ? timeString.match(regex)
    : false;
};

export {
  removeNullEntries, isValidDate, isValidTime,
};
