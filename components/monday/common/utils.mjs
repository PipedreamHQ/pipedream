function emptyStrToUndefined(value) {
  const trimmed = typeof value === "string" && value.trim();
  return trimmed === ""
    ? undefined
    : value;
}

function strinfied(value) {
  return typeof value === "object"
    ? JSON.stringify(value)
    : emptyStrToUndefined(value);
}

function strNumber(value) {
  return Number.isInteger(parseInt(value, 10))
    ? parseInt(value, 10)
    : emptyStrToUndefined(value);
}

function toNumber(value) {
  return typeof value === "number"
    ? value
    : strNumber(value);
}

export function capitalizeWord(str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1);
}

export function getColumnOptions(allColumnData, columnId, useLabels = false) {
  const columnOptions = allColumnData.find(
    ({ id }) => id === columnId,
  )?.settings_str;
  if (columnOptions) {
    try {
      const labels = JSON.parse(columnOptions).labels;
      return (Array.isArray(labels)
        ? labels.map(({
          id, name,
        }) => useLabels
          ? name
          : ({
            label: name,
            value: id.toString(),
          }))
        : Object.entries(labels).map(
          ([
            value,
            label,
          ]) => useLabels
            ? label
            : ({
              label: label !== ""
                ? label
                : value,
              value,
            }),
        )).filter((str) => str);
    } catch (err) {
      console.log(`Error parsing options for column "${columnId}": ${err}`);
    }
  }
}

export default {
  emptyStrToUndefined,
  strinfied,
  toNumber,
};
