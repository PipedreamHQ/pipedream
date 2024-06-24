import sugar from "sugar";

function formatDateTime(dateStr) {
  return sugar.Date.create(dateStr)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d+/, "");
}

export default {
  formatDateTime,
};
