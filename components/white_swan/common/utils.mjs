export default {
  convertISOToCustomFormat(isoDateString) {
    const date = new Date(isoDateString);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString()
      .padStart(2, "0");
    const hours = date.getHours().toString()
      .padStart(2, "0");
    const minutes = date.getMinutes().toString()
      .padStart(2, "0");
    const seconds = date.getSeconds().toString()
      .padStart(2, "0");

    const timezoneOffset = -date.getTimezoneOffset();
    const timezoneHours = Math.floor(Math.abs(timezoneOffset) / 60).toString()
      .padStart(2, "0");
    const timezoneMinutes = (Math.abs(timezoneOffset) % 60).toString().padStart(2, "0");
    const timezoneSign = timezoneOffset >= 0
      ? "+"
      : "-";

    const customFormat = `${year}${month}${day}T${hours}${minutes}${seconds}${timezoneSign}${timezoneHours}${timezoneMinutes}`;

    return customFormat;
  },
};
