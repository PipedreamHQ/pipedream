export const objectToString = (data) => {
  return Object.keys(data).reduce((prev, key) => {
    return `${prev
      ? `${prev}&`
      : ""}${key}=${data[key]}`;
  }, "");
};
