export const parseString = (str)  => {
  if (typeof str === "string") {
    return JSON.parse(str);
  }
  return str;
};
