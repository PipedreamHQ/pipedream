export const getCommaSeparatedListFromArray = (arr) => {
  return arr?.length > 0
    ? arr.join(",")
    : undefined;
};

export const formatDateTime = (date) => {
  // Format the date as YYYY-MM-DD
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString()
    .padStart(2, "0");

  // Format the time as HH:MM:SS
  const hours = date.getHours().toString()
    .padStart(2, "0");
  const minutes = date.getMinutes().toString()
    .padStart(2, "0");
  const seconds = date.getSeconds().toString()
    .padStart(2, "0");

  // Combine the formatted date and time into a single string
  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return formattedDateTime;
};

export const getCurrentDateTimeMinusHours = (hours = 12) => {
  // Get the current date and time
  const currentDate = new Date();

  // Subtract hours hours from the current date and time
  const hoursAgo = new Date(currentDate.getTime() - hours * 60 * 60 * 1000);

  return hoursAgo;
};

