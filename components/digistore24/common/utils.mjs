function getNestedProperty(obj, propertyString) {
  const properties = propertyString.split(".");
  return properties.reduce((prev, curr) => prev?.[curr], obj);
}

function formatStringDate(strDate) {
  return strDate.split(" ").join("T") + ".000Z";
}

export default {
  getNestedProperty,
  formatStringDate,
};
