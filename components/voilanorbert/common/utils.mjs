export const objectToString = (data) => {
  return Object.keys(data).reduce((prev, key) => {
    if (data[key] === undefined) return prev;
    return `${prev
      ? `${prev}&`
      : ""}${key}=${data[key]}`;
  }, "");
};
