export default {
  formatDate(isoDateString) {
    const date = new Date(isoDateString);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString()
      .padStart(2, "0");

    return `${year}${month}${day}`;
  },
  formatDateTime(isoDateString) {
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

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  },
};
