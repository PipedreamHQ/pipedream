module.exports.dateToISOStringWithoutMs = (date) => {
  return date.toISOString().replace(/\.\d{3}Z$/, "Z");
};
